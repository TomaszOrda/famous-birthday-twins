from datetime import datetime
import json
import jdcal

GREGORIAN_MODEL = "http://www.wikidata.org/entity/Q1985727"
JULIAN_MODEL = "http://www.wikidata.org/entity/Q1985786"


def extract_month_day(entry):
    if entry['birthDate'][0] == '-':
        sign = -1
        birth_date = entry['birthDate'][1:].replace('Z', '+00:00')
    else:
        sign = 1
        birth_date = entry['birthDate'].replace('Z', '+00:00')

    date = datetime.fromisoformat(birth_date).date()
    date = (sign*date.year, date.month, date.day)

    if entry['calendarModel'] == GREGORIAN_MODEL:
        calendar_date = date
    elif entry['calendarModel'] == JULIAN_MODEL:
        calendar_date = jdcal.jd2jcal(*jdcal.gcal2jd(*date))
    else:
        raise ValueError("Unknown calendar model: ", entry['calendarModel'])

    return {
        "birthMonth": date[1],
        "birthDay": date[2],
        "birthMonthCalendar": calendar_date[1],
        "birthDayCalendar": calendar_date[2]
    }


class Birthdays:
    def __init__(self, raw_data) -> None:
        self.data = [
            entry | extract_month_day(entry)
            for entry in raw_data
            # if entry['birthDate'][0:4] != 'http'
        ]
        self.remove_duplicates()
        self.filter_low_site_links(min_links=50)

    def filter_low_site_links(self, min_links):
        self.data = [
            entry
            for entry in self.data
            if int(entry['siteLinks']) >= min_links or
            entry['birthMonth'] == 2 and entry['birthDay'] == 29 or
            entry['birthMonthCalendar'] == 2 and entry['birthDayCalendar'] == 29
        ]

    def remove_duplicates(self):
        ids_to_remove = set()
        pos_to_remove = set()
        seen = {}
        for pos, element in enumerate(self.data):
            if element['id'] not in seen:
                seen[element['id']] = element
            else:
                other = seen[element['id']]
                if (other['birthDay'], other['birthMonth']) != (element['birthDay'], element['birthMonth']):
                    ids_to_remove.add(element['id'])
                else:
                    pos_to_remove.add(pos)
        self.data = [
            entry
            for pos, entry in enumerate(self.data)
            if entry['id'] not in ids_to_remove
            if pos not in pos_to_remove
        ]

    def year_dictionary(self, gregorian=True):
        year = {}
        for idx, x in enumerate(sorted(self.data, key=lambda x: int(x['siteLinks']), reverse=True)):
            if gregorian:
                dict_key = f"{x['birthMonth']}-{x['birthDay']}"
            else:
                dict_key = f"{x['birthMonthCalendar']}-{x['birthDayCalendar']}"
            dict_value = {'person': x['name'], 'link': x['id'], 'siteLinks': x['siteLinks']}

            if dict_key not in year:
                year[dict_key] = [dict_value]
                if len(year) == 365:
                    print("365 days covered after", idx, "records")
                if len(year) > 365:
                    print("366 days covered after", idx, "records")
            else:
                year[dict_key].append(dict_value)
        sorted_year = {}
        for dict_key in sorted(year.keys(), key=lambda x: int(x.split('-')[0])*100 + int(x.split('-')[1])):
            sorted_year[dict_key] = year[dict_key]
        return sorted_year


if __name__ == "__main__":
    with open('query.json', encoding="UTF-8") as f:
        raw_query = json.load(f)

    birthdays = Birthdays(raw_query)

    with open('data.js', 'w', encoding="UTF-8") as f:
        f.write("birthdays = {\n")
        for key, value in birthdays.year_dictionary(gregorian=True).items():
            f.write(f'"{key}":{value},\n')
        f.write("}")

    with open('data_calendar.js', 'w', encoding="UTF-8") as f:
        f.write("birthdays_calendar = {\n")
        for key, value in birthdays.year_dictionary(gregorian=False).items():
            f.write(f'"{key}":{value},\n')
        f.write("}")

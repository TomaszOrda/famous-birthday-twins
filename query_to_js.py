import json


def extract_month_day(date_string):
    if date_string[0] == "-":
        date_string = date_string.split('-')[1:]
    else:
        date_string = date_string.split('-')
    return {
        "birth_month": int(date_string[1]),
        "birth_day": int(date_string[2][:2]),
    }


class Birthdays:
    def __init__(self, raw_data) -> None:
        self.data = [
            entry | extract_month_day(entry['birthDate'])
            for entry in raw_data
            # if entry['birthDate'][0:4] != 'http'
        ]

    def year_dictionary(self):
        year = {}
        for idx, x in enumerate(sorted(self.data, key=lambda x: int(x['siteLinks']), reverse=True)):
            dict_key = f"{x['birth_month']}-{x['birth_day']}"
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
        for key, value in birthdays.year_dictionary().items():
            f.write(f'"{key}":{value},\n')
        f.write("}")

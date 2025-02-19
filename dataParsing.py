import json


def extract_day(date_string):
    if date_string[0] == "-":
        date_string = date_string.split('-')[1:]
    else:
        date_string = date_string.split('-')
    return int(date_string[2][0:2])


def extract_month(date_string):
    if date_string[0] == "-":
        date_string = date_string.split('-')[1:]
    else:
        date_string = date_string.split('-')
    return int(date_string[1])


with open('query.json', encoding="UTF-8") as f:
    data = json.load(f)

data = [
    {
        **entry,
        "birth_month": extract_month(entry['birthdate']),
        "birth_day": extract_day(entry['birthdate'])
    }
    for entry in data
    if entry['birthdate'][0:4] != 'http'
]

year = {}
for idx, x in enumerate(sorted(data, key=lambda x: int(x['linkcount']), reverse=True)):
    key = f"{x['birth_month']}-{x['birth_day']}"
    value = {'person': x['itemLabel'], 'link': x['item'], 'linkcount': x['linkcount']}

    if key not in year:
        year[key] = [value]
        if len(year) == 365:
            print("365 days covered after", idx, "records")
        if len(year) > 365:
            print("366 days covered after", idx, "records")
    else:
        year[key].append(value)

with open('data.js', 'w', encoding="UTF-8") as f:
    f.write("birthdays = {\n")
    for key in sorted(year.keys(), key=lambda x: int(x.split('-')[0])*100 + int(x.split('-')[1])):
        f.write(f'"{key}":{year[key]},\n')
    f.write("}")

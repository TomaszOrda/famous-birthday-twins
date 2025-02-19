import json

with open('query.json', encoding="UTF-8") as f:
    data = json.load(f)

data_sorted = sorted(data, key=lambda x: int(x['linkcount']), reverse=True)
for x in reversed(data_sorted):
    if x['birthdate'][0:4] == 'http':
        data_sorted.remove(x)
        continue
    if x['birthdate'][0] == '-':
        birth_split = x['birthdate'].split('-')[1:]
    else:
        birth_split = x['birthdate'].split('-')

    x['birth_month'] = int(birth_split[1])
    x['birth_day'] = int(birth_split[2][0:2])
    del x['birthdate']

data_sorted_distinct = data_sorted[:]
prev = {}
for item in data_sorted:
    if prev == item:
        data_sorted_distinct.remove(item)
    else:
        prev = item

year = {}
days_covered = 0
for idx, x in enumerate(data_sorted):
    key = f"{x['birth_month']}-{x['birth_day']}"
    value = {'person': x['itemLabel'], 'link': x['item'], 'linkcount': x['linkcount']}

    if key not in year.keys():
        days_covered += 1
        if days_covered == 365:
            print("365 days covered after", idx, "records")
        if days_covered > 365:
            print("366 days covered after", idx, "records")
        year[key] = [value]
    else:
        year[key].append(value)

with open('data.js', 'w', encoding="UTF-8") as f:
    f.write("birthdays = {\n")
    for key in sorted(year.keys(), key=lambda x: int(x.split('-')[0])*100 + int(x.split('-')[1])):
        print(key, year[key])
        f.write(f'"{key}":{year[key]},\n')

    f.write("}")

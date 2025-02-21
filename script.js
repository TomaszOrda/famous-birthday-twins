function ordinalToCardinal(number){
    let numberStr = number.toString()
    if(numberStr === "11" || numberStr === "12")
        return numberStr + 'th'

    switch(numberStr.slice(-1)){
        case '1':
            return numberStr + 'st'
        case '2':
            return numberStr + 'nd'
        case '3':
            return numberStr + 'rd'
        default:
            return numberStr + 'th'
    }
}

function monthNumberToMonthName(month){
    const MONTHS = [null,
                    "January",  "February",     "March",
                    "April",    "May",          "June",
                    "July",     "August",       "September",
                    "October",  "November",     "December"]
    return MONTHS[month]
}

function createRow(values){
    let row = document.createElement("tr")
    for(value of values){
        let cell = document.createElement("td")
        cell.textContent = value
        row.appendChild(cell)
    }
    return row
}

function updateTable(){
    let birthday = document.getElementById('birthday').value
    if(birthday){
        let [_, month, day] = birthday.split('-')

        month = parseInt(month)
        day = parseInt(day)

        updateUrl(month, day)

        document.getElementById('day').textContent = ordinalToCardinal(day)
        document.getElementById('month').textContent = monthNumberToMonthName(month)
        document.getElementById('listOfTwins').style.display = "initial"
        
        let birthdayTwins = birthdays[`${month}-${day}`]
        let table = document.getElementById('listOfTwinsTable')
        table.innerHTML = ""
        table.appendChild(createRow(["", "", "Score"]))

        for(let x in birthdayTwins){
            let row = createRow(["•", birthdayTwins[x]['person'], birthdayTwins[x]['siteLinks']])
            row.setAttribute("onclick", `window.location='${birthdayTwins[x]['link']}';`);
            table.appendChild(row)
        }
    }

    let tableRows = document.getElementsByTagName("tr")
    let id = 1
    for (let item of tableRows){
        setTimeout(() => {
            item.style.visibility = 'visible'
        }, id * 200)
        id += 1
    }
}

function handleUrlParams(){
    let params = new URLSearchParams(document.location.search);
    if (params.get("day") && params.get("month")){

        dayParameter = params.get("day").toString().padStart(2, "0")
        monthParameter = params.get("month").toString().padStart(2, "0")

        let birthdayValue = `2024-${monthParameter}-${dayParameter}`

        document.getElementById('birthday').value = birthdayValue
        if (document.getElementById('birthday').value == birthdayValue)
            updateTable()  
    }   
}

function updateUrl(month, day){
    if (window.location.href.slice(0, 4) == "http"){
        // console.log(window.location.href.split("&")[0] + "?month=" + month +"&day=" + day);
        // console.log(history.replaceState)
        // const thisPage = new URL(window.location.href.split("&")[0]+"&month=" + month +"&day=" + day);

        // history.replaceState(window.location.href.split("&")[0], "",  "index.html&month=" + month +"&day=" + day)
        history.replaceState(null, "",  `?month=${month}&day=${day}`)
        // if (window.history.replaceState) {
        // //prevents browser from storing history with each change:
        // // window.history.replaceState(statedata, title, url);
        // const currentState = window.history.state;
        // date = document.getElementById('birthday').value.split("-")
    }
}
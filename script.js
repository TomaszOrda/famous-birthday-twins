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

function updateTable(){
    let birthday = document.getElementById('birthday').value
    if(birthday){
        let [_, month, day] = birthday.split('-')

        month = parseInt(month)
        day = parseInt(day)

        updateUrl(month, day)

        document.getElementById('day').innerHTML = ordinalToCardinal(day)
        document.getElementById('month').innerHTML = monthNumberToMonthName(month)
        document.getElementById('listOfTwins').style.display = "initial"
        
        let birthdayTwins = birthdays[`${month}-${day}`]
        let table = document.getElementById('listOfTwinsTable')
        document.getElementById('listOfTwinsTable').innerHTML = `
            <tr  >
                <td></td><td></td><td>Score</td>
            </tr>
            `

        for(let x in birthdayTwins)
            table.innerHTML = table.innerHTML + `
                <tr onclick="window.location='`+birthdayTwins[x]['link']+`';">
                    <td>&#x2022;</td><td>`+birthdayTwins[x]['person']+`</td><td>`+birthdayTwins[x]['linkcount']+`</td>
                </tr>
                `
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

        let dayParameter = params.get("day").toString()
        if (dayParameter.length == 1)
            dayParameter = "0" + dayParameter

        let monthParameter = params.get("month").toString().padStart(2, "0")
        if (monthParameter.length == 1)
            monthParameter = "0" + monthParameter

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
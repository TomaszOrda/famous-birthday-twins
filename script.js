function ordinalToCardinal(number){
    if(number == "11" || number == "12")
        return number + 'th'

    switch(number.slice(-1)){
        case '1':
            return number + 'st'
        case '2':
            return number + 'nd'
        case '3':
            return number + 'rd'
        default:
            return number + 'th'
    }
}

function monthNumberToMonthName(month){
    months = [  null,
                "January",  "February",     "March",
                "April",    "May",          "June",
                "July",     "August",       "September",
                "October",  "November",     "December"]
    return months[month]
}

function updateTable(){
    date = document.getElementById('birthday').value
    if(date){
        date = date.split('-')

        day = date[2]
        month = parseInt(date[1])
        if(day[0] == '0') day = day[1]
        updateUrl(month,day)

        document.getElementById('day').innerHTML = ordinalToCardinal(day)
        document.getElementById('month').innerHTML = monthNumberToMonthName(month)
        document.getElementById('listOfTwins').style.display = "initial"
        
        data = birthdays[month+"-"+day]
        table = document.getElementById('listOfTwinsTable')
        document.getElementById('listOfTwinsTable').innerHTML = `
            <tr  >
                <td></td><td></td><td>Score</td>
            </tr>
            `

        for(x in data)
            table.innerHTML = table.innerHTML + `
                <tr onclick="window.location='`+data[x]['link']+`';">
                    <td>&#x2022;</td><td>`+data[x]['person']+`</td><td>`+data[x]['linkcount']+`</td>
                </tr>
                `
    }

    tableRows = document.getElementsByTagName("tr")
    id = 1
    for (let item of tableRows){
        setTimeout(() => {
            item.style.visibility = 'visible'
        }, id*200)
        id += 1
    }
}

function handleUrlParams(){
    let params = new URLSearchParams(document.location.search);
    if(params.get("day") && params.get("month")){
        dayParameter   = params.get("day")
        monthParameter = params.get("month")
        dateValue = "2024-"+monthParameter+"-"+dayParameter
        document.getElementById('birthday').value = "2024-"+monthParameter+"-"+dayParameter
        if ( document.getElementById('birthday').value == "2024-"+monthParameter+"-"+dayParameter)
            updateTable()  
    }   
}

function updateUrl(month, day){
    if(window.location.href.slice(0, 4) == "http"){
        console.log(window.location.href.split("&")[0] + "&month=" + month +"&day=" + day);
        // console.log(history.replaceState)
        // const thisPage = new URL(window.location.href.split("&")[0]+"&month=" + month +"&day=" + day);

        // history.replaceState(window.location.href.split("&")[0], "",  "index.html&month=" + month +"&day=" + day)
        history.replaceState((window.location.href.split("&")[0], "",  "&month=" + month +"&day=" + day)
        // if (window.history.replaceState) {
        // //prevents browser from storing history with each change:
        // // window.history.replaceState(statedata, title, url);
        // const currentState = window.history.state;
        // date = document.getElementById('birthday').value.split("-")
    }

}

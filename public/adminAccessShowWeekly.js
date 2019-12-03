const seeWeeklyModal = document.querySelector("#showWeeklyModal");
const listOfMondays = document.querySelector("#seeWeeklyMondays");
const seeWeeklyModalTableRowOfShifts = document.querySelector("#seeWeeklyTableShifts");

async function seeWeeklyAction() {
    if (userRole === "Admin") {
        await populateMondays();
        dropdown_content.style.visibility = "hidden";
        seeWeeklyModal.style.display = "block";
        seeWeeklyModalTableRowOfShifts.innerHTML = "";
        listOfMondays.options[0].selected = true;
        listOfMondays.onchange();
    }
}

function seeWeeklyCloseModalAction() {
    seeWeeklyModal.style.display = "none";
    dropdown_content.style.visibility = "visible";
}

async function populateShifts() {
    let monday = new Date(listOfMondays.options[listOfMondays.selectedIndex].getAttribute("data-date"));
    seeWeeklyModalTableRowOfShifts.innerHTML = "";
    if (monday) {
        let date = new Date();
        date.setDate(monday.getDate() + 7);
        date.setHours(0, 0, 0);
        let shifts = await GET("/api/shifts/getShiftsInPeriod/" + monday + "/" + date);
        shifts.sort(function (a, b) {
            if (a.start.localeCompare(b.start) === 0) return a.end.localeCompare(b.end);
            return a.start.localeCompare(b.start);
        });
        for (let i = 0; i < 7; i++) {
            date = new Date();
            date.setDate(monday.getDate() + i);
            let newCell = seeWeeklyModalTableRowOfShifts.insertCell(-1);
            for (let j = 0; j < shifts.length; j++) {
                let dateOfCurrentDateInShifts = new Date(shifts[j].start).toDateString();
                if(dateOfCurrentDateInShifts === date.toDateString()) {
                    let div = document.createElement("div");
                    if (shifts[j].employee !== undefined) {
                        div.innerHTML += shifts[j].employee.name + "<br>";
                    }
                    else {
                        div.innerHTML += "Ingen ansat<br>";
                    }
                    div.innerHTML += shifts[j].start.substring(11, 16) + "<br>";
                    div.innerHTML += shifts[j].end.substring(11, 16) + "<br>";
                    div.innerHtml += shifts[j].totalHours + "";
                    newCell.appendChild(div);
                    let br = document.createElement('br');
                    newCell.appendChild(br);
                }
                else {
                    shifts.splice(0, j);
                    break;
                }
            }
        }
    }
}


async function populateMondays() {
    listOfMondays.innerHTML = "";
    let mondays = calculateMondays16Weeks();
    for (let monday of mondays) {
        let option = document.createElement("option");
        option.innerText = "ugenr: " + monday.getWeek();
        option.setAttribute("data-date", monday);
        option.onclick = populateShifts;
        listOfMondays.append(option);
    }
    listOfMondays.innerHTML += "<option></option>";
}




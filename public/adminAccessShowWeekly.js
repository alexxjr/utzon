const seeWeeklyModal = document.querySelector("#showWeeklyModal");
const listOfMondays = document.querySelector("#seeWeeklyMondays");
const seeWeeklyModalTableRowOfShifts = document.querySelector("#seeWeeklyTableShifts");

async function seeWeeklyAction() {
    if (userRole === "Admin") {
        await populateMondays();
        dropdown_content.style.visibility ="hidden";
        seeWeeklyModal.style.display = "block";
        seeWeeklyModalTableRowOfShifts
    }
}

function seeWeeklyCloseModalAction() {
    seeWeeklyModal.style.display = "none";
    dropdown_content.style.visibility ="visible";
}

async function populateShifts() {
    let monday =  new Date(listOfMondays.options[listOfMondays.selectedIndex].getAttribute("data-date"));
    seeWeeklyModalTableRowOfShifts.innerHTML = "";
    if(monday !== undefined) {
        for (let i = 0; i < 7; i++) {
            let date = new Date();
            date.setDate(monday.getDate()+i);
            let newCell = seeWeeklyModalTableRowOfShifts.insertCell(-1);
            let shifts = await GET("/api/shifts/" + date);
            newCell.innerHTML = shifts;
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




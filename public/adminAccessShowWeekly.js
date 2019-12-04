const seeWeeklyModal = document.querySelector("#showWeeklyModal");
const listOfMondays = document.querySelector("#seeWeeklyMondays");
const seeWeeklyModalTableRowOfShifts = document.querySelector("#seeWeeklyTableShifts");
let rowOfWeeklyShiftsTableHeads = document.querySelector("#seeWeeklyTableHeadRow");

/**
 * Opening the modal windows to see shifts of the week.
 */
async function seeWeeklyAction() {
    if (userRole === "Admin" || userRole === "Employee") {
        await populateMondays();
        dropdown_content.style.visibility = "hidden";
        seeWeeklyModal.style.display = "block";
        seeWeeklyModalTableRowOfShifts.innerHTML = "";
        listOfMondays.options[0].selected = true;
        listOfMondays.onchange();
    }
}

/**
 * Closing the modal window when done.
 */
function seeWeeklyCloseModalAction() {
    seeWeeklyModal.style.display = "none";
    dropdown_content.style.visibility = "visible";
}

/**
 * Find all shift for the week and sort them. Then generate the weekdays and dates for the table head.
 */
async function populateShifts() {
    if (userRole === "Admin" || userRole === "Employee") {
        //find the currently selected week by the monday representing it.
        let monday = new Date(listOfMondays.options[listOfMondays.selectedIndex].getAttribute("data-date"));
        seeWeeklyModalTableRowOfShifts.innerHTML = "";
        rowOfWeeklyShiftsTableHeads.innerHTML = "";

        //Days of the week in an Array
        let daysOfTheWeek = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

        //Create the next monday as a date
        let date = new Date(monday);
        date.setDate(monday.getDate() + 7);

        //Get the shifts between the chosen monday and the next monday.
        let shifts = await GET("/api/shifts/getShiftsInPeriod/" + monday + "/" + date);
        //Sort the date by day and starting/ending times.
        shifts.sort(function (a, b) {
            if (a.start.localeCompare(b.start) === 0) return a.end.localeCompare(b.end);
            return a.start.localeCompare(b.start);
        });
        //Go through each day of the week, so they can be added to the table.
        for (let i = 0; i < 7; i++) {
            date = new Date(monday);
            date.setDate(monday.getDate() + i);
            //Insert a new table row in head row
            let th = document.createElement('th');
            th.innerHTML = daysOfTheWeek[i] + "<br>" + date.toDateString().substring(3);
            rowOfWeeklyShiftsTableHeads.appendChild(th);
            insertShiftDetailsIntoDivIntoCellInTable(shifts, date);
        }
    }
}

/**
 * Use the shift to generate shift information. This information is put into a cell
 * matching the date in the info.
 */
function insertShiftDetailsIntoDivIntoCellInTable(shifts, date) {
    let newCell = seeWeeklyModalTableRowOfShifts.insertCell(-1);
    newCell.className = "CellsInWeekShiftPlan";
    for (let j = 0; j < shifts.length; j++) {
        let dateOfCurrentDateInShifts = new Date(shifts[j].start).toDateString();
        //Check if we're still on the same date as the first shift in the array.
        if (dateOfCurrentDateInShifts === date.toDateString()) {
            let div = document.createElement("div");
            div.className = "SeeWeekShiftPlanDivWithShift";
            if (shifts[j].employee !== undefined) {
                div.innerHTML += shifts[j].employee.name + "<br>";
            } else {
                div.innerHTML += "Ingen ansat<br>";
            }
            div.innerHTML += shifts[j].start.substring(11, 16) + "<br>";
            div.innerHTML += shifts[j].end.substring(11, 16) + "<br>";
            div.innerHtml += shifts[j].totalHours + "";
            newCell.appendChild(div);
            let br = document.createElement('br');
            newCell.appendChild(br);
        } else {
            //If not in the shift, splice out all the shifts in the date we just went through,
            // then start the loop over with the new date
            shifts.splice(0, j);
            break;
        }
    }
}

/**
 * Get the last monday and the next 16 mondays as date objects in an array.
 */
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
}

function printWeek(){
    let element = document.querySelector("#seeWeeklyTable");
    printElement(element);
    window.print();
}





/**
 * Onclick function for changing the month using right arrow button
 * The displayed month is changed to the following month
 * Days are generated according to how many days are in the following month
 * The amount of shifts on every day in the month, is also updated
 * If the next month is january, the function also changes the year
 */

async function nextMonth() {
    month++;
    if (month > 11) {
        year++;
        setYear();
        month = 0;
    }
    monthDisplay.innerHTML = monthArray[month];
    firstDayOfMonth = firstDayInMonth(month);
    insertDays();
    dayShift.innerHTML = "";
    await generateShiftOnDates();
    cancelAction();
}

/**
 * Onclick function for changing the month using the left arrow button
 * The displayed month is changed to the previous month
 * Days are generated according to how many days are in the previous month
 * The amount of shifts on every day in the month, is also updated
 * If the next month is january, the function also changes the year
 */

async function prevMonth() {
    month--;
    if (month < 0) {
        year--;
        setYear();
        month = 11;
    }
    monthDisplay.innerHTML = monthArray[month];
    firstDayOfMonth = firstDayInMonth(month);
    insertDays();
    dayShift.innerHTML = "";
    await generateShiftOnDates();
    cancelAction();
}

/**
 * Method that finds out which day is chosen in the calendar.
 * Returns a string with the year, month and chosen day in the month.
 * Throws an alert if no day is selected
 */

function createDate() {
    let dates = document.querySelectorAll(".daysList li");
    let monthNo = month + 1 + "";
    if (monthNo.length === 1) {
        monthNo = "0" + monthNo;
    }
    let date;
    for (let i = 0; i < dates.length; i++) {
        let isChosen = dates[i].getAttribute('chosen');
        if (isChosen === "true") {
            date = dates[i].getAttribute("date");

        }
    }
    if (date === undefined) {
        alert("vælg dato");
    } else {
        return year + "-" + monthNo + "-" + date;
    }
}

/**
 * Generates and displays the amount of shifts on every date for a month in a year
 * If there are no shifts on a certain day, it will display 0, and give it a red color
 * If there are shifts on a certain day, but one or more shifts does not have an employee attached,
 * it wil display the amount of shifts, and give it a yellow color
 * If there are shifts on a certain, and all the shifts have an employee attached, it wil display
 * the amount of shifts, and give it a green color.
 */
async function generateShiftOnDates() {
    let dates = document.querySelectorAll(".date");
    let allShifts = await GET("/api/shifts/");
    for (let i = 2; i <= dates.length + 1; i++) {
        let countShift = 0;
        let allShiftsHaveEmployee = true;
        let currentDate = new Date(year, month, i);
        for (let j = 0; j < allShifts.length; j++) {
            if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(allShifts[j].start)[0] ===
                /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(currentDate.toISOString())[0]) {
                if (!allShifts[j].employee) {
                    allShiftsHaveEmployee = false;
                }
                countShift++;
            }
        }
        let shiftCountDiv = dates[i - 2].getElementsByTagName("div")[1];
        if (shiftCountDiv) {
            let textnode = document.createTextNode(countShift + "");
            if (allShiftsHaveEmployee) {
                shiftCountDiv.style.backgroundColor = "#91A41C";
            } else {
                shiftCountDiv.style.backgroundColor = "#D6A41C";
            }
            if (countShift === 0) {
                shiftCountDiv.style.backgroundColor = "#811C1C";

            }
            shiftCountDiv.appendChild(textnode);
        }
    }
}


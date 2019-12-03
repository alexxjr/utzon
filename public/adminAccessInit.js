/**
 * Selects the HTML-element save button for later use
 */

let saveButton = document.querySelector("#saveBtn");

/**
 * Function for displaying or hiding the save button
 * The save button is displayed when updates have been made
 * (Creation, changing and deleting shifts)
 */

function saveButtonEnable() {
    if (updates.length === 0) {
        saveButton.style.display = "none";
    } else {
        saveButton.style.display = "block";
        window.onbeforeunload = function(e) {
            return e;
        };
    }
}

/**
 * Initialises the webpage
 * Selects today's date in the calendar
 * Generates all shifts on today's date and displays them
 * Gets all employees and puts them in as options in various employee-pickers
 */

async function siteInit() {
    await update();
    document.querySelector("#deleteBtn").onclick = deleteAction;
    document.querySelector("#nextBtn").onclick = nextMonth;
    document.querySelector("#prevBtn").onclick = prevMonth;
    allDates = document.querySelectorAll(".date");
    let today = new Date().getDate();
    if (today < 10) {
        today = "0" + today;
    }
    for (let i = 0; i < allDates.length; i++) {
        if (allDates[i].getAttribute("date") === (today + "")) {
            allDates[i].style.backgroundColor = "#9B9696";
            allDates[i].setAttribute('chosen', 'true');
        }
    }
    date = createDate();
    dayShift.innerHTML = await generateShifts(date);
    saveButtonEnable();
    await populateEmployeeSelection();
    await generateShiftOnDates();
}

/**
 * Logs out and return to the login screen
 */

async function logOutAction() {
    window.location.href = "api/login/logout";
}

/**
 * Initialises the webpage
 */

siteInit();


/**
 * Initialises updates array and day, month and year objects for various purposes
 * Initialises the user role
 */
let updates = [];
let allDates;
let monthArray = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
let daysArray = [];
let month;
let date = new Date(Date.now());
let year = date.getFullYear();
let firstDayOfMonth;
let userRole;

/**
 * Selects HTML-elements for later use
 */

const monthDisplay = document.querySelector("#monthDisplay");
const dayShift = document.querySelector("#hover");
const employeeSelectShift = document.querySelector("#employeeSelect");
const daysList = document.querySelector(".daysList");
const yearDisplay = document.querySelector("#yearDisplay");

/**
 * Sets the users role
 */

async function setUserRole() {
    userRole = await GET("/api/login/session");
}

/**
 * Generates the days in the calendar for the specified month and year
 * Every day contains 2 divs. The first div displays the day,
 * the other div will display the amount of shifts on every day in the month in that year
 */

function insertDays() {
    if (userRole === "Admin" || userRole === "Employee") {
        let days = daysArray[month];
        daysList.innerHTML = "";
        let day;
        for (let i = 1; i <= days; i++) {
            if (i < firstDayOfMonth) {
                let node = document.createElement("li");
                daysList.appendChild(node);
            } else {
                let j = i - firstDayOfMonth + 1;
                day = j + "";
                if (j < 10) {
                    day = "0" + j;
                }
                let node = document.createElement("li");
                node.classList.add("date");
                node.setAttribute('chosen', 'false');
                node.setAttribute("date", day + "");
                node.onclick = chooseDate;

                let dayDiv = document.createElement("div");
                let textnode = document.createTextNode(day);
                dayDiv.appendChild(textnode);
                dayDiv.style.float = "left";
                dayDiv.style.marginLeft = "44%";

                let shiftNoDiv = document.createElement("div");
                shiftNoDiv.style.float = "right";
                shiftNoDiv.style.marginRight = "22%";
                shiftNoDiv.style.paddingRight = "4px";
                shiftNoDiv.style.paddingLeft = "4px";
                shiftNoDiv.style.color = "white";

                node.appendChild(dayDiv);
                node.appendChild(shiftNoDiv);
                daysList.appendChild(node);
            }
        }
    }
}

/**
 * Calculates the amount of days in a certain month in a certain year
 * Sets the amount of days in the daysArray, which updates every time a new month is selected
 */

function calculateDaysInMonth() {
    if (userRole === "Admin" || userRole === "Employee") {
        for (let i = 0; i < 12; i++) {
            let blankDays = firstDayInMonth(i) - 1;
            if (i === 3 || i === 5 || i === 8 || i === 10) {
                daysArray[i] = 30 + blankDays;
            } else if (i === 1) {
                let isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
                if (isLeapYear)
                    daysArray[i] = 29 + blankDays;
                else
                    daysArray[i] = 28 + blankDays;
            } else
                daysArray[i] = 31 + blankDays;
        }
    }
}

/**
 * Sets the current year
 */

function setYear() {
    if (userRole === "Admin" || userRole === "Employee") {
        yearDisplay.innerHTML = year + "";
        calculateDaysInMonth();
    }
}

/**
 * Sets the current month
 */

function setCurrentMonth() {
    if (userRole === "Admin" || userRole === "Employee") {
        month = date.getMonth();
        firstDayOfMonth = firstDayInMonth(month);
        monthDisplay.innerHTML = monthArray[month];
    }
}

/**
 * Function that calls the setup functions for days, months and year
 */

async function update() {
    await setUserRole();
    if (userRole === "Admin" || userRole === "Employee") {
        setCurrentMonth();
        setYear();
        insertDays();
        setupEmployeeAccess();
        let hasUserAnEmployee = await GET("/api/login/loginWithEmployee");
        if (!hasUserAnEmployee){
            document.querySelector("#myShiftsBtn").style.display = "none";
        }
    } else {
        await logOutAction();
    }
}

/**
 * Gets all employees from the database
 * Inserts them in the different drop down menus for picking employees
 */

async function populateEmployeeSelection() {
    if (userRole === "Admin" || userRole === "Employee") {
        employeeSelectShift.innerHTML = "";
        let employees = await GET("/api/employees/");
        for (let e of employees) {
            let data = JSON.stringify(e);
            let option = document.createElement("option");
            option.innerText = e.name;
            option.setAttribute("data-employee", data);
            employeeSelectShift.append(option);
            let option2 = document.createElement("option");
            option2.innerText = e.name;
            option2.setAttribute("data-employee", data);
            employeeSelectViewEmployee.append(option2);

        }
        employeeSelectShift.innerHTML += "<option></option>";
    }
}

/**
 * Method for when a date has been chosen in the calendar.
 * Sets the color for the chosen date, and resets all other date's colors
 */

async function chooseDate() {
    if (userRole === "Admin" || userRole === "Employee") {
        shiftUpdate.style.display = "none";
        dayShift.style.display = 'inline-block';
        let allDates = document.querySelectorAll(".daysList li");
        allDates.forEach(date => {
            date.style.backgroundColor = "#eee";
            date.setAttribute("chosen", 'false');
        });
        this.style.backgroundColor = "#9B9696";
        this.setAttribute("chosen", 'true');
        let date = createDate();
        dayShift.innerHTML = await generateShifts(date);
        checkShiftsOnclick();
    }
}

/**
 * Checks if the generated shifts on a certain day have had changes
 * If a shift has unsaved changes, the onclick function of that shift is disabled
 */

function checkShiftsOnclick() {
    let shiftsOnDay = dayShift.getElementsByTagName("div");
    for (let i = 0; i < shiftsOnDay.length; i++) {
        let thisShift = document.querySelector("#shift" + i);
        if (thisShift.getAttribute("hasupdate") !== "unchanged") {
            thisShift.onclick = undefined;
        }
    }
}

/**
 * Finds the first day in a month in a year
 */

function firstDayInMonth(month) {
    let firstDay;
    let dateObject = new Date(year, month, 0);
    firstDay = dateObject.getDay() + 1;
    return firstDay;
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    let date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    let week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
};

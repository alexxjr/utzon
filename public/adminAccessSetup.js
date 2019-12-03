// Setup of dates
let updates = [];
let allDates;
let monthArray = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
let daysArray = [];
let month;
let date = new Date(Date.now());
let year = date.getFullYear();
let firstDayOfMonth;
let userRole;

const monthDisplay = document.querySelector("#monthDisplay");
const dayShift = document.querySelector("#hover");
const employeeSelectShift = document.querySelector("#employeeSelect");
const daysList = document.querySelector(".daysList");
const yearDisplay = document.querySelector("#yearDisplay");

async function setUserRole() {
    userRole = await GET("/api/login/session");
}

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
                shiftNoDiv.style.paddingRight = "4px"
                shiftNoDiv.style.paddingLeft = "4px"
                shiftNoDiv.style.color = "white";

                node.appendChild(dayDiv);
                node.appendChild(shiftNoDiv);


                daysList.appendChild(node);
            }
        }
    }
}

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

function setYear() {
    if (userRole === "Admin" || userRole === "Employee") {
        yearDisplay.innerHTML = year + "";
        calculateDaysInMonth();
    }
}

function setCurrentMonth() {
    if (userRole === "Admin" || userRole === "Employee") {
        month = date.getMonth();
        firstDayOfMonth = firstDayInMonth(month);
        monthDisplay.innerHTML = monthArray[month] + monthDisplay.innerHTML;
    }
}

async function update() {
    await setUserRole();
    if (userRole === "Admin" || userRole === "Employee") {
        setCurrentMonth();
        setYear();
        insertDays();
        setupEmployeeAccess();
    } else {
        await logOutAction();
    }
}

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

function checkShiftsOnclick() {
    let shiftsOnDay = dayShift.getElementsByTagName("div");
    for (let i = 0; i < shiftsOnDay.length; i++) {
        let thisShift = document.querySelector("#shift" + i)
        if (thisShift.getAttribute("hasupdate") !== "unchanged") {
            thisShift.onclick = undefined;
        }
    }
}

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

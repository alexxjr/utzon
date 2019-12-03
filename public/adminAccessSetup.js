// Setup of dates
let updates = [];
let allDates;
let monthArray = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
let daysArray = [];
let month;
let date = new Date(Date.now());
let year = date.getFullYear();
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
            day = i + "";
            if (i < 10) {
                day = "0" + i;
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
            dayDiv.style.marginLeft = "76px";



            let shiftNoDiv = document.createElement("div");
            shiftNoDiv.style.float = "right";
            shiftNoDiv.style.marginRight = "42px";
            shiftNoDiv.style.color = "blue";


            node.appendChild(dayDiv);
            node.appendChild(shiftNoDiv);






            daysList.appendChild(node);
        }
    }
}

function calculateDaysInMonth() {
    if (userRole === "Admin" || userRole === "Employee") {
        for (let i = 0; i < 12; i++) {
            if (i === 3 || i === 5 || i === 8 || i === 10) {
                daysArray[i] = 30;
            } else if (i === 1) {
                let isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
                if (isLeapYear)
                    daysArray[i] = 29;
                else
                    daysArray[i] = 28;
            } else
                daysArray[i] = 31;
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
    if (userRole === "Admin" ||userRole === "Employee") {
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
            date.style.backgroundColor = "#eee"
            date.setAttribute("chosen", 'false');
        });
        this.style.backgroundColor = "#bc9a5d";
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

// Setup of dates
let updates = [];
let allDates;
let monthArray = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
let daysArray = [];
let month;
let date = new Date(Date.now());
let year = date.getFullYear();
let userRole;

let monthDisplay = document.querySelector("#monthDisplay");
let dayShift = document.querySelector("#hover");
let employeeSelectShift = document.querySelector("#employeeSelect");

async function setUserRole() {
    userRole = await GET("/api/login/session");
    console.log(userRole);
}

function insertDays() {
    if (userRole === "Admin" || userRole === "Employee") {
        let daysList = document.querySelector(".daysList");
        let days = daysArray[month];
        daysList.innerHTML = "";
        let day;
        for (let i = 1; i <= days; i++) {
            day = i + "";
            if (i < 10) {
                day = "0" + i;
            }
            let node = document.createElement("li");
            let textnode = document.createTextNode(day);
            node.classList.add("date");
            node.appendChild(textnode);
            node.setAttribute('chosen', 'false');
            node.onclick = chooseDate;
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
        let yearDisplay = document.querySelector("#yearDisplay");
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
            employeeSelectAdminAccessEmployee.append(option2);

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
        this.style.backgroundColor = "darkkhaki";
        this.setAttribute("chosen", 'true');
        let date = createDate();
        dayShift.innerHTML = await generateShifts(date);
    }
}

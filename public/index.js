let updates = [];
let employees = [];
let monthDisplay = document.querySelector("#monthDisplay");
let yearDisplay = document.querySelector("#yearDisplay");
let daysList = document.querySelector(".daysList");
let dayShift = document.querySelector("#hover");
let shiftUpdate = document.querySelector("#shiftUpdate");
let datePicker = document.querySelector("#datePicker");
let startTimePicker = document.querySelector("#startTimePicker");
let endTimePicker = document.querySelector("#endTimePicker");
let totalHours = document.querySelector("#totalHours");
let employeeSelect = document.querySelector("#employeeSelect");
let select = document.querySelector("#select");
let monthArray = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
let daysArray = [];
let month;

// Selected items
let selectedShift;
let selectedShiftDiv;
let selectedShiftEmployee;

let date = new Date(Date.now());
let year = date.getFullYear();

let prevBtn = document.querySelector("#prevBtn");
prevBtn.onclick = prevMonth;
let nextBtn = document.querySelector("#nextBtn");
nextBtn.onclick = nextMonth;
let deleteBtn = document.querySelector("#deleteBtn");
deleteBtn.onclick = deleteAction;


update();

function update() {
    setCurrentMonth();
    setYear();
    insertDays();
}

function calculateDaysInMonth() {
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

function insertDays() {
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
        node.onclick = chooseDate;
        daysList.appendChild(node);
    }
}

async function chooseDate() {
    shiftUpdate.style.display = "none";
    dayShift.style.display = 'inline-block';
    let allDates = document.querySelectorAll(".date");
    allDates.forEach(date => {date.style.backgroundColor = "#eee"});
    this.style.backgroundColor = "cornflowerblue";
    let monthNo = month + 1 + "";
    if (monthNo.length === 1) {
        monthNo = "0" + monthNo;
    }
    let date = year + "-" + monthNo + "-" + this.innerText;
    let shifts = await GET("/api/shifts/" + date);
    dayShift.innerHTML = await generateShifts(shifts);

}

function setCurrentMonth() {
    month = date.getMonth();
    monthDisplay.innerHTML = monthArray[month] + monthDisplay.innerHTML;
}

function setYear() {
    yearDisplay.innerHTML = year + "";
    calculateDaysInMonth();
}

function nextMonth() {
    month++;
    if (month > 11) {
        year++;
        setYear();
        month = 0;
    }
    monthDisplay.innerHTML = monthArray[month];
    insertDays();
}

function prevMonth() {
    month--;
    if (month < 0) {
        year--;
        setYear();
        month = 11;
    }
    monthDisplay.innerHTML = monthArray[month];
    insertDays();
}


async function GETtext(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.text();
}

async function GET(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.json();
}

async function generateShifts(shifts) {
    let template = await GETtext('/shifts.handlebars');
    let compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({shifts});
}

Handlebars.registerHelper("formatDate", function(date) {
    date = date.toString();
    return /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(date);
});

Handlebars.registerHelper("formatTime", function(date) {
    date = date.toString();
    return /[0-9]{2}:[0-9]{2}/g.exec(date);
});

async function populateEmployeeSelection() {
    employees = await GET("/api/employees/");
    for (let e of employees) {
        employeeSelect.innerHTML += "<option>" + e.name + "</option>";
        select.innerHTML += "<option>" + e.name + "</option>";
    }
    employeeSelect.innerHTML += "<option></option>";
    select.innerHTML += "<option></option>";
}

async function shiftSelected(shiftID, employeeID, divID) {
    dayShift.style.display = "none";
    shiftUpdate.style.display = "inline-block";
    selectedShift = await GET("/api/shifts/getOneShift/" + shiftID);
    selectedShiftEmployee = selectedShift.employee;
    if (selectedShift.employee) {
        employeeSelect.value = selectedShiftEmployee.name;
    }
    else {
        employeeSelect.value = "";
    }
    datePicker.value = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(selectedShift.start);
    startTimePicker.value = /[0-9]{2}:[0-9]{2}/g.exec(selectedShift.start);
    endTimePicker.value = /[0-9]{2}:[0-9]{2}/g.exec(selectedShift.end);
    totalHours.value = selectedShift.totalHours;
    let shiftOK = document.querySelector("#shiftOK");
    shiftOK.onclick = okAction;
    selectedShiftDiv = document.querySelector("#shift"+divID);


}
//WRONG CHECK FOR EMPLOYEES HERE
function okAction() {
    let newStart = new Date(datePicker.value + "T" + startTimePicker.value + "Z");

    let newEnd = new Date(datePicker.value + "T" + endTimePicker.value + "Z");
    let newEmployee = undefined;
    if(employeeSelect.value !== "") {
        for (let i = 0; i < employees.length; i++) {
            if (employeeSelect.value === employees[i].name) {
                newEmployee = employees[i].name;
            }
        }
    }
        updates.push(createUpdate(selectedShift, newStart, newEnd, newEmployee));
        dayShift.style.display = "inline-block";
        shiftUpdate.style.display = "none";
        selectedShiftDiv.style.backgroundColor = "yellow";
        console.log(updates[0]);
}


function cancelAction() {
    dayShift.style.display = "inline-block";
    shiftUpdate.style.display = "none";
}

function deleteAction() {
    updates.push(createUpdate(selectedShift, undefined, undefined, undefined));
    dayShift.style.display = "inline-block";
    shiftUpdate.style.display = "none";
    selectedShiftDiv.style.backgroundColor = "red";

}

function hourCalculation(start, end) {
    let minutes = (Math.max(start.getMinutes(), end.getMinutes()) - Math.min(start.getMinutes(), end.getMinutes()));
    if (start.getMinutes() < end.getMinutes()) {
        return (end.getHours() - start.getHours()) + minutes / 60;
    } else {
        return (end.getHours() - start.getHours()) - minutes / 60;
    }
}

startTimePicker.addEventListener("click", async function () {
    totalHours.value = hourCalculation(startTimePicker.valueAsDate, endTimePicker.valueAsDate);
});
endTimePicker.addEventListener("click", async function () {
    totalHours.value = hourCalculation(startTimePicker.valueAsDate, endTimePicker.valueAsDate);
});

populateEmployeeSelection();


function createShiftAction() {
    document.getElementById("popup").style.display = "block";
    select.value = "";
    let start = document.querySelector("#createStartTime");
    let end = document.querySelector("#createEndTime");
    let createTotalHours = document.querySelector("#createTotalHours");
    start.addEventListener("click", async function(){
        createTotalHours.innerHTML = hourCalculation(start.valueAsDate, end.valueAsDate).toFixed(2);
    });
    end.addEventListener("click", async function(){
        createTotalHours.innerHTML = hourCalculation(start.valueAsDate, end.valueAsDate).toFixed(2)
    });
}



function closeForm() {
    document.getElementById("popup").style.display = "none";
    select.value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#createStartTime").value = "";
    document.querySelector("#createEndTime").value = "";
    document.querySelector("#createTotalHours").innerHTML = "00:00";
}

async function okCreateShift(){
    try {
        let thisShift = undefined;
        let newStart = document.querySelector("#createStartTime").value;
        let newEnd = document.querySelector("#createEndTime").value;
        let newEmployee = select.value;
        updates.push(createUpdate(thisShift, newStart, newEnd, newEmployee));
        closeForm()
        alert("Vagten er nu oprettet! Tryk gem for at tilføje vagten");
        console.log(updates)
    }catch (e){
        console.log(e.name + ": " + e.message);
    }
}

async function saveAction() {
        let url = "/api/shifts/updateShift/";
        await POST(updates, url);

}

async function POST(data, url) {
    const CREATED = 201;
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
    return await response.json();
};




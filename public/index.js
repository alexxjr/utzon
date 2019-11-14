let monthDisplay = document.querySelector("#monthDisplay");
let monthArray = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
let daysArray = [];
let month;
let date = new Date(Date.now());


update();

function update() {
    setCurrentMonth();
    calculateDaysInMonth();
}

function calculateDaysInMonth() {
    let year = date.getFullYear();
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
    let daysList = document.querySelector(".days");
    daysList.innerHTML = "";
    for (let i = 1; i <= days; i++) {
       daysList.innerHTML += "<li>" + i + "</li>";
    }
}

function setCurrentMonth() {
    month = date.getMonth();
    monthDisplay.innerHTML = monthArray[month];
}

let nextBtn = document.querySelector("#nextBtn");
nextBtn.onclick = nextMonth;

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
    }
    monthDisplay.innerHTML = monthArray[month];
    insertDays();
}

let prevBtn = document.querySelector("#prevBtn");
prevBtn.onclick = prevMonth;

function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
    }
    monthDisplay.innerHTML = monthArray[month];
    insertDays();
}
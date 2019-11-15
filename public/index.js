let monthDisplay = document.querySelector("#monthDisplay");
let yearDisplay = document.querySelector("#yearDisplay");
let monthArray = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
let daysArray = [];
let month;
let date = new Date(Date.now());
let year = date.getFullYear();
let shifts = document.getElementById("shifts");

let prevBtn = document.querySelector("#prevBtn");
prevBtn.onclick = prevMonth;
let nextBtn = document.querySelector("#nextBtn");
nextBtn.onclick = nextMonth;
let daysList = document.querySelector(".daysList");
daysList.onclick = chooseDate;


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
    for (let i = 1; i <= days; i++) {
       daysList.innerHTML += "<li class='days' onclick='chooseDate()'>" + i + "</li>";
    }
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

function chooseDate() {
    let date = new Date(year, month, this.getValue());
}

async function generateShiftList(shift) {
    let template = await GETtext('/shifts.handlebars');
    let compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({shift});
}

async function getShifts(url){
    shifts.innerHTML = "";
    const response = await GET(url);
    shifts.innerHTML = await generateShiftList(response);
}

async function GET(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.json();
};

async function GETtext(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.text();
}

async function POST(data, url) {
    const CREATED = 201;
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status !== CREATED)
        throw new Error("POST status code " + response.status);
    return await response.text();
};

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


function createDate() {
    let dates = document.querySelectorAll(".daysList li")
    let monthNo = month + 1 + "";
    if (monthNo.length === 1) {
        monthNo = "0" + monthNo;
    }
    let date;
    for (let i = 0; i < dates.length; i++) {
        let isChosen = dates[i].getAttribute('chosen');
        if (isChosen === "true") {
            date = dates[i].innerText;
        }
    }
    if (date === undefined) {
        alert("no date selected");
    }
    return year + "-" + monthNo + "-" + date;
}



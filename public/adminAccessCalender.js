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
    let monthNo = month + 1 + "";
    if (monthNo.length === 1) {
        monthNo = "0" + monthNo;
    }
    let date;
    allDates.forEach(d => {
        if (d.style.backgroundColor === "darkkhaki") {
            date = d;
        }
    });
    if (date === undefined) {
        alert("no date selected");
    }
    return year + "-" + monthNo + "-" + date.innerText;
}



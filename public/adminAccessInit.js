let saveButton = document.querySelector("#saveBtn");

function saveButtonEnable() {
    if (updates.length === 0) {
        saveButton.style.display = "none";
    } else {
        saveButton.style.display = "block";
    }
}

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
        if (allDates[i].innerText === (today + "")) {
            allDates[i].style.backgroundColor = "#bc9a5d";
            allDates[i].setAttribute('chosen', 'true');
        }

    }
    date = createDate();
    dayShift.innerHTML = await generateShifts(date);
    saveButtonEnable();



    await populateEmployeeSelection();
}

async function logOutAction() {
    window.location.href = "api/login/logout";
}

siteInit();
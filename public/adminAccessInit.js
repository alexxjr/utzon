async function siteInit() {
    update();
    document.querySelector("#deleteBtn").onclick = deleteAction;
    document.querySelector("#nextBtn").onclick = nextMonth;
    document.querySelector("#prevBtn").onclick = prevMonth;
    allDates = document.querySelectorAll(".date");
    let today = new Date();
    for (let i = 0; i < allDates.length; i++) {
        if (allDates[i].innerText === (today.getDate() + "")) {
            allDates[i].style.backgroundColor = "darkkhaki";
        }

    }
    date = createDate();
    dayShift.innerHTML = await generateShifts(date);

    await populateEmployeeSelection();
}

async function logOutAction() {
    console.log(window.location);
    let response = await GET("api/login/logout");

    window.location = "/response";
}

siteInit();
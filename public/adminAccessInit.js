async function siteInit() {
    update();
    document.querySelector("#deleteBtn").onclick = deleteAction;
    document.querySelector("#nextBtn").onclick = nextMonth;
    document.querySelector("#prevBtn").onclick = prevMonth;
    allDates = document.querySelectorAll(".date");
    let today = new Date();
    for (let i = 0; i < allDates.length; i++) {
        if (allDates[i].innerText === (today.getDate() + "")) {
            allDates[i].style.backgroundColor = "cornflowerblue";
        }

    }
    date = createDate();
    dayShift.innerHTML = await generateShifts(date);

    await populateEmployeeSelection();
}

siteInit();
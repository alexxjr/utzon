function createShiftAction() {
    document.getElementById("popup").style.display = "block";
    document.querySelector("#createStartTime").value = "00:00";
    document.querySelector("#createEndTime").value = "00:00";
    document.querySelector("#createStartDate").innerHTML = createDate();
    let start = document.querySelector("#createStartTime");
    let end = document.querySelector("#createEndTime");
    start.addEventListener("click", async function () {
        createTotalHours.innerHTML = hourCalculation(start.valueAsDate, end.valueAsDate).toFixed(2);
    });
    end.addEventListener("click", async function () {
        createTotalHours.innerHTML = hourCalculation(start.valueAsDate, end.valueAsDate).toFixed(2);
    });
};

async function okCreateShift() {
    try {
        let mydate = createDate();
        let thisShift = undefined;
        let newStart = document.querySelector("#createStartTime").value;
        let newEnd = document.querySelector("#createEndTime").value;
        let startDate = new Date(mydate + "T" + newStart + "Z");
        let endDate = new Date(mydate + "T" + newEnd + "Z");
        let newEmployee = undefined;
        let update = createUpdate(thisShift, startDate, endDate, newEmployee);
        updates.push(update);
        closeForm();
        alert("Vagten er nu oprettet! Tryk gem for at tilføje vagten");
    } catch (e) {
        console.log(e.name + ": " + e.message);
    }
}

function closeForm() {
    document.getElementById("popup").style.display = "none";
    document.querySelector("#createTotalHours").innerHTML = "00:00";
}
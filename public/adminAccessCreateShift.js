function createShiftModalAction() {
    document.getElementById("createShiftModal").style.display = "block";
    document.querySelector("#createStartTime").value = "00:00";
    document.querySelector("#createEndTime").value = "00:00";
    document.querySelector("#createStartDate").innerHTML = createDate();
    let start = document.querySelector("#createStartTime");
    let end = document.querySelector("#createEndTime");
    let createTotalHours = document.getElementById("createTotalHours");
    document.querySelector("#createStartDate").value = createDate();
    document.getElementById("popup").style.display = "block";
    start.value = "00:00";
    end.value = "01:00"



    start.addEventListener("input",  function () {
        timeChanged(start, end, createTotalHours);
    });

    end.addEventListener("input", function ()  {
        timeChanged(start, end, createTotalHours);

    });
}

async function okCreateShift() {
    try {
        let mydate = createDate();
        let thisShift = undefined;
        let newStart = document.querySelector("#createStartTime").value;
        let newEnd = document.querySelector("#createEndTime").value;
        let startDate = new Date(mydate + "T" + newStart + "Z");
        let endDate = new Date(mydate + "T" + newEnd + "Z");
        let newEmployee =undefined;
        let update = createUpdate(thisShift, startDate, endDate, newEmployee);
        updates.push(update);
        createShiftcloseModalAction();
        alert("Vagten er nu oprettet! Tryk gem for at tilføje vagten");
    } catch (e) {
        console.log(e.name + ": " + e.message);
    }
}

function createShiftcloseModalAction() {
    document.getElementById("createShiftModal").style.display = "none";
    document.querySelector("#createTotalHours").innerHTML = "00:00";
}


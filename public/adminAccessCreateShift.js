

function createShiftAction() {

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
        let newEmployee = employeeSelectCreateShift.value;
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
    employeeSelectCreateShift.value = "";
    document.querySelector("#createTotalHours").innerHTML = "00:00";
}


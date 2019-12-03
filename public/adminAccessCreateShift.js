const shiftModal = document.querySelector("#createShiftModal");
const startTimeInput = document.querySelector("#createStartTime");
const endTimeInput = document.querySelector("#createEndTime");
const DateLabel = document.querySelector("#createStartDate");
const totalHoursLabel = document.getElementById("createTotalHours");
let SelectedDate;

function createShiftModalAction() {
    SelectedDate = createDate();
    if (userRole === "Admin" && SelectedDate != undefined) {
        dropdown_content.style.visibility = "hidden";
        shiftModal.style.display = "block";
        DateLabel.innerHTML = SelectedDate;
        startTimeInput.value = "09:00";
        endTimeInput.value = "17:00";
        totalHoursLabel.innerHTML = "7.5";

        startTimeInput.addEventListener("input", function () {
            timeChanged(startTimeInput, endTimeInput, totalHoursLabel);
        });

        endTimeInput.addEventListener("input", function () {
            timeChanged(startTimeInput, endTimeInput, totalHoursLabel);
        });
    }
}

async function okCreateShift() {
    if (userRole === "Admin") {
        try {
            let thisShift = undefined;
            let newStart = startTimeInput.value;
            let newEnd = endTimeInput.value;
            let startDate = new Date(SelectedDate + "T" + newStart + "Z");
            let endDate = new Date(SelectedDate + "T" + newEnd + "Z");
            let newEmployee = undefined;
            let update = createUpdate(thisShift, startDate, endDate, newEmployee);
            updates.push(update);
            ShiftModalCloseAction();
            saveButtonEnable();
            alert("Vagten er nu oprettet! Tryk gem for at tilføje vagten");
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
    }
}

function ShiftModalCloseAction() {
    shiftModal.style.display = "none";
    dropdown_content.style.visibility = "visible";
}

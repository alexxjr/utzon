/**
 * Selects HTML-elements for later use
 */

const shiftModal = document.querySelector("#createShiftModal");
const startTimeInput = document.querySelector("#createStartTime");
const endTimeInput = document.querySelector("#createEndTime");
const DateLabel = document.querySelector("#createStartDate");
const totalHoursLabel = document.getElementById("createTotalHours");

/**
 * Instantiates a date used for finding the selected date. Is defined in other function.
 */
let SelectedDate;

/**
 * Opens the modal for creating a new shift
 * Sets some default values in the input fields
 * Adds listeners to the start- and endtime pickers,
 * the listener calls a function, that dynamically updates the total hours.
 */

function openCreateShiftModalAction() {
    SelectedDate = createDate();
    if (userRole === "Admin" && SelectedDate != undefined) {
        dropdown_content.style.visibility = "hidden";
        shiftModal.className += " visible";
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

/**
 * Attempts to create a update with the type of createShift.
 * Pushes the update to the updates array
 * Closes the modal for creating a shift
 * Enables the save changes button, since changes have been made
 * Alerts the user, to press the save changes button, to attempt to create the shift
 */

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

/**
 * Closes the modal for creating a new shift
 */

function ShiftModalCloseAction() {
    shiftModal.className = "modal";
    dropdown_content.style.visibility = "visible";
}

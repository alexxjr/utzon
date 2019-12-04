/**
 * Initialises different shift information, which will be set later
 */

let selectedShift;
let selectedShiftDiv;
let selectedShiftEmployee;

/**
 * Selects HTML-elements for later use
 */

let shiftUpdate = document.querySelector("#shiftUpdate");
let datePicker = document.querySelector("#datePicker");
let startTimePicker = document.querySelector("#startTimePicker");
let endTimePicker = document.querySelector("#endTimePicker");
let hourDisplay = document.querySelector("#totalHours");

/**
 * Method for generating all shifts on a certain date
 * Uses handlebars to template the way the shifts are displayed
 */

async function generateShifts(date) {
    if (userRole === "Admin" || userRole === "Employee") {
        let shifts = await GET("/api/shifts/" + date);
        let template = await GETtext('/shifts.handlebars');
        let compiledTemplate = Handlebars.compile(template);
        return compiledTemplate({shifts});
    }
}

/**
 * Function for when a shift on a day is selected
 * Gets the selected shift from the database, to set the current shift information
 * (The shift object is not able to be sent using handlebars,
 * it must therefore be retrieved from the database again
 * Opens the shifts so changes are able to be made
 */

async function shiftSelected(shiftID, employeeID, divID) {
    if (userRole === "Admin" || userRole === "Employee") {
        dayShift.style.display = "none";
        shiftUpdate.style.display = "inline-block";
        selectedShift = await GET("/api/shifts/getOneShift/" + shiftID);
        selectedShiftEmployee = selectedShift.employee;
        if (selectedShift.employee) {
            employeeSelectShift.value = selectedShiftEmployee.name;
        } else {
            employeeSelectShift.value = "";
        }
        datePicker.value = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(selectedShift.start);
        startTimePicker.value = /[0-9]{2}:[0-9]{2}/g.exec(selectedShift.start);
        endTimePicker.value = /[0-9]{2}:[0-9]{2}/g.exec(selectedShift.end);
        hourDisplay.innerHTML = selectedShift.totalHours;
        let shiftOK = document.querySelector("#shiftOK");
        shiftOK.onclick = okAction;
        selectedShiftDiv = document.querySelector("#shift" + divID);
    }
}

/**
 * Function for when the OK button is pressed after updating a shift
 * Checks whether or not any changes have been made to selected shift
 * If changes have been made to the selected shift, an update is created
 * The created update is pushes to the updates array.
 * The color of the updated shift is changed to green, to indicate that a change has been made
 * The onclick function of the updates shift is disabled, to secure that not more than on update
 * is made to a certain shift at once.
 * The updated shifts div information is set to what changes have been made to the shift
 * Enables the save changes button, since changes have been made
 */

function okAction() {
    if (userRole === "Admin") {
        let newStart = new Date(datePicker.value + "T" + startTimePicker.value + "Z");
        let newEnd = new Date(datePicker.value + "T" + endTimePicker.value + "Z");
        let newEmployee = undefined;
        if (employeeSelectShift.value !== "") {
            newEmployee = JSON.parse(employeeSelectShift[employeeSelectShift.selectedIndex].getAttribute('data-employee'))
        }
        let isUpdate = true;
        if ((selectedShiftEmployee !== undefined && newEmployee === undefined) ||
            (selectedShiftEmployee === undefined && newEmployee !== undefined)){
            //DO NOTHING
        }
        else if (selectedShiftEmployee === undefined && newEmployee === undefined
            && selectedShift.start === newStart.toISOString()
            && selectedShift.end === newEnd.toISOString()) {
            isUpdate = false;
        }
        else if (selectedShiftEmployee && newEmployee) {
            if (selectedShiftEmployee.name === newEmployee.name
                && selectedShift.start === newStart.toISOString()
                && selectedShift.end === newEnd.toISOString()) {
                isUpdate = false;
            }
        }

        if (isUpdate) {
            updates.push(createUpdate(selectedShift, newStart, newEnd, newEmployee));
            selectedShiftDiv.style.backgroundColor = "#91A41C";
            selectedShiftDiv.setAttribute("hasupdate", "changed");
            selectedShiftDiv.onclick = undefined;
        }

        dayShift.style.display = "inline-block";
        shiftUpdate.style.display = "none";


        let info = selectedShiftDiv.getElementsByTagName("li");
        if (newEmployee === undefined) {
            info[0].innerText = "Ingen ansat";
        } else {
            info[0].innerText = "Ansat: " + newEmployee.name;
        }
        info[1].innerText = "Dato: " + /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(newStart.toISOString());
        info[2].innerText = "Starttid: " + /[0-9]{2}:[0-9]{2}/g.exec(newStart.toISOString());
        info[3].innerText = "Sluttid: " + /[0-9]{2}:[0-9]{2}/g.exec(newEnd.toISOString());
    }
    checkShiftsOnclick();
    saveButtonEnable();
}

/**
 * Closes the update part of a selected shift
 * No updates or changes are made
 */

function cancelAction() {
    if (userRole === "Admin" || userRole === "Employee") {
        dayShift.style.display = "inline-block";
        shiftUpdate.style.display = "none";
    }
    checkShiftsOnclick();
}

/**
 * Marks a shift for deletion
 * The selected shift div's color is set to red, to indicate deletion
 * The selected shift's div's onclick function is disabled,
 * to ensure not more than on change is made to the same shift at once
 * A update with the type deleteShift is pushed to the updates array
 */

function deleteAction() {
    if (userRole === "Admin") {
        updates.push({
            shift: selectedShift,
            newStart: undefined,
            newEnd: undefined,
            newEmployee: undefined,
            type: "deleteShift"
        });
        dayShift.style.display = "inline-block";
        shiftUpdate.style.display = "none";
        selectedShiftDiv.style.backgroundColor = "#811C1C";
        selectedShiftDiv.setAttribute("hasupdate", "deleted");
    }
    checkShiftsOnclick();
    saveButtonEnable();
}

/**
 * Checks if an update had been made for a certain shift
 */

function hasShiftUpdate(shift) {
    for (let i = 0; i < updates.length; i++) {
        if (!shift || !updates[i].shift) {
            return;
        }
        if (shift._id === updates[i].shift._id) {
            return updates[i].type === "deleteShift";
        }
    }
    return undefined;
}

/**
 * Selects a color for a certain shift, depending on wheter or not the shift has an update
 * Red indicates a deletion update
 * Green indicated a change update
 * Original color is no changes are made
 */

function shiftUpdateColor(shift) {
    if (hasShiftUpdate(shift) === true) {
        return "#811C1C";
    }
    if (hasShiftUpdate(shift) === false) {
        return "#91A41C";
    }
    if (hasShiftUpdate(shift) === undefined) {
        return "#bc9a5d";
    }
}

/**
 * Handlebars helper method, that return if and what kind of update is for a certain shift
 */

Handlebars.registerHelper("checkUpdate", function (shift) {
    if (hasShiftUpdate(shift) === true) {
        return "deleted";
    }
    if (hasShiftUpdate(shift) === true) {
        return "changed";
    }
    if (hasShiftUpdate(shift) === undefined) {
        return "unchanged";
    }

});

/**
 * Handlebars helper method, that calls the update color method
 */

Handlebars.registerHelper("updateColor", function (shift) {
    return shiftUpdateColor(shift);
});

/**
 * Handlebars helper method, which formats a date
 */

Handlebars.registerHelper("formatDate", function (date) {
    date = date.toString();
    return /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(date);
});

/**
 * Handlebars helper method, which formats a date
 */

Handlebars.registerHelper("formatTime", function (date) {
    date = date.toString();
    return /[0-9]{2}:[0-9]{2}/g.exec(date);
});

/**
 * Adding listeners to startTimePicker,
 * which calls the method for dynamically updating the total hours
 */

startTimePicker.addEventListener("input", function () {
    timeChanged(startTimePicker, endTimePicker, hourDisplay);
});

/**
 * Adding listeners to endTimePicker,
 * which calls the method for dynamically updating the total hours
 */

endTimePicker.addEventListener("input", function () {
    timeChanged(startTimePicker, endTimePicker, hourDisplay);

});










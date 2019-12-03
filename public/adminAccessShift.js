let selectedShift;
let selectedShiftDiv;
let selectedShiftEmployee;

let shiftUpdate = document.querySelector("#shiftUpdate");
let datePicker = document.querySelector("#datePicker");
let startTimePicker = document.querySelector("#startTimePicker");
let endTimePicker = document.querySelector("#endTimePicker");
let hourDisplay = document.querySelector("#totalHours");

async function generateShifts(date) {
    if (userRole === "Admin" || userRole === "Employee") {
        let shifts = await GET("/api/shifts/" + date);
        let template = await GETtext('/shifts.handlebars');
        let compiledTemplate = Handlebars.compile(template);
        return compiledTemplate({shifts});
    }
}

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

        }
        else if (selectedShiftEmployee === undefined && newEmployee === undefined
            && selectedShift.start === newStart.toISOString()
            && selectedShift.end === newEnd.toISOString()) {
            isUpdate = false;
        }
        else if (selectedShiftEmployee.name === newEmployee.name
            && selectedShift.start === newStart.toISOString()
            && selectedShift.end === newEnd.toISOString())
        {
            isUpdate = false;
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

function cancelAction() {
    if (userRole === "Admin" || userRole === "Employee") {
        dayShift.style.display = "inline-block";
        shiftUpdate.style.display = "none";
    }
    checkShiftsOnclick();
}

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

function hasShiftUpdate(shift) {
    for (let i = 0; i < updates.length; i++) {
        if (!shift || !updates[i].shift) {
            return;
        }
        if (shift._id === updates[i].shift._id) {
            if(updates[i].type === "deleteShift") {
                return true;
            }
            else {
                return false;
            }
        }
    }
    return undefined;
}



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

Handlebars.registerHelper("updateColor", function (shift) {
    return shiftUpdateColor(shift);
});


Handlebars.registerHelper("formatDate", function (date) {
    date = date.toString();
    return /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(date);
});

Handlebars.registerHelper("formatTime", function (date) {
    date = date.toString();
    return /[0-9]{2}:[0-9]{2}/g.exec(date);
});


startTimePicker.addEventListener("input", function () {
    timeChanged(startTimePicker, endTimePicker, hourDisplay);
});

endTimePicker.addEventListener("input", function () {
    timeChanged(startTimePicker, endTimePicker, hourDisplay);

});










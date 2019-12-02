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
        hourDisplay.value = selectedShift.totalHours;
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
        updates.push(createUpdate(selectedShift, newStart, newEnd, newEmployee));
        dayShift.style.display = "inline-block";
        shiftUpdate.style.display = "none";
        selectedShiftDiv.style.backgroundColor = "yellow";
        selectedShiftDiv.onclick = undefined;
        let info = selectedShiftDiv.getElementsByTagName("li");
        info[0].innerText = "Ansat: " + newEmployee.name;
        info[1].innerText = "Dato: " + /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(newStart.toISOString());
        info[2].innerText = "Starttid: " + /[0-9]{2}:[0-9]{2}/g.exec(newStart.toISOString());
        info[3].innerText = "Sluttid: " + /[0-9]{2}:[0-9]{2}/g.exec(newEnd.toISOString());
    }
    checkShiftsOnclick();
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
        selectedShiftDiv.style.backgroundColor = "red";
    }
    checkShiftsOnclick();
}

function hasShiftUpdate(shift) {
    for (let i = 0; i < updates.length; i++) {
        if (shift._id === updates[i].shift._id) {
            if(updates[i].type === "deleteShift") {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function shiftUpdateColor(shift) {
    if (hasShiftUpdate(shift) === true) {
        return "red";
    }
    else if (hasShiftUpdate(shift) === false) {
        return "yellow";
    } else {
        return "blue";
    }
}

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










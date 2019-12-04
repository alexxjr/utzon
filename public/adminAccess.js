/**
 * Onclick function for saving changes made in shifts
 * Sends an array of updates through the adminPOST route
 * Stores failed updates in an array of errors
 * If no error happens alerts that all changes have been made
 * Else alerts all failed updates errors
 */

async function saveAction() {
    let saveScreen = document.getElementById("saveScreen");
    saveScreen.style.display = "block";
    window.onbeforeunload = undefined;
    if (userRole === "Admin") {
        if (updates.length === 0) {
            return;
        }
        let url = "/api/shifts/updateShift/";
        let errors = "";
        let response = await adminPOST(updates, url);
        if (response !== undefined) {
            for (let i = 0; i < response.length; i++) {
                errors += response[i].update.type + " fejl: " + response[i].error + "\n\n";
            }
            saveScreen.style.display = "none";
            alert(errors);
        }
        else {
            saveScreen.style.display = "none";
            alert("Alle ændringer er lavet i databasen");
        }
        location.reload();
    }
}

/**
 * Method for dynamically updating a total hours field of a shift
 * Also defensively and dynamically makes sure that it is not possible,
 * to select a start time that is before the end time.
 * Updates given start time, end time and total hours fields
 */
function timeChanged(startTimeHTML, endTimeHTML, totalHourHTML) {
    let startTime = startTimeHTML.valueAsDate;
    let endTime = endTimeHTML.valueAsDate;
    let endTimeString;
    if (endTime.getUTCHours() < 11) {
        endTimeString = "0" + (endTime.getUTCHours() - 1) + ":";
    }
    else {
        endTimeString = (endTime.getUTCHours() - 1) + ":"
    }
    if (endTime.getUTCMinutes() < 11) {
        endTimeString += "0" + endTime.getMinutes();
    }
    else {
        endTimeString += endTime.getMinutes() + "";
    }

    if (startTime.getUTCHours() === 23) {
        startTimeHTML.value = "00:00";
        startTime.setHours(1);
    }
    if (endTime.getUTCHours() < 1) {
        endTimeHTML.value = "00:00";
        endTime.setHours(1);
    }
    if (endTime.getUTCHours() === 0){
        endTimeHTML.value = "23:00";
        endTime.setHours(22);
    }
    if (startTime.getUTCHours() === endTime.getUTCHours()) {
        if (endTime.getUTCHours() === 23) {
            endTimeHTML.value = "00:00";
            endTime.setHours(1);
        }
        startTime.setHours(startTime.getUTCHours());
        startTimeHTML.value = endTimeString;
    }
    let result = hourCalculation(startTimeHTML.valueAsDate, endTimeHTML.valueAsDate);
    if (result >= 5) {
        totalHourHTML.innerHTML = result - 0.5;
    } else {
        totalHourHTML.innerHTML = result;
    }

}

/**
 * Calculates the total amount of decimal hours between two dates
 * (Example 1:00-2:45 = 1.75 hours)
 */

function hourCalculation(start, end) {
    let minutes = (Math.max(start.getMinutes(), end.getMinutes()) - Math.min(start.getMinutes(), end.getMinutes()));
    if (start.getMinutes() < end.getMinutes()) {
        return (end.getUTCHours() - start.getUTCHours()) + minutes / 60;
    } else {
        return (end.getUTCHours() - start.getUTCHours()) - minutes / 60;
    }
}

/**
 * Simple get function for fetching json from a url
 */

async function GET(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.json();
}

/**
 * Simple get function for fetching text from a url
 */

async function GETtext(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.text();
}

/**
 * Simple post function posting on a url as an Admin
 */

async function adminPOST(data, url) {
    const CREATED = 201;
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status === CREATED) {
        return;
    }
    return await response.json();
}


/**
 * Simple post function posting on a url as an Admin
 * Returns the posted data, if the post succeeds
 */

async function adminPOSTWithReturnOnSuccess(data, url) {
    const CREATED = 201;
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status === CREATED) {
        return await response.json();
    }
    return await response.json();
}
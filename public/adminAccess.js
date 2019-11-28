async function saveAction() {
    if (userRole === "Admin") {
        if (updates.length === 0) {
            return;
        }
        let url = "/api/shifts/updateShift/";
        let errors = "";
        let response = await POST(updates, url);
        if (response !== undefined) {
            for (let i = 0; i < response.length; i++) {
                errors += response[i].update.type + " fejl: " + response[i].error + "\n\n";
            }
            alert(errors);
        }
        location.reload();
    }
}
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


function hourCalculation(start, end) {
    let minutes = (Math.max(start.getMinutes(), end.getMinutes()) - Math.min(start.getMinutes(), end.getMinutes()));
    if (start.getMinutes() < end.getMinutes()) {
        return (end.getUTCHours() - start.getUTCHours()) + minutes / 60;
    } else {
        return (end.getUTCHours() - start.getUTCHours()) - minutes / 60;
    }
}

async function GET(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.json();
}

async function GETtext(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.text();
}

async function POST(data, url) {
    const CREATED = 201;
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status === CREATED) {
        alert("Alle ændringer er lavet i databasen");
        return;
    }
    return await response.json();
}
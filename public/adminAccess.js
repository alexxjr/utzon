async function saveAction() {
    if (updates.length === 0) {
        return;
    }
    let url = "/api/shifts/updateShift/";
    let errors = "";
    let response = await POST(updates, url);
    if(response !== undefined) {
        for (let i = 0; i < response.length; i++) {
            errors += response[i].update.type + " fejl: " + response[i].error + "\n\n";
        }
        alert(errors);
    }
    location.reload();
}

function hourCalculation(start, end) {
    let minutes = (Math.max(start.getMinutes(), end.getMinutes()) - Math.min(start.getMinutes(), end.getMinutes()));
    if (start.getMinutes() < end.getMinutes()) {
        return (end.getHours() - start.getHours()) + minutes / 60;
    } else {
        return (end.getHours() - start.getHours()) - minutes / 60;
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
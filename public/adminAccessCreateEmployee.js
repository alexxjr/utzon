function createEmployeeAction() {
    if (userRole === "Admin") {
        document.getElementById("createEmpModal").style.display = "block";
        document.querySelector("#empNavn").value = "";
        document.querySelector("#empNr").value = "";
        document.querySelector("#empMail").value = "";
        document.querySelector("#empCPR").value = "";
    }
}

async function okCreateEmployee() {
    if (userRole === "Admin") {
        let name = document.querySelector("#empNavn").value + "";
        let phoneNo = document.querySelector("#empNr").value + "";
        let email = document.querySelector("#empMail").value + "";
        let CPR = document.querySelector("#empCPR").value + "";
        // Her skal der laves ændringer så man kan oprette en ansat
        createEmpCloseModalAction();
        let response = await POST({CPR, name, email, phoneNo}, "/api/employees/");
        if (response !== undefined) {
            alert("Den ansatte blev ikke oprettet. \n" + response);
        } else {
            alert("Den ansatte er nu oprettet!");
            await populateEmployeeSelection()
        }
    }
}


function createEmpCloseModalAction() {
    document.getElementById("createEmpModal").style.display = "none";
}


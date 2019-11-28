function createEmployeeAction() {
    if (userRole === "Admin" ||userRole === "Employee") {
        document.getElementById("createEmpModal").style.display = "block";
        document.querySelector("#empNavn").value = "";
        document.querySelector("#empNr").value = "";
        document.querySelector("#empMail").value = "";
        document.querySelector("#empCPR").value = "";
    }
}

async function okCreateEmployee() {
    if (userRole === "Admin" ||userRole === "Employee") {
        try {
            let name = document.querySelector("#empNavn").value + "";
            let phoneNo = document.querySelector("#empNr").value + "";
            let email = document.querySelector("#empMail").value + "";
            let CPR = document.querySelector("#empCPR").value + "";
            // Her skal der laves ændringer så man kan oprette en ansat
            createEmpCloseModalAction();
            alert("Den asnatte er nu oprettet!");
            await POST({CPR, name, email, phoneNo}, "/api/employees/");
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
    }
}


function createEmpCloseModalAction() {
    document.getElementById("createEmpModal").style.display = "none";
}


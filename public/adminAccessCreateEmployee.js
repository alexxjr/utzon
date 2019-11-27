async function okCreateEmployee() {
    try {
        let name = document.querySelector("#empNavn").value + "";
        let phoneNo = document.querySelector("#empNr").value + "";
        let email = document.querySelector("#empMail").value + "";
        let CPR = document.querySelector("#empCPR").value + "";
        await POST({CPR, name, email, phoneNo}, "/api/employees/");
    } catch (e) {
        console.log(e.name + ": " + e.message);
    }
    closeForm2();
}



function createEmployeeAction() {
    document.getElementById("popup2").style.display = "block";
    document.querySelector("#empNavn").value = "";
    document.querySelector("#empNr").value = "";
    document.querySelector("#empMail").value = "";
    document.querySelector("#empCPR").value = "";
}

function closeForm2() {
    document.getElementById("popup2").style.display = "none";
}
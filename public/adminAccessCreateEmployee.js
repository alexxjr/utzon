let nameInput = document.getElementById("empNavn");
let phoneNoInput = document.getElementById("empNr");
let emailInput = document.getElementById("empMail");
let CPRInput = document.getElementById("empCPR");
let createEmployeePopup = document.getElementById("createEmployeeWindow");

async function okCreateEmployee() {
    try {
        let name = nameInput.value + "";
        let phoneNo = phoneNoInput.value + "";
        let email = emailInput.value + "";
        let CPR = CPRInput.value + "";
        await POST({CPR, name, email, phoneNo}, "/api/employees/");
    } catch (e) {
        console.log(e.name + ": " + e.message);
    }
    closeCreateEmployee();
}



function openCreateEmployee() {
    createEmployeePopup.style.display = "block";
    nameInput.value = "";
    phoneNoInput.value = "";
    emailInput.value = "";
    CPRInput.value = "";
}

function closeCreateEmployee() {
    createEmployeePopup.style.display = "none";
}

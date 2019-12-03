let loginSelect = document.querySelector("#selectLogin");
const dropdown_content = document.querySelector(".dropdown-content");
const empModal = document.querySelector("#createEmpModal");
const empNavn = document.querySelector("#empNavn");
const empNr = document.querySelector("#empNr");
const empMail = document.querySelector("#empMail");
const empCPR = document.querySelector("#empCPR");

async function createEmployeeAction() {
    if (userRole === "Admin") {
        await populateLogins();
        dropdown_content.style.visibility = "hidden";
        empModal.className += " visible";
        loginSelect.value = "";
        empNavn.value = "";
        empNr.value = "";
        empMail.value = "";
        empCPR.value = "";
        document.onclick = closeAnyModal;
    }
}

async function okCreateEmployee() {
    if (userRole === "Admin") {
        let name = empNavn.value + "";
        let phoneNo = empNr.value + "";
        let email = empMail.value + "";
        let CPR = empCPR.value + "";
        let loginid = loginSelect.options[loginSelect.selectedIndex].getAttribute("data-login");
        if (loginid === undefined) {
            alert("You must select a login for the employee");
            return;
        }
        createEmpCloseModalAction();
        let firstresponse = await adminPOSTWithReturnOnSuccess({CPR, name, email, phoneNo}, "/api/employees/");
        if (firstresponse.status === 400) {
            alert("Den ansatte blev ikke oprettet. \n" + firstresponse.body);
        } else {
            let employeeid = firstresponse;
            let secondresponse = await adminPOST({loginid, employeeid}, "/api/login/connectEmployee");
            if (secondresponse !== undefined) {
                let thirdresponse = await adminPOST({employeeid}, "/api/employees/deleteEmployee");
                if (thirdresponse !== undefined) {
                    alert("Fejl under oprettelsen, ring til tech support")
                } else {
                    alert("Fejl under oprettelsen. Prøv igen")
                }
            } else {
                alert("Den ansatte er nu oprettet!");
                await populateEmployeeSelection()
            }

        }
    }
}


function createEmpCloseModalAction() {
    empModal.className = "modal";
    dropdown_content.style.visibility = "visible";
}

async function populateLogins() {
    loginSelect.innerHTML = "";
    let logins = await GET("/api/login/getListOfLoginsWithoutEmployee");
    for (let l of logins) {
        let option = document.createElement("option");
        option.innerText = l.username;
        option.setAttribute("data-login", l._id);
        loginSelect.append(option);

    }
    loginSelect.innerHTML += "<option></option>";
}

function closeAnyModal() {
    dropdown_content.style.visibility = "visible";
    empModal.className = "modal";
    // loginModal.className = "modal";
    // shiftModal.className = "modal";
    // viewEmpModal.className = "modal";
}
let loginSelect = document.querySelector("#selectLogin");

async function createEmployeeAction() {
    if (userRole === "Admin") {
        await populateLogins();
        document.querySelector(".dropdown-content").style.visibility ="hidden";
        document.getElementById("createEmpModal").style.display = "block";
        loginSelect.value = "";
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
        let loginid = loginSelect.options[loginSelect.selectedIndex].getAttribute("data-login");
        if(loginid === undefined) {
            alert("You must select a login for the employee");
            return;
        }
        // Her skal der laves ændringer så man kan oprette en ansat
        createEmpCloseModalAction();
        let firstresponse = await adminPOSTWithReturnOnSuccess({CPR, name, email, phoneNo}, "/api/employees/");
        if (firstresponse.status === 400) {
            alert("Den ansatte blev ikke oprettet. \n" + firstresponse.body);
        } else {
            let employeeid = firstresponse;
            let secondresponse = await adminPOST({loginid, employeeid}, "/api/login/connectEmployee");
            if (secondresponse !== undefined) {
                let thirdresponse = await adminPOST({employeeid}, "/api/employees/deleteEmployee");
                if(thirdresponse !== undefined) {
                    alert("Fejl under oprettelsen, ring til tech support")
                }
                else {
                    alert("Fejl under oprettelsen. Prøv igen")
                }
            }
            else {
                alert("Den ansatte er nu oprettet!");
                await populateEmployeeSelection()
            }

        }
    }
}


function createEmpCloseModalAction() {
    document.getElementById("createEmpModal").style.display = "none";
    document.querySelector(".dropdown-content").style.visibility ="visible";
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


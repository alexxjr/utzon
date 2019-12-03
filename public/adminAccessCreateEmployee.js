/**
 * Saves HTML-elements for in variables for later use
 */

let loginSelect = document.querySelector("#selectLogin");
const dropdown_content = document.querySelector(".dropdown-content");
const empModal = document.querySelector("#createEmpModal");
const empNavn = document.querySelector("#empNavn");
const empNr = document.querySelector("#empNr");
const empMail = document.querySelector("#empMail");
const empCPR = document.querySelector("#empCPR");

/**
 * Opens the modal for creating a new employee
 * Sets some default values in the input fields
 */

async function openCreateEmployeeModal() {
    if (userRole === "Admin") {
        await populateLogins();
        dropdown_content.style.visibility ="hidden";
        empModal.style.display = "block";
        loginSelect.value = "";
        empNavn.value = "";
        empNr.value = "";
        empMail.value = "";
        empCPR.value = "";
    }
}

/**
 * Attempts to create an empolyee with a login
 * The login must be created before creating an employee and linking the login
 * If the creation fails before creating the employee object, an error is thrown
 * If the creation of employee succeeds, but the connection between employee and login fails,
 * an alert is thrown, and an attempt to delete the employee again is made.
 * If the creation of the employee succeeds, the connection between employee and login fails,
 * and the attempt to delete the employee. A error is thrown to call support,
 * because no employee object that does not have a login, is allowed to exist in the system.
 */

async function okCreateEmployee() {
    if (userRole === "Admin") {
        let name = empNavn.value + "";
        let phoneNo = empNr.value + "";
        let email = empMail.value + "";
        let CPR = empCPR.value + "";
        let loginid = loginSelect.options[loginSelect.selectedIndex].getAttribute("data-login");
        if(loginid === undefined) {
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

/**
 * Closes the modal for creating an employee
 */

function createEmpCloseModalAction() {
    empModal.style.display = "none";
    dropdown_content.style.visibility ="visible";
}

/**
 * Gets all logins from the database, and adds them as options for selecting logins
 * when creating an employee
 */

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


/**
 * Saves HTML-elements for in variables for later use
 */
const employeeOverviewModal = document.querySelector("#employeeOverview");
const employeeOverviewList = document.querySelector("#employeeOverviewList");

/**
 * Opening the modal that shows an overview of all employees
 */

async function employeeOverviewAction() {
    if (userRole === "Employee" || userRole ==="Admin") {
        dropdown_content.style.visibility ="hidden";
        employeeOverviewModal.style.display = "block";
    }
}

/**
 * Closing the modal window when done.
 */
function employeeOverviewCloseModalAction() {
    employeeOverviewModal.style.display = "none";
    dropdown_content.style.visibility = "visible";
}

/**
 * Populates employees in the modal
 */

async function populateEmployeeOverview() {
    let employees = await GET("/api/employees");
    for (let i = 0; i < employees.length; i++) {
        employeeOverviewList.innerHTML += "<li>Navn: " + employees[i].name + "</li>";
        employeeOverviewList.innerHTML += "<li>Email: " + employees[i].email + "</li>";
        employeeOverviewList.innerHTML += "<li>Tlfnr: " + employees[i].phoneNo + "</li><br>";
    }
}

populateEmployeeOverview();
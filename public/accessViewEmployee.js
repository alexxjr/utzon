/**
 * Saves HTML-elements in variables, to use for later
 */

const viewEmpModal = document.querySelector("#viewEmpModal");
const employeeSelectViewEmployee = document.querySelector("#selectEmp");
const startDatePicker = document.querySelector("#fromDatePicker");
const toDatePicker = document.querySelector("#toDatePicker");
const empTotalHours = document.querySelector("#empTotalHours");

/**
 * Opens the employee modal window
 * Sets som default values in time- and datepicker
 */

function viewEmpModalAction() {
    if (userRole === "Admin" || userRole === "Employee") {
        dropdown_content.style.visibility ="hidden";
        viewEmpModal.className += " visible";
        employeeSelectViewEmployee.value = "";
        startDatePicker.value = "0000-00-00";
        toDatePicker.value = "0000-00-00";
        empTotalHours.value = "";
    }
}

/**
 * Closes the employee modal window
 */

function closeModalAction() {
    viewEmpModal.className = "modal";
    dropdown_content.style.visibility ="visible";
}

/**
 * Calculates the amount of total hours for an employee's shifts between two dates
 * Sets the value in the total hours input in the employee modal
 */

async function totalHoursBetweenTwoDates() {
    let startDate = startDatePicker.value;
    let toDate = toDatePicker.value;
    if (!employeeSelectViewEmployee[employeeSelectViewEmployee.selectedIndex] || !startDate || !toDate) {
        return
    }
    let selectedEmployee = employeeSelectViewEmployee[employeeSelectViewEmployee.selectedIndex].getAttribute('data-employee');
    empTotalHours.value = await GET("/api/employees/getOneEmployeeHours/" + selectedEmployee + "/" + startDate + "/" + toDate);
}

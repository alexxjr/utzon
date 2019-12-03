const viewEmpModal = document.querySelector("#viewEmpModal");
const employeeSelectViewEmployee = document.querySelector("#selectEmp");
const startDatePicker = document.querySelector("#fromDatePicker");
const toDatePicker = document.querySelector("#toDatePicker");
const empTotalHours = document.querySelector("#empTotalHours");

function viewEmpModalAction() {
    if (userRole === "Admin" || userRole === "Employee") {
        dropdown_content.style.visibility ="hidden";
        viewEmpModal.style.display = "block";
        employeeSelectViewEmployee.value = "";
        startDatePicker.value = "0000-00-00";
        toDatePicker.value = "0000-00-00";
        empTotalHours.value = "";
    }
}

function closeModalAction() {
    viewEmpModal.style.display = "none";
    dropdown_content.style.visibility ="visible";
}

async function totalHoursBetweenTwoDates() {
    let startDate = startDatePicker.value;
    let toDate = toDatePicker.value;
    let selectedEmployee = employeeSelectViewEmployee.value;
    if (selectedEmployee) {
        selectedEmployee =  employeeSelectViewEmployee[employeeSelectViewEmployee.selectedIndex].getAttribute('data-employee');
    }
    let hours = await GET("/api/employees/getOneEmployeeHours/" + selectedEmployee + "/" + startDate + "/" + toDate);
    empTotalHours.value = hours;
}

let employeeSelectAdminAccessEmployee = document.querySelector("#select2");

function modalAction() {
    if (userRole === "Admin" || userRole === "Employee") {
        document.querySelector(".dropdown-content").style.visibility ="hidden";
        document.getElementById("empModal").style.display = "block";
        document.getElementById("select2").value = "";
        document.getElementById("fromDatePicker").value = "0000-00-00";
        document.getElementById("toDatePicker").value = "0000-00-00";
        document.getElementById("ansatTid").value = "";
    }
}

function closeModalAction() {
    document.getElementById("empModal").style.display = "none";
    document.querySelector(".dropdown-content").style.visibility ="visible";
}

async function totalHoursBetweenTwoDates() {
    let startDate = document.querySelector("#fromDatePicker").value;
    let toDate = document.querySelector("#toDatePicker").value;
    let selectedEmployee = employeeSelectAdminAccessEmployee.value;
    if (selectedEmployee) {
        selectedEmployee =  employeeSelectAdminAccessEmployee[employeeSelectAdminAccessEmployee.selectedIndex].getAttribute('data-employee');
    }
    let hours = await GET("/api/employees/getOneEmployeeHours/" + selectedEmployee + "/" + startDate + "/" + toDate);
    document.querySelector("#ansatTid").value = hours;
}

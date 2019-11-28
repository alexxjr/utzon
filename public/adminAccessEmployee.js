let employeeSelectAdminAccessEmployee = document.querySelector("#select2");

function modalAction() {
    document.getElementById("empModal").style.display = "block";
    document.getElementById("select2").value = "";
    document.getElementById("fromDatePicker").value = "0000-00-00";
    document.getElementById("toDatePicker").value = "0000-00-00";
    document.getElementById("ansatTid").value = "";
}

function closeModalAction() {
    document.getElementById("empModal").style.display = "none";
}

window.onclick = function(event) {
    if(event.target === document.getElementById("empModal")) {
        document.getElementById("empModal").style.display = "none";
    }
};

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

function ShowPassword() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

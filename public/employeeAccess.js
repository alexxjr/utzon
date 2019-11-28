const options = document.querySelector(".dropdown");


setupEmployeeAccess();

function setupEmployeeAccess() {
    if (userRole === "Employee") {
        options.style.display = "none";
    }
}

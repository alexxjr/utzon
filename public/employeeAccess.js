const options = document.querySelector(".dropdown");




function setupEmployeeAccess() {
    if (userRole === "Employee") {
        options.style.display = "none";
    }
}

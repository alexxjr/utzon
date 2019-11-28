function setupEmployeeAccess() {
    if (userRole === "Employee") {
        const options = document.querySelector(".dropdown");
        const saveBtn = document.querySelector("#saveBtn");

        options.style.display = "none";
        saveBtn.style.display = "none";
    }
}

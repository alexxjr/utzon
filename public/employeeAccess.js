/**
 * Method to check if it is an employee-login
 * It only gives access to specific parts of the system because it's an employee
 */

function setupEmployeeAccess() {
    if (userRole === "Employee") {
        const optionsBtn = document.querySelector("#createButton");
        const optionsBtn2 = document.querySelector("#createButton2");
        const saveBtn = document.querySelector("#saveBtn");
        const createLoginBtn = document.querySelector("#createLoginBtn");

        optionsBtn.style.display = "none";
        optionsBtn2.style.display = "none";
        saveBtn.style.display = "none";
        createLoginBtn.style.display = "none";
    }
}

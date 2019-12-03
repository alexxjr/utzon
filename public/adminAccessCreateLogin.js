const loginModal = document.querySelector("#createLoginModal");
const userNameInput = document.querySelector("#createUsername");
const passwordInput = document.querySelector("#createPassword");
const loginRoleSelect = document.querySelector("#loginRole");

function createLoginModalAction() {
    if (userRole === "Admin") {
        dropdown_content.style.visibility ="hidden";
        loginModal.style.display = "block";
        userNameInput.value = "";
        passwordInput.value = "";
    }
}

async function okCreateLogin() {
    if (userRole === "Admin"){
        let loginName = userNameInput.value + "";
        let loginPassword = passwordInput.value + "";
        let loginRole = loginRoleSelect.value + "";
        let response = await adminPOST({loginName, loginPassword, loginRole}, "api/login/createLogin");
        createLoginCloseModalAction();
        if (response !== undefined) {
            alert("Login blev ikke oprettet. \n" + response.body);
        }
    }
}


function createLoginCloseModalAction() {
    loginModal.style.display = "none";
    dropdown_content.style.visibility ="visible";
}

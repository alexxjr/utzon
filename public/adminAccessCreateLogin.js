/**
 * Selecting HTML-elements for later use
 */

const loginModal = document.querySelector("#createLoginModal");
const userNameInput = document.querySelector("#createUsername");
const passwordInput = document.querySelector("#createPassword");
const loginRoleSelect = document.querySelector("#loginRole");

/**
 * Opens the modal for creating a new login
 */

function openLoginModalAction() {
    if (userRole === "Admin") {
        dropdown_content.style.visibility ="hidden";
        loginModal.className += " visible";
        userNameInput.value = "";
        passwordInput.value = "";
        document.onclick = closeAnyModal;
    }
}

/**
 * Attempts to create a new login.
 * If the creation fails, alerts the user
 * Closes the modal for creating a new login
 */

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

/**
 * Closes the modal for creating a new login
 */

function createLoginCloseModalAction() {
    loginModal.className = "modal";
    dropdown_content.style.visibility ="visible";
}

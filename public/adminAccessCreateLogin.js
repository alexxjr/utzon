function createLoginModalAction() {
    if (userRole === "Admin") {
        document.getElementById("createLoginModal").style.display = "block";
        document.querySelector("#createUsername").value = "";
        document.querySelector("#createPassword").value = "";
    }
}

async function okCreateLogin() {
    // TODO
}


function createLoginCloseModalAction() {
    document.getElementById("createLoginModal").style.display = "none";
}


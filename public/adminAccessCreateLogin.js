function createLoginModalAction() {
    if (userRole === "Admin") {
        document.getElementById("createLoginModal").style.display = "block";
        document.querySelector("#createUsername").value = "";
        document.querySelector("#createPassword").value = "";
    }
}

async function okCreateLogin() {
    if (userRole === "Admin"){
        let loginName = document.querySelector("createUsername");
    }
}


function createLoginCloseModalAction() {
    document.getElementById("createLoginModal").style.display = "none";
}


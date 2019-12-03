function createLoginModalAction() {
    if (userRole === "Admin") {
        document.querySelector(".dropdown-content").style.visibility ="hidden";
        document.getElementById("createLoginModal").style.display = "block";
        document.querySelector("#createUsername").value = "";
        document.querySelector("#createPassword").value = "";
    }
}

async function okCreateLogin() {
    if (userRole === "Admin"){
        let loginName = document.querySelector("#createUsername").value + "";
        console.log(loginName);
        let loginPassword = document.querySelector("#createPassword").value + "";
        console.log(loginPassword);
        let loginRole = document.querySelector("#loginRole").value + "";
        console.log(loginRole);
        let response = await adminPOST({loginName, loginPassword, loginRole}, "api/login/createLogin");
        createLoginCloseModalAction();
        if (response !== undefined) {
            alert("Login blev ikke oprettet. \n" + response.body);
        }
    }
}


function createLoginCloseModalAction() {
    document.getElementById("createLoginModal").style.display = "none";
    document.querySelector(".dropdown-content").style.visibility ="visible";
}

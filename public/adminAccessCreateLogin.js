function createLoginModalAction() {
    if (userRole === "Admin") {
        document.getElementById("createLoginModal").style.display = "block";
        document.querySelector("#createUsername").value = "";
        document.querySelector("#createPassword").value = "";
    }
}

async function okCreateLogin() {
    if (userRole === "Admin"){
        let loginName = document.querySelector("createUsername").value + "";
        let loginPassword = document.querySelector("createPassword").value + "";
        if (response.status === 400) {
            alert("Den ansatte blev ikke oprettet. \n" + response.body);
        }
        else{

        }
    }
}


function createLoginCloseModalAction() {
    document.getElementById("createLoginModal").style.display = "none";
}


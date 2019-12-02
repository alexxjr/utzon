function createEmployeeAction() {
    if (userRole === "Admin") {
        document.getElementById("createEmpModal").style.display = "block";
        document.querySelector("#empNavn").value = "";
        document.querySelector("#empNr").value = "";
        document.querySelector("#empMail").value = "";
        document.querySelector("#empCPR").value = "";
        ('.navbar-nav>li>').on('click', function(){
            ('.navbar-collapse').collapse('hide');
        });
    }
}

async function okCreateEmployee(loginid) {
    if (userRole === "Admin") {
        let name = document.querySelector("#empNavn").value + "";
        let phoneNo = document.querySelector("#empNr").value + "";
        let email = document.querySelector("#empMail").value + "";
        let CPR = document.querySelector("#empCPR").value + "";
        // Her skal der laves ændringer så man kan oprette en ansat
        createEmpCloseModalAction();
        let response = await POST({CPR, name, email, phoneNo}, "/api/employees/");
        if (response.status === 400) {
            alert("Den ansatte blev ikke oprettet. \n" + response.body);
        } else {
            let employeeid = response.body;
            response = await POST({employeeid, loginid}, "/api/login/connectEmployee");
            if (response === 400) {
                response = await POST(employeeid, "/api/employees/deleteEmployee");
                if(response === 400) {
                    alert("Fejl under oprettelsen, ring til tech support")
                }
                else {
                    alert("Fejl under oprettelsen. Prøv igen")
                }
            }
            else {
                alert("Den ansatte er nu oprettet!");
                await populateEmployeeSelection()
            }

        }
    }
}


function createEmpCloseModalAction() {
    document.getElementById("createEmpModal").style.display = "none";
}


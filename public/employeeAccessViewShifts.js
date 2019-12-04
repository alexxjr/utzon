const myShiftsModal = document.querySelector("#myShiftsModal");
let shiftArea = document.querySelector("#shiftArea");
let myShiftsStart = document.querySelector("#myShiftsStart");
let myShiftsEnd = document.querySelector("#myShiftsEnd");

async function viewMyShiftsAction(){
    if (userRole === "Employee" || userRole ==="Admin") {
        dropdown_content.style.visibility ="hidden";
        myShiftsModal.style.display = "block";
    }
}

function myShiftsCloseModalAction() {
    myShiftsModal.style.display = "none";
    dropdown_content.style.visibility = "visible";
}

async function getShiftsForEmployee() {
    let allShifts = await GET("/api/employees/getLoginShifts/" + myShiftsStart.value + "/" + myShiftsEnd.value);
    shiftArea.innerHTML = "";
    for (let i = 0; i < allShifts.length; i++) {
        let startDate = new Date(allShifts[i].start);
        let endDate = new Date(allShifts[i].end);
        //Regex virker kun en gang, derfor har vi lavet to!!!!!
        let reg = /[0-9]{4}-[0-9]{2}-[0-9]{2} kl: [0-9]{2}:[0-9]{2}/g;
        let reg2 = /[0-9]{4}-[0-9]{2}-[0-9]{2} kl: [0-9]{2}:[0-9]{2}/g;
        shiftArea.innerHTML += "Vagt start: " +reg.exec(startDate.toISOString().replace(/[T]/, " kl: "))
                + "\n" + "Vagt slut: " +reg2.exec(endDate.toISOString().replace(/[T]/, " kl: ")) + "\n";
            shiftArea.innerHTML +="----------------------------------------------------";
    }
}
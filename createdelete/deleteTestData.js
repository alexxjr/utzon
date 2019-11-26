const controller = require('../controllers/Controller');

async function dostuff() {
    let employees = await controller.getEmployees();
    for (let employee of employees) {
        if (employee.CPR === "0123456789" || employee.CPR === "2013456789") {
            await controller.deleteEmployee(employee)
        }
    }
    let date1 = new Date("2017-01-01T00:00:00Z");
    let date2 = new Date("2018-12-30T23:59:59Z");
    let shifts = await controller.getShifts();x
    for (let shift of shifts) {
        if (shift.start.getTime() >= date1.getTime() && shift.end.getTime() <= date2.getTime()) {
            await controller.deleteShift(shift);
        }
    }
}

dostuff().then(r => 1+1);
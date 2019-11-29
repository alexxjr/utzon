const employeeController = require('../controllers/employeeController');
const shiftController = require('../controllers/shiftController');

let listOfCpr = ["0123456789", "2013456789", "9876543210"];

async function dostuff() {
    let employees = await employeeController.getEmployees();
    for (let employee of employees) {
        if (listOfCpr.includes(employee.CPR)) {
            if (employee.shifts.length !== 0) {
                for (let shift of employee.shifts) {
                    await employeeController.removeEmployeeFromShift(shift);
                }
            }
            await employeeController.deleteEmployee(employee)
        }
    }
    let date1 = new Date("2017-01-01T00:00:00Z");
    let date2 = new Date("2018-12-30T23:59:59Z");
    let shifts = await shiftController.getShifts();
    for (let shift of shifts) {
        if (shift.start.getTime() >= date1.getTime() && shift.end.getTime() <= date2.getTime()) {
            await shiftController.deleteShift(shift);
        }
    }
}

dostuff().then(r => 1+1);
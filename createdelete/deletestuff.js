const controller = require('../controllers/Controller');

async function dostuff() {
    let e1 = await controller.getEmployee("1234567890");
    if (e1 !== null) {
        await controller.deleteEmployee(e1);
    }
    let date1 = new Date("2019-11-16T12:00:00Z");
    let date2 = new Date("2019-11-16T14:00:00Z");
    let shifts = await controller.getShifts();
    for (let shift of shifts) {
        if (shift.start.getTime() === date1.getTime() && shift.end.getTime() === date2.getTime()) {
            await controller.deleteShift(shift);
        }
    }
}

dostuff().then(r => 1+1);
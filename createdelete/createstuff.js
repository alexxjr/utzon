const controller = require('../controllers/Controller');

async function dostuff() {
    let e1 = await controller.createEmployee('1234567890', 'John', 'Jonh@mail.com', '12345678');
    let s1 = await controller.createShift(new Date("2019-11-16T12:00:00Z"), new Date("2019-11-16T14:00:00Z"));
    await controller.addEmployeeToShift(e1, s1);
}

dostuff().then(r => 1+1);

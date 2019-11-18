const controller = require('./controllers/Controller');

exports.init = function () {
    let e1 = this.createEmployee('1234567890', 'John', 'Jonh@mail.com', '12345678');
    let s1 = this.createShift(new Date("2019-11-16T12:00:00Z"), new Date("2019-11-16T14:00:00Z"));
    let e2 = this.createEmployee('1234567890', 'Ole', 'Jonh@mail.com', '12345678');
    this.addEmployeeToShift(e1, s1);
};

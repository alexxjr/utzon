"use strict";

const Employee = require('../models/Employee');
const Shift = require('../models/Shift');


exports.createEmployee = function(CPR, name, email, phoneNo) {
    const employee = new Employee({
        CPR,
        name,
        email,
        phoneNo
    });
    return employee; //employee.save
}

exports.createShift = function(start, end, employee) {

    let totalHours = end.getHours() - start.getHours +
        (Math.max(start.getMinutes(),end.getMinutes()) - Math.min(start.getMinutes(),end.getMinutes()))/60;
    const shift = new Shift({
        start,
        end,
        totalHours,
        employee
    });
    return shift; //shift.save
}
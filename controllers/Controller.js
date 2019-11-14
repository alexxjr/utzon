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

    function time() {
        let time;
        let minutes = (Math.max(start.getMinutes(),end.getMinutes()) - Math.min(start.getMinutes(),end.getMinutes()));
        if (start.getMinutes() < end.getMinutes()) {
            time = (end.getHours() - start.getHours()) + minutes / 60;
        }
        else {
            time = (end.getHours() - start.getHours()) - minutes / 60;
        }
        return time;
    }

    let totalHours = time();
    const shift = new Shift({
        start,
        end,
        totalHours,
        employee
    });
    return shift; //shift.save
}

exports.addEmployeeToShift = function (employee, shift) {
    employee.shifts.push(shift);
    shift.employee = employee;
    return Promise.all([employee.save(), shift.save()]);
}

exports.removeEmployeeFromShift = function (employee, shift) {
    employee.shifts.push(shift);
    shift.employee = employee;
    return Promise.all([employee.save(), shift.save()]);
}

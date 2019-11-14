"use strict";

const Employee = require('../models/Employee');
const Shift = require('../models/Shift');


exports.createEmployee = function (CPR, name, email, phoneNo) {
    const employee = new Employee({
        CPR,
        name,
        email,
        phoneNo
    });
    return employee; //employee.save
}

exports.createShift = function (start, end) {

    function time() {
        let time;
        let minutes = (Math.max(start.getMinutes(), end.getMinutes()) - Math.min(start.getMinutes(), end.getMinutes()));
        if (start.getMinutes() < end.getMinutes()) {
            time = (end.getHours() - start.getHours()) + minutes / 60;
        } else {
            time = (end.getHours() - start.getHours()) - minutes / 60;
        }
        return time;
    }

    let totalHours = time();
    const shift = new Shift({
        start,
        end,
        totalHours
    });
    return shift; //shift.save
}

exports.addEmployeeToShift = function (employee, shift) {
    if (shift.employee !== undefined) {
    employee.shifts.push(shift);
    shift.employee = employee;
    return Promise.all([employee.save(), shift.save()]);
    } else {
        throw new Error("An employee is already attached to this shift");
    }

}

exports.removeEmployeeFromShift = function (employee, shift) {
    for(let i = 0; i < employee.shifts.length; i++) {
        if (employee.shifts[i] === shift) {
            employee.shifts.splice(i, 1);
            shift.employee = undefined;
            return;
        }
    }
    throw new Error("This employee is not attached to this shift");
}

exports.getEmployee = function (CPR) {
    return Employee.findOne({CPR : CPR}).exec();
}

exports.getEmployees = function(){
    return Employee.find().exec();
}

exports.getShifts = function(){
    return Shift.find().exec();
}

exports.getShiftsForEmployee = function(CPR) {
    return Employee.findOne({CPR : CPR}).exec().shifts;
}

exports.init = function () {
    let e1 = this.createEmployee('1234567890', 'John', 'Jonh@mail.com','12345678');
    let s1 = this.createShift(new Date("2015-03-25T12:00:00Z"), new Date("2015-03-25T14:00:00Z"));
}




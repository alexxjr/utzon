"use strict";

const Employee = require('../models/Employee');
const Shift = require('../models/Shift');


exports.createEmployee = function (CPR, name, email, phoneNo) {
    let CPRType = typeof CPR;
    let nameType = typeof name;
    let emailType = typeof email;
    let phoneNoType = typeof phoneNo;
    if (CPRType != "String" || nameType != "String" || emailType != "String" || phoneNoType != "String") {
        return undefined;
    }
    if (CPR.length != 10 || name.length < 1 || email.length < 1 || phoneNo.length < 1) {
        return undefined;
    }
    const employee = new Employee({
        CPR,
        name,
        email,
        phoneNo
    });
    return employee.save();
};

exports.createShift = function (start, end) {
    let startType = typeof start;
    let endType = typeof end;
    if (startType != "Date" || endType != "Date"); {
        return undefined;
    }

    // Calculates the amount of time (in decimal hours) a shift lasts
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
    return shift.save();
};

exports.addEmployeeToShift = function (employee, shift) {
    if (shift.employee !== undefined) {
        employee.shifts.push(shift);
        shift.employee = employee;
        return Promise.all([employee.save(), shift.save()]);
    } else {
        throw new Error("An employee is already attached to this shift");
    }

};

exports.removeEmployeeFromShift = function (employee, shift) {
    for (let i = 0; i < employee.shifts.length; i++) {
        if (employee.shifts[i] === shift) {
            employee.shifts.splice(i, 1);
            shift.employee = undefined;
            return;
        }
    }
    throw new Error("This employee is not attached to this shift");
};

exports.getEmployee = function (CPR) {
    return Employee.findOne({CPR: CPR}).exec();
};

exports.deleteEmployee = function (employee) {
    return Employee.deleteOne(employee).exec();
};

exports.getEmployees = function () {
    return Employee.find().exec();
};

exports.getShifts = function () {
    return Shift.find().exec();
};

exports.deleteShift = function (shift) {
    return Shift.deleteOne(shift);
};

exports.getShiftsForEmployee = function (CPR) {
    return Employee.findOne({CPR: CPR}).exec().shifts;
};

// exports.init = function () {
//     let e1 = this.createEmployee('1234567890', 'John', 'Jonh@mail.com', '12345678');
//     let s1 = this.createShift(new Date("2015-03-25T12:00:00Z"), new Date("2015-03-25T14:00:00Z"));
// };




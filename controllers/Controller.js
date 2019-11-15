"use strict";

const Employee = require('../models/Employee');
const Shift = require('../models/Shift');
const mongoose = require("../app");


exports.createEmployee = async function (CPR, name, email, phoneNo) {
    let CPRType = typeof CPR;
    let nameType = typeof name;
    let emailType = typeof email;
    let phoneNoType = typeof phoneNo;
    if (CPRType !== "string" || nameType !== "string" || emailType !== "string" || phoneNoType !== "string") {
        return undefined;
    }
    if (CPR.length !== 10 || name.length < 1 || email.length < 1 || phoneNo.length < 1) {
        return undefined;
    }
    const employee = new Employee({
        CPR,
        name,
        email,
        phoneNo
    });
    return await employee.save();
};

exports.createShift = async function (start, end) {
    if (Object.prototype.toString.call(start) !== '[object Date]' || Object.prototype.toString.call(end) !== '[object Date]') {
        return undefined;
    }
    if (end <= start) {
        return undefined;
    }

    // Calculates the amount of time (in decimal hours) a shift lasts
    function hourCalculation() {
        let time;
        let minutes = (Math.max(start.getMinutes(), end.getMinutes()) - Math.min(start.getMinutes(), end.getMinutes()));
        if (start.getMinutes() < end.getMinutes()) {
            time = (end.getHours() - start.getHours()) + minutes / 60;
        } else {
            time = (end.getHours() - start.getHours()) - minutes / 60;
        }
        return time;
    }

    let totalHours = hourCalculation();
    const shift = new Shift({
        start,
        end,
        totalHours
    });
    return await shift.save();
};

exports.addEmployeeToShift = function (employee, shift) {
    if (shift.employee === undefined) {
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

exports.getEmployee = async function (CPR) {
    return Employee.findOne({CPR: CPR}).exec();
};

exports.deleteEmployee = async function (employee) {
    return Employee.deleteOne(employee).exec();
};

exports.getEmployees = async function () {
    return Employee.find().exec();
};

exports.getShifts = async function () {
    return Shift.find().exec();
};

exports.deleteShift = async function (shift) {
    return Shift.deleteOne(shift);
};

exports.getShiftsForEmployee = async function (CPR) {
    return Employee.findOne({CPR: CPR}).exec().shifts;
};

// exports.init = function () {
//     let e1 = this.createEmployee('1234567890', 'John', 'Jonh@mail.com', '12345678');
//     let s1 = this.createShift(new Date("2015-03-25T12:00:00Z"), new Date("2015-03-25T14:00:00Z"));
// };




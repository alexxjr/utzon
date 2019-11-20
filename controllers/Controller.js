"use strict";

const Employee = require('../models/Employee');
const Shift = require('../models/Shift');
const mongoose = require("../app");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",
        pass: ""
    }
});


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
    if (await getEmployee(CPR) !== null) {
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

async function addEmployeeToShift(employee, shift) {
    if (shift === undefined || employee === undefined) {
        throw new Error("Shift or employee variable is empty");
    }
    if (shift.employee === undefined) {
        employee.shifts.push(shift);
        shift.employee = employee;
        return Promise.all([employee.save(), shift.save()]);
    } else {
        throw new Error("An employee is already attached to this shift");
    }

}

exports.addEmployeeToShift = addEmployeeToShift;

async function removeEmployeeFromShift(shift) {
    if (shift === undefined) {
        throw new Error("Shift variable is empty");
    }
    if (shift.employee === undefined) {
        throw new Error("This shift does not have an employee attached");
    }
    let employee = await getEmployeeWIthID(shift.employee);

    for (let i = 0; i < employee.shifts.length; i++) {
        if (employee.shifts[i]._id.toString() === shift._id.toString()) {
            employee.shifts.splice(i, 1);
            shift.employee = undefined;
            return Promise.all([employee.save(), shift.save()]);
        }
    }
}

exports.removeEmployeeFromShift = removeEmployeeFromShift;

async function getEmployeeWIthID(objectid) {
    return Employee.findOne({_id: objectid});
}

async function getEmployee(CPR) {
    return Employee.findOne({CPR: CPR}).exec();
}

exports.deleteEmployee = async function (employee) {
    return Employee.findByIdAndDelete(employee._id);
};

exports.getEmployees = async function () {
    return Employee.find().populate('shifts').exec();
};

exports.getShifts = async function () {
    return Shift.find().populate('employee').exec();
};

exports.getOneShift = async function (objectid) {
    return Shift.findOne({_id: objectid}).populate('employee');
};

async function deleteShift(shift) {
    return Shift.findByIdAndDelete(shift._id);
}

exports.getShiftsForEmployee = async function (CPR) {
    return Employee.findOne({CPR: CPR}).populate('shifts').exec().shifts;
};

exports.deleteShift = deleteShift;

exports.getShiftsOnDate = async function (date) {
    let result = [];
    let shifts = await this.getShifts();
    for (let i = 0; i < shifts.length; i++) {
        if (shifts[i].start.toDateString() === date.toDateString()) {
            result.push(shifts[i]);
        }
    }
    return result;
};

exports.manageIncomingUpdates = async function (updates) {
    let failures = [];
    for (let i = 0; i < updates.length; i++) {
        try {
            await updateShift(updates[i]);

        } catch (e) {
            failures.push({update: updates[i], error: e.message});
            updates.splice(i,1);
            i--;
        }
    }
    return failures;
};

async function sendUpdateMail(update) {

}
async function updateShift(update) {
    if (update === undefined) {
        throw new Error("One of the param variables are undefined");
    }
    if (update.shift === undefined) {
        throw new Error("Shift is not defined in the update object");
    }
    if ((update.newStart !== undefined && update.newEnd === undefined) || (update.newStart === undefined && update.newEnd !== undefined)) {
        throw new Error("One of the date objects are undefined");
    }

    let type = typeof update.shift;
    if (type !== 'object') {
        throw new Error("The shift object is not an object");
    }

    if (update.shift.constructor.modelName !== 'Shift') {
        throw new Error("The shift object is not a shift");
    }

    if (update.type === undefined) {
        throw new Error("No update type is given for this update");
    }

    let updateType = typeof update.type;
    if (updateType !== 'string') {
        throw new Error("The type variable is not a string");
    }

    switch (update.type) {
        case "addEmployeeToShift":
            await addEmployeeToShift(update.newEmployee, update.shift);
            break;
        case "removeEmployeeFromShift":
            await removeEmployeeFromShift(update.shift);
            break;
        case "changeShiftTimes":
            await changeShiftTime(update.shift, update.newStart, update.newEnd);
            break;
        case "changeShiftTimesAndEmployee":
            await changeShiftTime(update.shift, update.newStart, update.newEnd);
            await changeShiftEmployee(update.shift, update.newEmployee);
            break;
        case "changeShiftEmployee":
            await changeShiftEmployee(update.shift, update.newEmployee);
            break;
        case "changeShiftTimesAndAddEmployee":
            await changeShiftTime(update.shift, update.newStart, update.newEnd);
            await addEmployeeToShift(update.newEmployee, update.shift);
            break;
        case "changeShiftTimesAndRemoveEmployee":
            await changeShiftTime(update.shift, update.newStart, update.newEnd);
            await removeEmployeeFromShift(update.shift);
            break;
        case "deleteShift":
            if (update.shift.employee === undefined) {
                await deleteShift(update.shift);
            } else {
                await removeEmployeeFromShift(update.shift);
                await deleteShift(update.shift);
            }
            break;
        default:
            throw new Error("The update type is unknown")
    }
}

async function changeShiftTime(shift, newStart, newEnd) {
    if (shift === undefined || newStart === undefined || newEnd === undefined) {
        throw new Error("One of the param variables are undefined");
    }
    if (Object.prototype.toString.call(newStart) !== '[object Date]' || Object.prototype.toString.call(newEnd) !== '[object Date]') {
        return undefined;
    }
    if (newEnd <= newStart) {
        throw new Error("The enddate is before the startdate or they are equal");
    }
    shift.start = newStart;
    shift.end = newEnd;

    await shift.save();

}

exports.changeShiftTime = changeShiftTime;

async function changeShiftEmployee(shift, newEmployee) {
    if (shift === undefined || newEmployee === undefined) {
        throw new Error("One of the param variables are undefined");
    }


    if (shift.employee._id.toString() === newEmployee._id.toString()) {
        throw new Error("This employee is already attached to this shift")
    }

    await removeEmployeeFromShift(shift);
    await addEmployeeToShift(newEmployee, shift);

}

exports.changeShiftEmployee = changeShiftEmployee;

exports.getEmployee = getEmployee;
exports.getEmployeeWithId = getEmployeeWIthID;






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

exports.addEmployeeToShift = async function (employee, shift) {
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

};

exports.removeEmployeeFromShift = async function (shift) {
    if (shift === undefined) {
        throw new Error("Shift variable is empty");
    }
    if (shift.employee === undefined) {
        throw new Error("This shift does not have an employee attached");
    }
    for (let i = 0; i < shift.employee.shifts.length; i++) {
        if (shift.employee.shifts[i]._id.toString() === shift._id.toString()) {
            shift.employee.shifts.splice(i, 1);
            shift.employee = undefined;
            return Promise.all([employee.save(), shift.save()]);
        }
    }
};

async function getEmployee(CPR) {
    return Employee.findOne({CPR: CPR}).exec();
}

exports.deleteEmployee = async function (employee) {
    return Employee.findByIdAndDelete(employee._id);
};

exports.getEmployees = async function () {
    return Employee.find().exec();
};

exports.getShifts = async function () {
    return Shift.find().populate('employee').exec();
};

//For testing purposes
exports.getOneShift = async function (objectid) {
    return Shift.findOne({_id: objectid});
};

exports.deleteShift = async function (shift) {
    return Shift.findByIdAndDelete(shift._id);
};

exports.getShiftsForEmployee = async function (CPR) {
    return Employee.findOne({CPR: CPR}).populate('employee').exec().shifts;
};


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

exports.updateShift = async function(update) {
  if (update === undefined) {
      throw new Error("One of the param variables are undefined");
  }
  if (update.shift === undefined) {
      throw new Error("Shift is not defined in the update object");
  }
  if ((update.newStart !== undefined && update.newEnd === undefined) || (update.newStart === undefined && update.newEnd !== undefined)) {
      throw new Error("One of the date objects are undefined");
  }
  if (update.shift.constructor.collection.name !== 'Shift'){
      throw new Error("The shift object is not a shift");
  }
  if (update.newStart !== undefined && update.newEnd !== undefined) {
      if (update.newEmployee === undefined) {
          await changeShiftTime(update.shift, update.newStart, update.newEnd);
      }
      else {
          await changeShiftTime(update.shift, update.newStart, update.newEnd);
          await changeShiftEmployee(update.shift, update.newEmployee);
      }
  }
  else {
      if (update.newEmployee === undefined) {
          throw new Error("Both dates and employee are undefined");
      }
      await changeShiftEmployee(update.shift, update.newEmployee);
  }
};

exports.changeShiftTime = async function (shift, newStart, newEnd) {
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

};

exports.changeShiftEmployee = async function (shift, newEmployee) {
    if (shift === undefined || newEmployee === undefined) {
        throw new Error("One of the param variables are undefined");
    }
    if (shift.employee.CPR === newEmployee.CPR){
        throw new Error("This employee is already attached to this shift")
    }

    await removeEmployeeFromShift(shift.employee);
    await addEmployeeToShift(newEmployee, shift);

};

exports.getEmployee = getEmployee;






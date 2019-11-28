// Import of employee model
const ModelEmployee = require('../models/Employee');
// Import of mongoose, to be used for storage
const mongoose = require("../app");
// Import of general controller
const controller = require("../controllers/Controller.js");
// Import of shift controller
const shiftController = require("../controllers/shiftController");

// ********** SETTERS ********** //

/**
Function that creates an employee with a CPR, name, email and phoneNo.
Currently the email will always be set to "utzonreceive@gmail.com".
After creation of the employee object, it will be saved in mongoDB
 */
async function createEmployee(CPR, name, email, phoneNo) {
    let CPRType = typeof CPR;
    let nameType = typeof name;
    let emailType = typeof email;
    let phoneNoType = typeof phoneNo;
    if (CPRType !== "string" || nameType !== "string" || emailType !== "string" || phoneNoType !== "string") {
        throw new Error("One of the variables for the employee is not a string")
    }
    if (CPR.length !== 10 || name.length < 1 || email.length < 1 || phoneNo.length < 1) {
        throw new Error("One or more of the variable strings are the wrong length")
    }
    if (await getEmployee(CPR) !== null) {
        throw new Error("The employee already exists in the database")
    }
    const employee = new ModelEmployee({
        CPR,
        name,
        email: "utzonreceive@gmail.com",
        phoneNo
    });
    return await employee.save();
}

/**
Function for adding an employee to a shift and vice versa
If both employee and shift are of correct types and format,
the links will be set, and the updated objects will be saved in mongoDB
 */
async function addEmployeeToShift(employee, shift) {
    shiftController.checkShift(shift);

    employee = await getEmployeeWithID(employee._id);
    shift = await shiftController.getOneShift(shift._id);

    if (employee === undefined) {
        throw new Error("Employee variable is empty");
    }
    if (shift.employee === undefined) {
        employee.shifts.push(shift);
        shift.employee = employee;
        return Promise.all([employee.save(), shift.save()]);
    } else {
        throw new Error("An employee is already attached to this shift");
    }

}

/**
Function for removing an employee to a shift and vice versa
If both employee and shift are of correct types and format,
the links will be removed, and the updated objects will be saved in mongoDB
 */
async function removeEmployeeFromShift(shift) {
    shiftController.checkShift(shift);
    if (shift.employee === undefined) {
        throw new Error("This shift does not have an employee attached");
    }
    let employee = await getEmployeeWithID(shift.employee);
    shift = await shiftController.getOneShift(shift._id);


    for (let i = 0; i < employee.shifts.length; i++) {
        if (employee.shifts[i]._id.toString() === shift._id.toString()) {
            employee.shifts.splice(i, 1);
            shift.employee = undefined;
            return Promise.all([employee.save(), shift.save()]);
        }
    }
}

/**
 Deletes an employee from mongoDB using the database ID
 */
async function deleteEmployee(employee) {
    if(employee.shifts.length !== 0) {
        throw new Error("The employee still have shifts attached");
    }
    return ModelEmployee.findByIdAndDelete(employee._id);
}

/**
 Deletes an employee from mongoDB using the database ID as a parameter
 */
async function deleteEmployeeByID(employeeid) {
    if(employee.shifts.length !== 0) {
        throw new Error("The employee still have shifts attached");
    }
    return ModelEmployee.findByIdAndDelete(employee._id);
}

// ********** GETTERS ********** //

/**
Gets an employee from mongoDB using the database ID
 */
async function getEmployeeWithID(objectid) {
    return ModelEmployee.findOne({_id: objectid});
}

/**
Gets an employee from mongoDB using the CPR-number
 */
async function getEmployee(CPR) {
    return ModelEmployee.findOne({CPR: CPR}).exec();
}

/**
 Gets an employee with populated references from mongoDB using the CPR-number
 */
async function getEmployeePopulated(CPR) {
    return ModelEmployee.findOne({CPR: CPR}).populate('shifts').exec();
}

/**
Gets all employees from mongoDB
 */
async function getEmployees() {
    return ModelEmployee.find().populate('shifts').exec();
}

/**
Gets all shifts for an employee between two dates
 */
async function getShiftsForEmployeeBetweenDates(employee, fromDate, toDate){
    employee = await getEmployeePopulated(employee.CPR);

    return shiftController.getShiftsBetweenTwoDates(employee.shifts, fromDate, toDate);
}

/**
Gets a sum of the total working hours between two dates for and employee
 */
async function getTotalHoursBetweenTwoDatesForAnEmployee(employee, fromDate, toDate){
    let shifts = await getShiftsForEmployeeBetweenDates(employee, fromDate, toDate);
    return controller.getTotalHoursBetween(shifts);
}

/**
 * Exporting methods used in other places
 */

exports.removeEmployeeFromShift = removeEmployeeFromShift;
exports.addEmployeeToShift = addEmployeeToShift;
exports.getShiftsForEmployeeBetweenDates = getShiftsForEmployeeBetweenDates;
exports.getTotalHoursBetweenTwoDatesForAnEmployee = getTotalHoursBetweenTwoDatesForAnEmployee;
exports.getEmployee = getEmployee;
exports.getEmployeePopulated = getEmployeePopulated;
exports.getEmployeeWithID = getEmployeeWithID;
exports.getEmployees = getEmployees;
exports.deleteEmployee = deleteEmployee;
exports.createEmployee = createEmployee;
exports.deleteEmployeeByID = deleteEmployeeByID;


// Import of employee model
const Shift = require('../models/Shift');
// Import of mongoose, to be used for storage
const mongoose = require("../app");
// Import of general controller
const controller = require("/controllers/Controller");
// Import of employee controller
const employeeController = require("/controllers/employeeController");

// ********** SETTERS ********** //

/**
Function that creates a shift with a start and end.
The shift's totalHours in decimal is calculated using a helper method
After creation of the shift object, it will be saved in mongoDB
 */
async function createShift(start, end) {
    if (Object.prototype.toString.call(start) !== '[object Date]' || Object.prototype.toString.call(end) !== '[object Date]') {
        throw new Error("The date objects are not objects");
    }
    if (end <= start) {
        throw new Error("The end date+time is before or equal to the start date+time");
    }


    let totalHours = hourCalculation(start, end);
    const shift = new Shift({
        start,
        end,
        totalHours
    });
    return await shift.save();
}

/**
 Deletes a shift from mongoDB using the database ID
 */
async function deleteShift(shift) {
    return Shift.findByIdAndDelete(shift._id);
}

/**
 Changes the times of a shift, and saves the updated shift in mongoDB
 */

async function changeShiftTime(shift, newStart, newEnd) {
    checkShift(shift);
    if (shift === undefined || newStart === undefined || newEnd === undefined) {
        throw new Error("One of the param variables are undefined");
    }
    if (Object.prototype.toString.call(newStart) !== '[object Date]' || Object.prototype.toString.call(newEnd) !== '[object Date]') {
        return undefined;
    }
    if (newEnd <= newStart) {
        throw new Error("The enddate is before the startdate or they are equal");
    }
    shift = await getOneShift(shift._id);
    shift.start = newStart;
    shift.end = newEnd;

    await shift.save();

}

/**
 Changes the shift's attached employee
 Removes the link between shift and employee and vice versa using helper method
 Add new link between shift and employee and vice versa using helper method
 (Helper methods saves the updated objects in mongoDB)
 */

async function changeShiftEmployee(shift, newEmployee) {
    checkShift(shift);
    if (shift === undefined || newEmployee === undefined) {
        throw new Error("One of the param variables are undefined");
    }


    if (shift.employee._id.toString() === newEmployee._id.toString()) {
        throw new Error("This employee is already attached to this shift")
    }

    await employeeController.removeEmployeeFromShift(shift);
    await employeeController.addEmployeeToShift(newEmployee, shift);

}

/**
 Updates a shift in a specific way, depending on what case of update is given
 */

async function updateShift(update) {
    if (update.type === undefined) {
        throw new Error("No update type is given for this update");
    }

    let updateType = typeof update.type;
    if (updateType !== 'string') {
        throw new Error("The type variable is not a string");
    }

    switch (update.type) {
        case "addEmployeeToShift":
            await employeeController.addEmployeeToShift(update.newEmployee, update.shift);
            break;
        case "removeEmployeeFromShift":
            await employeeController.removeEmployeeFromShift(update.shift);
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
            await employeeController.addEmployeeToShift(update.newEmployee, update.shift);
            break;
        case "changeShiftTimesAndRemoveEmployee":
            await changeShiftTime(update.shift, update.newStart, update.newEnd);
            await employeeController.removeEmployeeFromShift(update.shift);
            break;
        case "deleteShift":
            if (update.shift.employee === undefined) {
                await deleteShift(update.shift);
            } else {
                await employeeController.removeEmployeeFromShift(update.shift);
                await deleteShift(update.shift);
            }
            break;
        case "createShift":
            await createShift(update.newStart, update.newEnd);
            break;
        default:
            throw new Error("The update type is unknown")
    }
}

// ********** GETTERS ********** //

/**
Gets all shifts from mongoDB
 */

async function getShifts() {
    return Shift.find().populate('employee').exec();
}

/**
Gets a shift from mongoDB using the database ID
 */
async function getOneShift(objectid) {
    return Shift.findOne({_id: objectid}).populate('employee');
}

/**
Gets all shifts from an array of shifts between two dates
 */

async function getShiftsBetweenTwoDates(shifts, fromDate, toDate) {
    let results = [];
    for (let i = 0; i < shifts.length; i++) {
        if (shifts[i].start.getTime() >= fromDate.getTime() && shifts[i].start.getTime() <= toDate.getTime()) {
            results.push(shifts[i]);
        }
    }
    return results;
}


/**
Gets all shifts from mongoDB on a specific date
 */
exports.getShiftsOnDate = async function (date) {
    let result = [];
    let shifts = await getShifts();
    for (let i = 0; i < shifts.length; i++) {
        if (shifts[i].start.toDateString() === date.toDateString()) {
            result.push(shifts[i]);
        }
    }
    return result;
};


/**
Helper method that checks if a shift exists and is a valid shift object
 */

function checkShift(shift) {
    if (shift === undefined) {
        throw new Error("Shift is not defined");
    }
    let type = typeof shift;
    if (type !== 'object') {
        throw new Error("The shift object is not an object");
    }

    if (!("start" in shift) || !("end" in shift) || !("totalHours" in shift)) {
        throw new Error("The shift object is not a shift");
    }
}


/**
 * Exporting methods used in other places
 */
module.exports = {
updateShift,
deleteShift,
getShiftsBetweenTwoDates,
getOneShift,
createShift,
getShifts,
changeShiftTime,
changeShiftEmployee,
checkShift
};
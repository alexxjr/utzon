"use strict";

const Employee = require('../models/Employee');
const Shift = require('../models/Shift');
const Login = require('../models/Login');
const mongoose = require("../app");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "utzonsend@gmail.com",
        pass: "projekt3semester"
    }
});


exports.createEmployee = async function (CPR, name, email, phoneNo) {
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
    const employee = new Employee({
        CPR,
        name,
        email: "utzonreceive@gmail.com",
        phoneNo
    });
    return await employee.save();
};

exports.createShift = createShift;

async function createShift(start, end) {
    if (Object.prototype.toString.call(start) !== '[object Date]' || Object.prototype.toString.call(end) !== '[object Date]') {
        throw new Error("The date objects are not objects");
    }
    if (end <= start) {
        throw new Error("The end date+time is before or equal to the start date+time");
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
        if (time > 5) {
            time -= 0.5;
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
}

async function addEmployeeToShift(employee, shift) {
    checkShift(shift);

    employee = await getEmployeeWIthID(employee._id);
    shift = await getOneShift(shift._id);

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

exports.addEmployeeToShift = addEmployeeToShift;

async function removeEmployeeFromShift(shift) {
    checkShift(shift);
    if (shift.employee === undefined) {
        throw new Error("This shift does not have an employee attached");
    }
    let employee = await getEmployeeWIthID(shift.employee);
    shift = await getOneShift(shift._id);


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

async function getShifts() {
    return Shift.find().populate('employee').exec();
}

exports.getShifts = getShifts;

exports.getOneShift = async function (objectid) {
    return Shift.findOne({_id: objectid}).populate('employee');
};

async function getShiftsForEmployeeBetweenDates(employee, fromDate, toDate){
    let allShifts = employee.shifts;
    let results = [];
    for (let i = 0; i < allShifts.length; i++) {
        if(allShifts[i].start.getTime() >= fromDate.getTime() && allShifts[i].start.getTime() <= toDate.getTime()){
            results.push(allShifts[i]);
        }
    }
    return results;
}

exports.getShiftsForEmployeeBetweenDates = getShiftsForEmployeeBetweenDates;

async function getTotalHoursBetweenTwoDatesForAnEmployee(employee, fromDate, toDate){
    let total = 0;
    if (!employee.shifts) {
        return total;
    }
    for (let i = 0; i < employee.shifts.length; i++) {
        if(employee.shifts[i].start.getTime() >= fromDate.getTime() && employee.shifts[i].end.getTime() <= toDate.getTime()){
            total += employee.shifts[i].totalHours;
        }
    }
    return total;
}

exports.getTotalHoursBetweenTwoDatesForAnEmployee = getTotalHoursBetweenTwoDatesForAnEmployee;

exports.getShiftBetweenTwoDates = async function (fromDate, toDate) {
    let allShifts = await getShifts();
    let results = [];
    for (let i = 0; i < allShifts.length; i++) {
        if (allShifts[i].start.getTime() > fromDate.getTime() && allShifts[i].start.getTime() < toDate.getTime()) {
            results.push(allShifts[i]);
        }
    }
    return results;
};

exports.getTotalhoursBetween = async function (shifts) {
    let total = 0;
    for (let i = 0; i < shifts.length; i++) {
        total += shifts[i].totalHours;
    }
    return total;
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
    let shifts = await getShifts();
    for (let i = 0; i < shifts.length; i++) {
        if (shifts[i].start.toDateString() === date.toDateString()) {
            result.push(shifts[i]);
        }
    }
    return result;
};

function changeStringToDate(update) {
    if (update.shift !== undefined) {
        update.shift.start = new Date(update.shift.start);
        update.shift.end = new Date(update.shift.end);
    }
    if (update.newStart !== undefined) {
        update.newStart = new Date(update.newStart);
        update.newEnd = new Date(update.newEnd);
    }
}

exports.manageIncomingUpdates = async function (updates) {
    if (updates === undefined) {
        throw new Error("The param updates are undefined");
    }
    if (updates.length === 0) {
        throw new Error("The update array is empty");
    }
    if (!Array.isArray(updates)) {
        throw new Error("The updates variable is not an array")
    }
    let succes = [];
    let failures = [];
    for (let i = 0; i < updates.length; i++) {
        try {
            changeStringToDate(updates[i]);
            let updateInfo;
            let isShift = updates[i].shift !== undefined;
            if (isShift) {
                updateInfo = {
                    oldEmployee: updates[i].shift.employee,
                    newEmployee: updates[i].newEmployee,
                    type: updates[i].type
                };
            }
            await updateShift(updates[i]);
            if (isShift) {
                succes.push(updateInfo);
            }
        } catch (e) {
            failures.push({update: updates[i], error: e.message});
            console.log(failures);
            updates.splice(i, 1);
            i--;
        }
    }
    await sendUpdateMail(succes);
    return failures;
};

async function sendUpdateMail(updates) {
    let mails = new Map();
    for (let update of updates) {
        if (update.newEmployee !== undefined) {
            if (mails.has(update.newEmployee)) {
                mails.set(update.newEmployee, mails.get(update.newEmployee).context += update.type + "\n");
            } else {
                mails.set(update.newEmployee, {employee: update.newEmployee, context: update.type + "\n"});
            }
        }
        if (update.oldEmployee !== undefined) {
            if (mails.has(update.oldEmployee)) {
                mails.set(update.oldEmployee, mails.get(update.oldEmployee).context += update.type + "\n");
            } else {
                mails.set(update.oldEmployee, {employee: update.oldEmployee, context: update.type + "\n"});
            }
        }
    }
    await sendMails(mails);
}

async function sendMails(mails) {
    for (let mail of mails.values()) {
        let mailOptions = {
            from: 'utzonsend@gmail.com',
            to: mail.employee.email + '',
            subject: 'Der er blevet lavet ændringer i din vagtplan (Sending Email using Node.js)',
            text: 'Ændringer: ' + mail.context
        };
        await transporter.sendMail(mailOptions);
    }
}

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
        case "createShift":
            await createShift(update.newStart, update.newEnd);
            break;
        default:
            throw new Error("The update type is unknown")
    }
}

exports.updateShift = updateShift;

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

exports.changeShiftTime = changeShiftTime;

async function changeShiftEmployee(shift, newEmployee) {
    checkShift(shift);
    if (shift === undefined || newEmployee === undefined) {
        throw new Error("One of the param variables are undefined");
    }


    if (shift.employee._id.toString() === newEmployee._id.toString()) {
        throw new Error("This employee is already attached to this shift")
    }

    await removeEmployeeFromShift(shift);
    await addEmployeeToShift(newEmployee, shift);

}

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


exports.getLoginRole = async function (username) {
    let users = await Login.find().exec();
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return users[i].role;
        }
    }
};

exports.login = login;

async function login(username, password) {

}

exports.changeShiftEmployee = changeShiftEmployee;

exports.getEmployee = getEmployee;
exports.getEmployeeWithId = getEmployeeWIthID;






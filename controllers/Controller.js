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


/**
Calculates the amount of time (in decimal hours) a shift lasts
If a shift is longer than 5 hour, 0.5 hours is subtracted from the result,
to account for the break in the shift.
 */
function hourCalculation(start, end) {
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

/**
 Calculates the total amount of decimal hours for an array of shifts
 */

async function getTotalhoursBetween(shifts) {
    let total = 0;
    for (let i = 0; i < shifts.length; i++) {
        total += shifts[i].totalHours;
    }
    return total;
}

/**
 Converts a string from an update to date objects
 */


function changeStringToDateInUpdate(update) {
    if (update.shift !== undefined) {
        update.shift.start = new Date(update.shift.start);
        update.shift.end = new Date(update.shift.end);
    }
    if (update.newStart !== undefined) {
        update.newStart = new Date(update.newStart);
        update.newEnd = new Date(update.newEnd);
    }
}

async function manageIncomingUpdates(updates) {
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
            changeStringToDateInUpdate(updates[i]);
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




exports.getLoginRole = async function (username) {
    let users = await Login.find().exec();
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return users[i].role;
        }
    }
};


exports.createLogin = createLogin;

async function createLogin(username, password, role) {
    const newLogin = new Login({username, password, role});
    return await newLogin.save();
};

exports.valiteDateLogin = validateLogin;


async function validateLogin(username, password) {
    let found = false;
    let i = 0;
    let logins = await Login.find().exec();
    while (!found && i < logins.length) {
        if (logins[i].username === username && logins[i].password === password) {
            found = true;
        }
        i++;
    }
    return found;
}

module.exports = {
    hourCalculation,
    getTotalHoursBetween,
    manageIncomingUpdates,

};







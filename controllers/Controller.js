"use strict";

// Import of mongoose, to be used for storage
const mongoose = require("../app");
// Import of nodemailer, to be used for notifications over email
const nodemailer = require('nodemailer');
// Import of the shift controller
const shiftController = require('./shiftController');

/**
 * Methods for creatings the transporter that enables emails to be sent out.
 * Login for the sender address.
 */
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

async function getTotalHoursBetween(shifts) {
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

/**
 * Checks if the updates coming in are properly formed.
 * Goes through each updates and saves info needed when sending out emails.
 * Then passes on the individual updates to the updateShift method.
 * Catches any error thrown when updating the database and passes it back to
 * the calling method.
 */
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
    //Array for storing information about successful updates.
    let success = [];
    //Array for failed updates as well as their error info.
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
            await shiftController.updateShift(updates[i]);
            if (isShift) {
                success.push(updateInfo);
            }
        } catch (e) {
            failures.push({update: updates[i], error: e.message});
        }
    }
    await sendUpdateMail(success);
    return failures;
}

/**
 * Genereate the text needed in the mails, as well as the list of recipents for each mail.
 */
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

/**
 * Actually send the mails to the intended recipents with the info from the updates.
 */
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

/**
 * Exports for use in the routes and the other controllers.
 */
exports.hourCalculation = hourCalculation;
exports.getTotalHoursBetween = getTotalHoursBetween;
exports.manageIncomingUpdates = manageIncomingUpdates;





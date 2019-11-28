//crypto for making hashes using PBKDF2
const crypto = require('crypto');
//Login Schema for making logins and saving them in the database
const Login = require("../models/Login");
//Mongoose import that enables saving to the right database.
const mongoose = require("../app");
//Employee Controller needed for operations concerning the link
const employeeController = require("./employeeController");


/**
 * Function to find the role of a user in the database.
 */
async function getLoginRole(username) {
    let user = await findOneLogin(username);
    if (user === null) {
        throw new Error("User does not exist in the system");
    }
    return user.role;
}

/**
 * Create a new Login for a user. Saves the login to the database.
 */
async function createLogin(username, secret, role) {
    let password = await generateHash(secret);
    let newLogin = new Login({username, password, role});
    return await newLogin.save();
}


/**
 * Validate the password for a user for login purposes
 */
async function validateLogin(username, password) {
    let user = await findOneLogin(username);
    if (user === null)  {
        return false;
    }
    return validatePassword(password, user.password);
}

/**
 * Generate a hash from a password using PBKDF2. Uses randomized salting to generate unique hashes.
 */
async function generateHash(password) {

    if ((typeof password) !== "string") {
        throw new Error("The password when generating a hash is not a string")
    }

    const salt = await crypto.randomBytes(16).toString('hex');
    let iterations = 65536;

    
    let hash;
    hash = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString('hex');

    return [hash, salt, iterations].join(":");

}

/**
 * Compares the hash of the user in the database and the hash made from the newly typed password.
 * If they match, returns true, else false.
 */
async function validatePassword(typedPassword, storedPassword) {
    if ((typeof typedPassword) !== "string" || (typeof storedPassword) !== "string") {
        throw new Error("One of the password when validating a hash is not a string")
    }

    let parts = storedPassword.split(":");
    if(parts[1] === undefined || parts[2] === undefined) {
        throw new Error("The stored password had the wrong format")
    }

    let hash = crypto.pbkdf2Sync(typedPassword, parts[1], Number.parseInt(parts[2]), 64, "sha512").toString('hex');

    return hash === parts[0];
}

/**
 * Link an employee to a a login
 */
async function addEmployeeToLogin(loginid, employeeid) {
    let login = getLoginWithID(loginid);
    if (login.employee !== undefined) {
        throw new Error("This login already has an employee linked")
    }
    if (employeeid === undefined) {
        throw new Error("The employee being linked to a login is undefined")
    }
    login.employee = employeeid;
    await login.save();
}

/**
 * Remove an employee from a login
 */
async function removeEmployeeFromLogin(login) {
    if (login === undefined) {
        throw new Error("Cannot remove employee from an undefined login")
    }
    login.employee = undefined;
    await login.save();
}

/**
 *
 */

//Getting, updating and deleting from database

/**
 * Find one user in the database.
 */
async function findOneLogin(username) {
    return Login.findOne({username}).exec();
}

/**
 * Deleting a user in the database
 */
async function deleteLogin(login) {
    if(login.employee !== undefined) {
        await employeeController.deleteEmployee(await employeeController.getEmployeeWithID(login.employee))
    }
    await Login.findByIdAndDelete(login._id);
}

/**
 Gets a login from mongoDB using the username
 */
async function getLogin(login) {
    return Login.findOne({username: login.username}).exec();
}

/**
 * Gets a login from mongoDB using the id of the login.
 */
async function getLoginWithID(ID) {
    return Login.findOne({_id : ID}).exec();
}

/**
 * Exports for use in routes.
 */
exports.createLogin = createLogin;
exports.validateLogin = validateLogin;
exports.getLoginRole = getLoginRole;
exports.findOneLogin = findOneLogin;
exports.deleteLogin = deleteLogin;
exports.getLogin = getLogin;
exports.generateHash = generateHash;
exports.validatePassword = validatePassword;
exports.addEmployeeToLogin = addEmployeeToLogin;
exports.removeEmployeeFromLogin = removeEmployeeFromLogin;
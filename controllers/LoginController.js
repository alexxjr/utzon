const crypto = require('crypto');
const Login = require("../models/Login");
const mongoose = require("../app");


/**
 * Function to find the role of a user in the database.
 */
exports.getLoginRole = async function (username) {
    let user = findOneLogin(username);
    if (user === undefined) {
        throw new Error("User does not exist in the system");
    }
    return user.role;

};

/**
 * Find one user in the database.
 */
async function findOneLogin(username) {
    return Login.findOne({username}).exec();
}


exports.createLogin = createLogin;

/**
 * Create a new Login for a user. Saves the login to the database.
 */
async function createLogin(username, password, role) {
    let hash = await generateHash(password);
    const newLogin = new Login({username, hash, role});
    return await newLogin.save();
}

exports.valiteDateLogin = validateLogin;

/**
 * Validate the password for a user for login purposes
 */
async function validateLogin(username, password) {

    if ((typeof username) !== "string" || (typeof password) !== "string") {
        throw new Error("One of the variables for the login validation is not a string")
    }


    let user = findOneLogin(username);
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
    await crypto.pbkdf2(password, salt, iterations, 64, "sha512", (err, buf) => {
        if (err) throw err;
        hash = buf.toString('hex');
    });

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

    let hash;
    await crypto.pbkdf2(typedPassword, parts[1], parts[2], 64, "sha512", (err, buf) => {
        if (err) throw err;
        hash = buf.toString('hex');
    });

    return hash === parts[0];
}
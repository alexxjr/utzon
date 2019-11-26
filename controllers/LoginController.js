const crypto = require('crypto');
const Login = require("../models/Login");
const mongoose = require("../app");

exports.getLoginRole = async function (username) {
    let user = findOneLogin(username);
    if (user === undefined) {
        throw new Error("User does not exist in the system");
    }
    return user.role;

};

async function findOneLogin(username) {
    return Login.findOne({username}).exec();
}


exports.createLogin = createLogin;

async function createLogin(username, password, role) {
    let hash = await generateHash(password);
    const newLogin = new Login({username, hash, role});
    return await newLogin.save();
}

exports.valiteDateLogin = validateLogin;

async function validateLogin(username, password) {
    let user = findOneLogin(username);
    return validatePassword(password, user.password);
}

async function generateHash(password) {
    const salt = await crypto.randomBytes(16).toString('hex');
    let iterations = 65536;

    
    let hash;
    await crypto.pbkdf2(password, salt, iterations, 64, "sha512", (err, buf) => {
        if (err) throw err;
        hash = buf.toString('hex');
    });

    return [hash, salt, iterations].join(":");
}

async function validatePassword(typedPassword, storedPassword) {
    let parts = storedPassword.split(":");

    let hash;
    await crypto.pbkdf2(typedPassword, parts[1], parts[2], 64, "sha512", (err, buf) => {
        if (err) throw err;
        hash = buf.toString('hex');
    });

    return hash === parts[0];
}
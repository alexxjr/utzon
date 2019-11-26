const crypto = require('crypto');

async function createUser(username, password) {
    let hash = await generateHash(password);
    DatabaseConnection.opretBruger(username, hash);
}

async function validateUser(username, password) {
    let passwordFromDatabase = DatabaseConnection.getPassword(username);
    return validatePassword(password, passwordFromDatabase);
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
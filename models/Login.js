const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const login = new Schema({
    username: String,
    password: String,
    role: String
});

module.exports = mongoose.model('Login', login);




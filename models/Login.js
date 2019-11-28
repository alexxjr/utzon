const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const login = new Schema({
    username: {
        type: String,
        minlength: 1,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Employee"],
        required: true
    },
    employee: {
        type : Schema.Types.ObjectId,
        ref : 'Employee'
    }
});

module.exports = mongoose.model('Login', login);




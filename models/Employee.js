const mongoose = require('mongoose');
const controller = require('../Controllers/controller');
const Schema = mongoose.Schema;

const employee = new Schema({
    CPR: String,
    name: String,
    email: String,
    phoneNo: String,
    shifts : [{type : Schema.Types.ObjectId, ref : 'Shift'}] // 0..* link to shifts
});

employee.methods.toString = function() {
    return 'CPR: ' + this.CPR + 'Navn: ' + this.name + 'Email: ' + this.email + 'Tlf: ' + this.phoneNo;
}


module.exports = mongoose.model('Employee', employee);




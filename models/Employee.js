const mongoose = require('mongoose');
const controller = require('../controllers/Controller');
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
};

employee.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.CPR;
    return obj;
};


module.exports = new mongoose.model('Employee', employee);




const mongoose = require('mongoose');
const controller = require('../controllers/Controller');
const Schema = mongoose.Schema;

const update = new Schema({
    shift : {type : Schema.Types.ObjectId, ref : 'Shift'}, // link to shift
    oldEmployee : {type : Schema.Types.ObjectId, ref : 'Employee'}, // 0..1 link to employee
    newEmployee : {type : Schema.Types.ObjectId, ref : 'Employee'}, // 0..1 link to employee
    type : String

});


module.exports = mongoose.model('Employee', update);




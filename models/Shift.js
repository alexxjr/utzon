const mongoose = require('mongoose');
const controller = require('../Controllers/controller');
const Schema = mongoose.Schema;

const shift = new Schema({
    start : Date,
    end : Date,
    /*
    totalHours is the actual amount worked (Breaks subtracted)
     */
    totalHours : Number,
    employee : {type : Schema.Types.ObjectId, ref : 'Employee'} // 0..1 link to employee
});

shift.methods.toString = function() {
    return 'Start: ' + this.start + 'Slut: ' + this.end + 'Total antal timer: ' + this.totalHours;
}


module.exports = mongoose.model('Shift', shift);




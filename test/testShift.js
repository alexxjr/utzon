const shiftController = require('../controllers/shiftController');
//const mongoose = require('../app').mongoose;

let testStartDate = new Date(2018, 11, 15,10,25);
let testEndDate = new Date(2018, 11, 15,18,55);

//Test of totalHours calculation. Reversed minutes.
let testStartDate1 = new Date(2018, 11, 15,10,55);
let testEndDate1 = new Date(2018, 11, 15,18,25);

let thirdtry;
let fifthtry;

const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('Test af shift funktioner', ()  => {

    it('Make a shift with only one date', async () => {
        await expect(shiftController.createShift(testStartDate)).to.be.rejectedWith("The date objects are not objects");
    });

    it('make a shift with no parameters', async () => {
        await expect(shiftController.createShift(testStartDate)).to.be.rejectedWith("The date objects are not objects");
    });

    it('make a shift with normal parameters', async () => {
        thirdtry = await shiftController.createShift(testStartDate, testEndDate);
        thirdtry = await shiftController.getOneShift(thirdtry._id);
        expect(thirdtry.start.getFullYear()).to.equal(2018);
        expect(thirdtry.start.getMonth()).to.equal(11);
        expect(thirdtry.start.getDate()).to.equal(15);
        expect(thirdtry.start.getHours()).to.equal(10);
        expect(thirdtry.start.getMinutes()).to.equal(25);
        expect(thirdtry.end.getFullYear()).to.equal(2018);
        expect(thirdtry.end.getMonth()).to.equal(11);
        expect(thirdtry.end.getDate()).to.equal(15);
        expect(thirdtry.end.getHours()).to.equal(18);
        expect(thirdtry.end.getMinutes()).to.equal(55);
        expect(thirdtry.totalHours).to.equal(8.0);
        expect(thirdtry.employee).to.equal(undefined);
    }).timeout(10000);

    it('Make a shift with end date before startdate', async () => {
        await expect(shiftController.createShift(testEndDate, testStartDate)).to.be.rejectedWith("The end date+time is before or equal to the start date+time");
    });

    it('Create a shift with reversed minutes to check for hour calculation', async () => {
        fifthtry = await shiftController.createShift(testStartDate1, testEndDate1);
        expect(fifthtry.totalHours).to.equal(7.0);
    }).timeout(10000);

    it('exact same date', async () => {
        await expect(shiftController.createShift(testStartDate, testStartDate)).to.be.rejectedWith("The end date+time is before or equal to the start date+time");
    });

    after(async () =>  {
        await shiftController.deleteShift(thirdtry);
        await shiftController.deleteShift(fifthtry);
    });

});



const controller = require('../controllers/controller');
//const mongoose = require('../app').mongoose;

let testStartDate = new Date(2018, 11, 15,10,25);
let testEndDate = new Date(2018, 11, 15,18,55);

//Test of totalHours calculation. Reversed minutes.
let testStartDate1 = new Date(2018, 11, 15,10,55);
let testEndDate1 = new Date(2018, 11, 15,18,25);

let thirdtry;
let fifthtry;


let expect = require('chai').expect;

describe('unittest shift', ()  => {

    it('Make a shift with only one date', async () => {
        await expect(controller.createShift(testStartDate)).to.be.rejectedWith("The date objects are not objects");
    });

    it('make a shift with no parameters', async () => {
        await expect(controller.createShift(testStartDate)).to.be.rejectedWith("The date objects are not objects");
    });

    it('make a shift with normal parameters', async () => {
        thirdtry = await controller.createShift(testStartDate, testEndDate);
        thirdtry = await controller.getOneShift(thirdtry._id);
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
        await expect(controller.createShift(testEndDate, testStartDate)).to.be.rejectedWith("The end date+time is before or equal to the start date+time");
    });

    it('Create a shift with reversed minutes to check for hour calculation', async () => {
        fifthtry = await controller.createShift(testStartDate1, testEndDate1);
        expect(fifthtry.totalHours).to.equal(7.0);
    }).timeout(10000);

    it('exact same date', async () => {
        await expect(controller.createShift(testStartDate, testStartDate)).to.be.rejectedWith("The end date+time is before or equal to the start date+time");
    });

    after(async () =>  {
        await controller.deleteShift(thirdtry);
        await controller.deleteShift(fifthtry);
    });

});

after(async() => {
    let employees = await controller.getEmployees();
    for (let employee of employees) {
        if (employee.CPR === "0123456789" || employee.CPR === "2013456789" || employee.CPR === "9876543210") {
            await controller.deleteEmployee(employee)
        }
    }
    let date1 = new Date("2017-01-01T00:00:00Z");
    let date2 = new Date("2018-11-30T23:59:59Z");
    let shifts = await controller.getShifts();
    for (let shift of shifts) {
        if (shift.start.getTime() >= date1.getTime() && shift.end.getTime() <= date2.getTime()) {
            await controller.deleteShift(shift);
        }
    }
});



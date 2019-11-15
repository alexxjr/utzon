const controller = require('../controllers/controller');

let testStartDate = new Date(2019, 11, 15,10,25);
let testEndDate = new Date(2019, 11, 15,18,55);

//Test of totalHours calculation. Reversed minutes.
let testStartDate1 = new Date(2019, 11, 15,10,55);
let testEndDate1 = new Date(2019, 11, 15,18,25);


let expect = require('chai').expect;

describe('unitTest', ()  => {

    it('Make a shift with only one date', async () => {
        let firsttry = await controller.createShift(testStartDate);
        expect(firsttry).to.equal(undefined);
    });

    it('make a shift with no parameters', async () => {
        let secondtry = await controller.createShift();
        expect(secondtry).to.equal(undefined);
    });

    it('make a shift with normal parameters', async () => {
        let thirdtry = await controller.createShift(testStartDate, testEndDate);
        expect(thirdtry.start.getFullYear()).to.equal(2019);
        expect(thirdtry.start.getMonth()).to.equal(11);
        expect(thirdtry.start.getDate()).to.equal(15);
        expect(thirdtry.start.getHours()).to.equal(10);
        expect(thirdtry.start.getMinutes()).to.equal(25);
        expect(thirdtry.end.getFullYear()).to.equal(2019);
        expect(thirdtry.end.getMonth()).to.equal(11);
        expect(thirdtry.end.getDate()).to.equal(15);
        expect(thirdtry.end.getHours()).to.equal(18);
        expect(thirdtry.end.getMinutes()).to.equal(55);
        expect(thirdtry.totalHours).to.equal(8.5);
        expect(thirdtry.employee).to.equal(undefined);
    });

    it('Make a shift with end date before startdate', async () => {
        let fourthtry = await controller.createShift(testEndDate, testStartDate);
        expect(fourthtry).to.equal(undefined);
    });

    it('Create a shift with reversed minutes to check for hour calculation', async () => {
        let fifthtry = await controller.createShift(testStartDate1, testEndDate1);
        expect(fifthtry.totalHours).to.equal(7.5);
    });

    it('exact same date', async () => {
        let sixthtry = await controller.createShift(testStartDate, testStartDate);
        expect(sixthtry).to.equal(undefined);
    });

});

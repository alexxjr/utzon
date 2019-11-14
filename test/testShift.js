const controller = require('../controllers/controller');

let testStartDate = new Date(2019, 11, 15,10,25);
let testEndDate = new Date(2019, 11, 15,18,25);

let expect = require('chai').expect
    , firsttry = controller.createShift(testStartDate)
    , secondtry = controller.createShift()
    , thirdtry = controller.createShift(testStartDate, testEndDate)
    , fourthtry = controller.createShift(testEndDate, testStartDate);

describe('unitTest', () => {
    it('Make a shift with only one date', () => {
        expect(firsttry).to.equal(undefined);
    });

    it('make a shift with no parameters', () => {
        expect(secondtry).to.equal(undefined);
    });

    it('make a shift with normal parameters', () => {
        expect(thirdtry.start.getFullYear()).to.equal(2019);
        expect(thirdtry.start.getMonth).to.equal(11);
        expect(thirdtry.start.getDate()).to.equal(15);
        expect(thirdtry.start.getHours()).to.equal(10);
        expect(thirdtry.start.getMinutes()).to.equal(25);
        expect(thirdtry.end.getFullYear()).to.equal(2019);
        expect(thirdtry.end.getMonth).to.equal(11);
        expect(thirdtry.end.getDate()).to.equal(15);
        expect(thirdtry.end.getHours()).to.equal(18);
        expect(thirdtry.end.getMinutes()).to.equal(25);
        expect(thirdtry.totalHours).to.equal(480);
        expect(thirdtry.employee).to.equal(undefined);
    });

    it('Make a shift with end date before startdate', () => {
        expect(secondtry).to.equal(undefined);
    });

});

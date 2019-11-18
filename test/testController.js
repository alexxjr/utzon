const controller = require('../controllers/controller');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

let testEmployee1;
let testEmployee2;
let testShift;
let startDate;
let endDate;

describe('Test af controllerfunktioner', function(){

    before(async function() {

        testEmployee1 = await controller.createEmployee("0123456789", "Anders00000", "test@test.dk", "test");
        testEmployee2 = await controller.createEmployee("2013456789", "Andersine", "test2@test2.dk", "test2");
        testShift = await controller.createShift(new Date(2018, 11, 15,10,25)
            , new Date(2018, 11, 15,18,55));
        startDate = new Date(2018, 11, 16,10,25);
        endDate = new Date(2018, 11, 16,12,25);
    });

    this.timeout(10000);

    // Testing for adding/removing an employee on shifts

    it('test if shift is created without employee', async () => {
        expect(testShift.employee).to.equal(undefined);
    });
    it('assign an employee to an empty shift', async () => {
        await controller.addEmployeeToShift(testEmployee1, testShift);
        testEmployee1 = await controller.getEmployee("0123456789");
        testShift = await controller.getOneShift(testShift._id);
        expect(testEmployee1.shifts[0]._id.toString()).to.equal(testShift._id.toString());
    });

    it('testing for invalid variables on addEmployeeToShift (No shift in param)', async () => {
        await expect(controller.addEmployeeToShift(testEmployee1)).to.be.rejectedWith("Shift or employee variable is empty");
    });

    it('an employee should not be able to be assigned to a shift occupied by an employee already', async () => {
        await expect(controller.addEmployeeToShift(testEmployee2, testShift)).to.be.rejectedWith("An employee is already attached to this shift");
    });

    it('testing for invalid variables on removeEmployeeFromShift (No shift in param)', async () => {
        await expect(controller.removeEmployeeFromShift(testEmployee1)).to.be.rejectedWith("Shift or employee variable is empty");
    });

    it('an employee should not be able to be removed from a shift they are not attached to', async () => {
        await expect(controller.removeEmployeeFromShift(testEmployee2, testShift)).to.be.rejectedWith("This employee is not attached to this shift");
    });

    it('remove an employee from a shift', async () => {
        await controller.removeEmployeeFromShift(testEmployee1, testShift);
        testEmployee1 = await controller.getEmployee("0123456789");
        testShift = await controller.getOneShift(testShift._id);
        expect(testEmployee1.shifts.length).to.equal(0);
        expect(testShift.employee).to.equal(undefined);
    });

    // Testing for changes on database objects.

    it('changing shift dates', async () => {
        await controller.changeShiftTime(testShift, startDate, endDate);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start).to.equal(startDate);
        expect(testShift.end).to.equal(endDate);
    });

    it('changing shift startDate, ', async () => {
        await controller.changeShiftTime(testShift, startDate, endDate);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start).to.equal(startDate);
        expect(testShift.end).to.equal(endDate);
    });

    after(async () => {

        await controller.deleteEmployee(testEmployee2).then();
        await controller.deleteEmployee(testEmployee1);
        await controller.deleteShift(testShift);
    });
});

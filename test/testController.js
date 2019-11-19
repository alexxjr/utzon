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
        this.timeout(10000);
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

    // Testing for changes on shift objects in the database.

    it('changing shift dates', async () => {
        await controller.changeShiftTime(testShift, startDate, endDate);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start).to.equal(startDate);
        expect(testShift.end).to.equal(endDate);
    });

    it('changing shift with only startDate', async () => {
        await expect(controller.changeShiftTime(testShift, startDate)).to.be.rejectedWith("One of the param variables are undefined");
    });

    it('changing shift startDate with a date, which is ahead of the current endDate or they are equal', async () => {
        await expect(controller.changeShiftTime(testShift, endDate, startDate)).to.be.rejectedWith("The enddate is before the startdate or they are equal");
    });

    it('changing shift startDate with a parameter missing', async () => {
        expect(await controller.changeShiftTime(testShift, "Testing for failure", endDate)).to.equal(undefined);
    });

    it('changing shift employee', async () => {
        testEmployee1 = await controller.getEmployee(testEmployee1.CPR);
        testEmployee2 = await controller.getEmployee(testEmployee2.CPR);
        await controller.addEmployeeToShift(testEmployee1, testShift);
        await controller.changeShiftEmployee(testShift, testEmployee2);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.employee).to.equal(testEmployee2);
    });

    it('changing shift without an employee', async () => {
        await expect(controller.changeShiftEmployee(testShift)).to.be.rejectedWith("One of the param variables are undefined");
    });

    it('changing shift employee with an employee, that are already on the shift', async () => {
        await expect(controller.changeShiftEmployee(testShift, testEmployee2)).to.be.rejectedWith("This employee is already attached to this shift");
    });

    it('checking for no param in updateShift', async () => {
        await expect(controller.updateShift()).to.be.rejectedWith("One of the param variables are undefined");
    });

    it('checking param object for not having a valid shift attribute', async () => {
        let update = "hej";
        await expect(controller.updateShift(update)).to.be.rejectedWith("Shift is not defined in the update object");
    });

    it('checking for param object for not having a valid dates', async () => {
        let update = {shift: "hej"};
        await expect(controller.updateShift(update)).to.be.rejectedWith("One of the date objects are undefined");
    });

    it('checking for param object for having a valid dates, but (without) a proper shift object', async () => {
        let update = {shift: "hej", newStart: startDate, newEnd: endDate};
        await expect(controller.updateShift(update)).to.be.rejectedWith("The shift object is not a shift");
    });

    it('checking for param object for having a valid dates, but (with) a proper shift object', async () => {
        startDate = new Date(2018, 11, 17,10,25);
        endDate = new Date(2018, 11, 17,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start).to.equal(startDate);
        expect(testShift.end).to.equal(endDate);
    });
    it('checking for param object for having a valid dates, but (with) a proper shift object and a new employee', async () => {
        startDate = new Date(2018, 11, 18,10,25);
        endDate = new Date(2018, 11, 18,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate, newEmployee: testEmployee1};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start).to.equal(startDate);
        expect(testShift.end).to.equal(endDate);
        expect(testShift.employee).to.equal(testEmployee1);
    });

    it('checking for param object for only having a proper shift object and a new employee', async () => {
        let update = {shift: testShift, newEmployee: testEmployee2};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.employee).to.equal(testEmployee2);
    });

    after(async () => {

        await controller.deleteEmployee(testEmployee2).then();
        await controller.deleteEmployee(testEmployee1);
        await controller.deleteShift(testShift);
    });
});


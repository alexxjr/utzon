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
        testEmployee1 = await controller.createEmployee("0123456789", "Anders00000", "utzonreceive@gmail.com", "test");
        testEmployee2 = await controller.createEmployee("2013456789", "Andersine", "utzonreceive@gmail.com", "test2");
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
        await expect(controller.addEmployeeToShift(testEmployee1)).to.be.rejectedWith("Shift is not defined");
    });

    it('an employee should not be able to be assigned to a shift occupied by an employee already', async () => {
        await expect(controller.addEmployeeToShift(testEmployee2, testShift)).to.be.rejectedWith("An employee is already attached to this shift");
    });

    it('testing for invalid variables on removeEmployeeFromShift (No shift in param)', async () => {
        await expect(controller.removeEmployeeFromShift()).to.be.rejectedWith("Shift is not defined");
    });

    it('remove an employee from a shift', async () => {
        await controller.removeEmployeeFromShift(testShift);
        testEmployee1 = await controller.getEmployee("0123456789");
        testShift = await controller.getOneShift(testShift._id);
        expect(testEmployee1.shifts.length).to.equal(0);
        expect(testShift.employee).to.equal(undefined);
    });

    it('should not be able to be remove an employee from a shift without any employee attached to it', async () => {
        await expect(controller.removeEmployeeFromShift(testShift)).to.be.rejectedWith("This shift does not have an employee attached");
    });


    // Testing for changes on shift objects in the database.

    it('changing shift dates', async () => {
        await controller.changeShiftTime(testShift, startDate, endDate);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
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
        expect(testShift.employee._id.toString()).to.equal(testEmployee2._id.toString());
    });

    it('changing shift without an employee', async () => {
        await expect(controller.changeShiftEmployee(testShift)).to.be.rejectedWith("One of the param variables are undefined");
    });

    it('changing shift employee with an employee, that are already on the shift', async () => {
        await expect(controller.changeShiftEmployee(testShift, testEmployee2)).to.be.rejectedWith("This employee is already attached to this shift");
    });

    it('checking for no param in manageIncomingUpdates', async () => {
        await expect(controller.manageIncomingUpdates()).to.be.rejectedWith("The param updates are undefined");
    });

    it('checking for length of param in manageIncomingUpdates', async () => {
        await expect(controller.manageIncomingUpdates([])).to.be.rejectedWith("The update array is empty");
    });

    it('ckecing for iterable of updates in manageIncomingUpdates', async() => {
        await expect(controller.manageIncomingUpdates("hej")).to.be.rejectedWith("The updates variable is not an array");
    });

    it('checking for correct error handling in manageIncomingUpdates', async () => {
        let update = "hej";
        let response = await controller.manageIncomingUpdates([update]);
        expect(response.length).to.equal(1);
        expect(response[0].update).to.equal(update);
        expect(response[0].error).to.equal("No update type is given for this update");
    });



    it('checking param object for not having a valid type attribute', async () => {
        let update = "hej";
        await expect(controller.updateShift(update)).to.be.rejectedWith("No update type is given for this update");
    });

    it('checking for param object for not having a valid dates', async () => {
        let update = {shift: "hej", newStart: startDate};
        await expect(controller.updateShift(update)).to.be.rejectedWith("One of the date objects are undefined");
    });

    it('checking for param object for having a valid dates, but using a string as shift', async () => {
        let update = {shift: "Hej", newStart: startDate, newEnd: endDate, type: "changeShiftTimesAndRemoveEmployee"};
        await expect(controller.updateShift(update)).to.be.rejectedWith("The shift object is not an object");
    });

    it('checking for param object for having a valid dates, but (without) a proper shift object', async () => {
        let update = {shift: testEmployee1, newStart: startDate, newEnd: endDate, type: "changeShiftTimesAndRemoveEmployee"};
        await expect(controller.updateShift(update)).to.be.rejectedWith("The shift object is not a shift");
    });

    it('checking for param object for having a valid dates, but (with) a proper shift object, but no updatetype', async () => {
        // startDate = new Date(2018, 11, 17,10,25);
        // endDate = new Date(2018, 11, 17,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate};
        await expect(controller.updateShift(update)).to.be.rejectedWith("No update type is given for this update");
    });

    it('checking for param object for having a valid dates, but (with) a proper shift object, but updatetype is not a string', async () => {
        // startDate = new Date(2018, 11, 17,10,25);
        // endDate = new Date(2018, 11, 17,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate, type: 2};
        await expect(controller.updateShift(update)).to.be.rejectedWith("The type variable is not a string");
    });

    it('case removeEmployeeFromShift (valid data)', async () => {
        let update = {shift: testShift, type: "removeEmployeeFromShift"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.employee).to.equal(undefined);
    });

    it('case addEmployeeToShift (valid data)', async () => {
        let update = {shift: testShift, newEmployee: testEmployee1, type: "addEmployeeToShift"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.employee.CPR).to.equal(testEmployee1.CPR);
    });

    it('case changeShiftTimes (valid data)', async () => {
        startDate = new Date(2018, 11, 17,10,25);
        endDate = new Date(2018, 11, 17,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate, type: "changeShiftTimes"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
    });

    it('case changeShiftTimesAndEmployee (valid data)', async () => {
        startDate = new Date(2018, 11, 18,10,25);
        endDate = new Date(2018, 11, 18,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate, newEmployee: testEmployee2, type: "changeShiftTimesAndEmployee"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
        expect(testShift.employee._id.toString()).to.equal(testEmployee2._id.toString());
    });


    it('case changeShiftEmployee (valid data)', async () => {
        let update = {shift: testShift, newEmployee: testEmployee1, type: "changeShiftEmployee"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.employee._id.toString()).to.equal(testEmployee1._id.toString());
    });

    it('case changeShiftTimesAndRemoveEmployee (valid data)', async () => {
        startDate = new Date(2018, 11, 18,10,25);
        endDate = new Date(2018, 11, 18,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate, type: "changeShiftTimesAndRemoveEmployee"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
        expect(testShift.employee).to.equal(undefined);
    });

    it('case changeShiftTimesAndAddEmployee (valid data)', async () => {
        startDate = new Date(2018, 11, 18,10,25);
        endDate = new Date(2018, 11, 18,12,25);
        let update = {shift: testShift, newStart: startDate, newEnd: endDate, newEmployee: testEmployee2, type: "changeShiftTimesAndAddEmployee"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
        expect(testShift.employee._id.toString()).to.equal(testEmployee2._id.toString());
    });

    it('default Testing wrong input type', async () => {
        let update = {shift: testShift, type: "Testing wrong input type"};
        await expect(controller.updateShift(update)).to.be.rejectedWith("The update type is unknown");
    });

    it('case deleteShift, with employee (valid data)', async () => {
        let update = {shift: testShift, type: "deleteShift"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift).to.equal(null);
    });

    it('case deleteShift (valid data)', async () => {
        testShift = await controller.createShift(new Date(2018, 11, 15,10,25)
            , new Date(2018, 11, 15,18,55));

        let update = {shift: testShift, type: "deleteShift"};
        await controller.updateShift(update);
        testShift = await controller.getOneShift(testShift._id);
        expect(testShift).to.equal(null);
    });

    // it('try to actually update and send a mail with ', async () => {
    //     testShift = await controller.createShift(new Date(2018, 11, 15,10,25)
    //         , new Date(2018, 11, 15,18,55));
    //     await controller.addEmployeeToShift(testEmployee1, testShift);
    //     let update = {shift: testShift, type: "removeEmployeeFromShift"};
    //     await controller.manageIncomingUpdates([update]);
    //
    // });

    after(async () => {
        await controller.deleteEmployee(testEmployee2);
        await controller.deleteEmployee(testEmployee1);
    });
});


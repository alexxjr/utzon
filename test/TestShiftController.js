const shiftController = require('../controllers/shiftController');
const employeeController = require('../controllers/employeeController');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

let testEmployee1;
let testEmployee2;
let testShift;
let testShift3;
let testShift4;
let testShift5;
let startDate;
let endDate;
let update;

describe('Test af shift controllerfunktioner', function () {

    before(async function () {
        this.timeout(10000);
        testEmployee1 = await employeeController.createEmployee("0123456789", "Anders00000", "utzonreceive@gmail.com", "test");
        testEmployee2 = await employeeController.createEmployee("2013456789", "Andersine", "utzonreceive@gmail.com", "test2");
        testShift = await shiftController.createShift(new Date(2018, 11, 15, 10, 25)
            , new Date(2018, 11, 15, 18, 55));
        startDate = new Date(2018, 11, 16, 10, 25);
        endDate = new Date(2018, 11, 16, 12, 25);
    });

    this.timeout(10000);

    // Testing for adding/removing an employee on shifts

    it('assign an employee to an empty shift', async () => {
        await employeeController.addEmployeeToShift(testEmployee1, testShift);
        testEmployee1 = await employeeController.getEmployee("0123456789");
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testEmployee1.shifts[0]._id.toString()).to.equal(testShift._id.toString());
    });

    it('testing for invalid variables on addEmployeeToShift (No shift in param)', async () => {
        await expect(employeeController.addEmployeeToShift(testEmployee1)).to.be.rejectedWith("Shift is not defined");
    });

    it('an employee should not be able to be assigned to a shift occupied by an employee already', async () => {
        await expect(employeeController.addEmployeeToShift(testEmployee2, testShift)).to.be.rejectedWith("An employee is already attached to this shift");
    });

    it('testing for invalid variables on removeEmployeeFromShift (No shift in param)', async () => {
        await expect(employeeController.removeEmployeeFromShift()).to.be.rejectedWith("Shift is not defined");
    });

    it('remove an employee from a shift', async () => {
        await employeeController.removeEmployeeFromShift(testShift);
        testEmployee1 = await employeeController.getEmployee("0123456789");
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testEmployee1.shifts.length).to.equal(0);
        expect(testShift.employee).to.equal(undefined);
    });

    it('should not be able to be remove an employee from a shift without any employee attached to it', async () => {
        await expect(employeeController.removeEmployeeFromShift(testShift)).to.be.rejectedWith("This shift does not have an employee attached");
    });

    // Testing for changes on shift objects in the database.

    it('changing shift dates', async () => {
        await shiftController.changeShiftTime(testShift, startDate, endDate);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
    });

    it('changing shift with only startDate', async () => {
        await expect(shiftController.changeShiftTime(testShift, startDate)).to.be.rejectedWith("One of the param variables are undefined");
    });

    it('changing shift startDate with a date, which is ahead of the current endDate or they are equal', async () => {
        await expect(shiftController.changeShiftTime(testShift, endDate, startDate)).to.be.rejectedWith("The enddate is before the startdate or they are equal");
    });

    it('changing shift startDate with a parameter missing', async () => {
        expect(await shiftController.changeShiftTime(testShift, "Testing for failure", endDate)).to.equal(undefined);
    });

    it('changing shift employee', async () => {
        testEmployee1 = await employeeController.getEmployee(testEmployee1.CPR);
        testEmployee2 = await employeeController.getEmployee(testEmployee2.CPR);
        await employeeController.addEmployeeToShift(testEmployee1, testShift);
        testShift = await shiftController.getOneShift(testShift._id);
        await shiftController.changeShiftEmployee(testShift, testEmployee2);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.employee._id.toString()).to.equal(testEmployee2._id.toString());
    });

    it('changing shift without an employee', async () => {
        await expect(shiftController.changeShiftEmployee(testShift)).to.be.rejectedWith("One of the param variables are undefined");
    });

    it('changing shift employee with an employee, that are already on the shift', async () => {
        await expect(shiftController.changeShiftEmployee(testShift, testEmployee2)).to.be.rejectedWith("This employee is already attached to this shift");
    });


    it('checking param object for not having a valid type attribute', async () => {
        update = "hej";
        await expect(shiftController.updateShift(update)).to.be.rejectedWith("No update type is given for this update");
    });

    it('checking for param object for having a valid dates, but using a string as shift', async () => {
        update = {shift: "Hej", newStart: startDate, newEnd: endDate, type: "changeShiftTimesAndRemoveEmployee"};
        await expect(shiftController.updateShift(update)).to.be.rejectedWith("The shift object is not an object");
    });

    it('checking for param object for having a valid dates, but (without) a proper shift object', async () => {
        update = {
            shift: testEmployee1,
            newStart: startDate,
            newEnd: endDate,
            type: "changeShiftTimesAndRemoveEmployee"
        };
        await expect(shiftController.updateShift(update)).to.be.rejectedWith("The shift object is not a shift");
    });

    it('checking for param object for having a valid dates, but (with) a proper shift object, but no updatetype', async () => {
        update = {shift: testShift, newStart: startDate, newEnd: endDate};
        await expect(shiftController.updateShift(update)).to.be.rejectedWith("No update type is given for this update");
    });

    it('checking for param object for having a valid dates, but (with) a proper shift object, but updatetype is not a string', async () => {
        update = {shift: testShift, newStart: startDate, newEnd: endDate, type: 2};
        await expect(shiftController.updateShift(update)).to.be.rejectedWith("The type variable is not a string");
    });

    it('case removeEmployeeFromShift (valid data)', async () => {
        update = {shift: testShift, type: "removeEmployeeFromShift"};
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.employee).to.equal(undefined);
    });

    it('case addEmployeeToShift (valid data)', async () => {
        update = {shift: testShift, newEmployee: testEmployee1, type: "addEmployeeToShift"};
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.employee.CPR).to.equal(testEmployee1.CPR);
    });

    it('case changeShiftTimes (valid data)', async () => {
        startDate = new Date(2018, 11, 17, 10, 25);
        endDate = new Date(2018, 11, 17, 12, 25);
        update = {shift: testShift, newStart: startDate, newEnd: endDate, type: "changeShiftTimes"};
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
    });

    it('case changeShiftTimesAndEmployee (valid data)', async () => {
        startDate = new Date(2018, 11, 18, 10, 25);
        endDate = new Date(2018, 11, 18, 12, 25);
        update = {
            shift: testShift,
            newStart: startDate,
            newEnd: endDate,
            newEmployee: testEmployee2,
            type: "changeShiftTimesAndEmployee"
        };
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
        expect(testShift.employee._id.toString()).to.equal(testEmployee2._id.toString());
    });


    it('case changeShiftEmployee (valid data)', async () => {
        update = {shift: testShift, newEmployee: testEmployee1, type: "changeShiftEmployee"};
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.employee._id.toString()).to.equal(testEmployee1._id.toString());
    });

    it('case changeShiftTimesAndRemoveEmployee (valid data)', async () => {
        startDate = new Date(2018, 11, 18, 10, 25);
        endDate = new Date(2018, 11, 18, 12, 25);
        update = {
            shift: testShift,
            newStart: startDate,
            newEnd: endDate,
            type: "changeShiftTimesAndRemoveEmployee"
        };
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
        expect(testShift.employee).to.equal(undefined);
    });

    it('case changeShiftTimesAndAddEmployee (valid data)', async () => {
        startDate = new Date(2018, 11, 18, 10, 25);
        endDate = new Date(2018, 11, 18, 12, 25);
        update = {
            shift: testShift,
            newStart: startDate,
            newEnd: endDate,
            newEmployee: testEmployee2,
            type: "changeShiftTimesAndAddEmployee"
        };
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift.start.getTime()).to.equal(startDate.getTime());
        expect(testShift.end.getTime()).to.equal(endDate.getTime());
        expect(testShift.employee._id.toString()).to.equal(testEmployee2._id.toString());
    });

    it('default Testing wrong input type', async () => {
        update = {shift: testShift, type: "Testing wrong input type"};
        await expect(shiftController.updateShift(update)).to.be.rejectedWith("The update type is unknown");
    });

    it('case deleteShift, with employee (valid data)', async () => {
        update = {shift: testShift, type: "deleteShift"};
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift).to.equal(null);
    });

    it('case deleteShift (valid data)', async () => {
        testShift = await shiftController.createShift(new Date(2018, 11, 15, 10, 25)
            , new Date(2018, 11, 15, 18, 55));

        update = {shift: testShift, type: "deleteShift"};
        await shiftController.updateShift(update);
        testShift = await shiftController.getOneShift(testShift._id);
        expect(testShift).to.equal(null);
    });

    it('create a shift with total hours > 5', async  () =>{
        testShift3 = await shiftController.createShift(new Date(2017,6,7,10,0),
            new Date(2017,6,7,18,0));
        expect(testShift3.totalHours).to.equal(7.5)
    });
    it('create a shift with total hours === 5 hours and 30 minutes', async () =>{
        testShift4 = await shiftController.createShift(new Date(2017,6,7,10,0),
            new Date(2017,6,7,15,30));
        expect(testShift4.totalHours).to.equal(5)
    });
    it('create a shift with total hours <= 5', async () =>{
        testShift5 = await shiftController.createShift(new Date(2017,6,7,10,0),
            new Date(2017,6,7,15,0));
        expect(testShift5.totalHours).to.equal(5);
    });


    after(async () => {
        await employeeController.deleteEmployee(testEmployee2);
        await employeeController.deleteEmployee(testEmployee1);
        await shiftController.deleteShift(testShift3);
        await shiftController.deleteShift(testShift4);
        await shiftController.deleteShift(testShift5);
    });
    after(async() => {
        let employees = await employeeController.getEmployees();
        for (let employee of employees) {
            if (employee.CPR === "0123456789" || employee.CPR === "2013456789" || employee.CPR === "9876543210") {
                await employeeController.deleteEmployee(employee)
            }
        }
        let date1 = new Date("2017-01-01T00:00:00Z");
        let date2 = new Date("2018-11-30T23:59:59Z");
        let shifts = await shiftController.getShifts();
        for (let shift of shifts) {
            if (shift.start.getTime() >= date1.getTime() && shift.end.getTime() <= date2.getTime()) {
                await shiftController.deleteShift(shift);
            }
        }
    });
});
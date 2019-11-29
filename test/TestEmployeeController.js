const employeeController = require('../controllers/EmployeeController');
const shiftController = require('../controllers/shiftController');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

let testEmployee1;
let testEmployee2;
let testEmployee3;
let testShift;
let testShift2;
let testShift3;

describe('Test af employee controllerfunktioner', function(){

    before(async function() {
        this.timeout(10000);
        testEmployee1 = await employeeController.createEmployee("0123456789", "Anders00000", "utzonreceive@gmail.com", "test");
        testEmployee2 = await employeeController.createEmployee("2013456789", "Andersine", "utzonreceive@gmail.com", "test2");
        testEmployee3 = await employeeController.createEmployee("9876543210", "Andreas", "utzonreceive@gmail.com", "test3");
        testShift = await shiftController.createShift(new Date(2018, 11, 15,10,25)
            , new Date(2018, 11, 15,18,55));
        testShift2 = await shiftController.createShift(new Date(2017,6,6,10,0),
            new Date(2017,6,6,18,0));
        testShift3 = await shiftController.createShift(new Date(2017,6,7,10,0),
            new Date(2017,6,7,18,0));
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

    it('return all shifts for an employee between two dates', async () => {
        await employeeController.addEmployeeToShift(testEmployee3, testShift2);
        await employeeController.addEmployeeToShift(testEmployee3, testShift3);
        testEmployee3 = await employeeController.getEmployeeWithID(testEmployee3._id);
        let shiftsList = await employeeController.getShiftsForEmployeeBetweenDates(testEmployee3, new Date(2017,1,1)
            ,new Date(2017,12,31));
        expect(shiftsList.length).to.equal(2);
    });

    it('return total hours for all shifts an employee between two dates', async () =>{
        let hours = await employeeController.getTotalHoursBetweenTwoDatesForAnEmployee(testEmployee3,  new Date(2017,1,1)
            ,new Date(2017,12,31));
        expect(hours).to.equal(15);
    });

    after(async () => {
        await employeeController.removeEmployeeFromShift(testShift2);
        await employeeController.removeEmployeeFromShift(testShift3);
        await employeeController.deleteEmployee(testEmployee2);
        await employeeController.deleteEmployee(testEmployee1);
        await employeeController.deleteEmployee(testEmployee3);
        await shiftController.deleteShift(testShift);
        await shiftController.deleteShift(testShift2);
        await shiftController.deleteShift(testShift3);
    });
});

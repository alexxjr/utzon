const employeeController = require('../controllers/employeeController');
let expect = require('chai').expect;
let fourthtry;

describe('unitTest', () => {
    it('make an employee with one parameter as an empty string', async () => {
        await expect(employeeController.createEmployee("0123456789","Anders", "test@test.dk", "")).to.be.rejectedWith("One or more of the variable strings are the wrong length");
    });

    it('make an employee with only one parameters', async () => {
        await expect(employeeController.createEmployee("test")).to.be.rejectedWith("One of the variables for the employee is not a string");
    });

    it('make an employee with no parameters', async () => {
        await expect(employeeController.createEmployee("test")).to.be.rejectedWith("One of the variables for the employee is not a string");
    });

    it('make an employee with normal parameters', async () => {
        fourthtry = await employeeController.createEmployee("0123456789", "Anders", "utzonreceive@gmail.com", "test");
        fourthtry = await employeeController.getEmployee("0123456789");
        expect(fourthtry.name).to.equal("Anders");
        expect(fourthtry.email).to.equal("utzonreceive@gmail.com");
        expect(fourthtry.CPR).to.equal("0123456789");
        expect(fourthtry.phoneNo).to.equal("test");
        expect(fourthtry.shifts.length).to.equal(0);
    }).timeout(10000);

    it('make an employee with normal parameters', async () => {
        await expect(employeeController.createEmployee("0123456789", "Ole", "test@test.dk", "test")).to.be.rejectedWith("The employee already exists in the database");
    }).timeout(10000);

    after(async () => {
        await employeeController.deleteEmployee(fourthtry);
    });
});


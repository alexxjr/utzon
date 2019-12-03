const loginController = require('../controllers/LoginController');
const employeeController = require('../controllers/employeeController');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

let testLogin1;
let testEmployee1;

describe('Test af login controllerfunktioner', function(){

    before(async function() {
        this.timeout(10000);
        testLogin1 = await loginController.createLogin("test", "test", "Employee");
        testEmployee1 = await employeeController.createEmployee("0123456789", "Anders00000", "utzonreceive@gmail.com", "test");
    });
    this.timeout(10000);

    it('get a role for a login that does not exists', async () => {
        await expect(loginController.getLoginRole("test2")).to.be.rejectedWith("User does not exist in the system");
    });

    it('get a role for a login that does exists', async () => {
        let role = await loginController.getLoginRole("test");
        expect(role).to.equal("Employee");
    });

    it('Validate a password with one of the variable not being a string', async () => {
        await expect(loginController.validatePassword()).to.be.rejectedWith("One of the password when validating a hash is not a string");
    });

    it('Validate a password with the stored password having the wrong format', async () => {
        await expect(loginController.validatePassword("test", "test")).to.be.rejectedWith("The stored password had the wrong format");
    });

    it('Validate a password', async () => {
        let hash = await loginController.generateHash("test");
        let validation = await loginController.validatePassword("test", hash);
        expect(validation).to.equal(true);
        validation = await loginController.validatePassword("test2", hash);
        expect(validation).to.equal(false);
    });

    it('validate a login with a wrong user', async () => {
        expect(await loginController.validateLogin("test23", "test")).to.equal(false);
    });

    it('validate a login with a wrong password', async () => {
        expect(await loginController.validateLogin("test", "test2")).to.equal(false);
    });

    it('validate a login', async () => {
        expect(await loginController.validateLogin("test", "test")).to.equal(true);
    });

    it('validate a login with no parameters', async () => {
        expect(await loginController.validateLogin()).to.equal(false);
    });
    it('Link an employee to a login with no parameters', async () => {
        await expect(loginController.addEmployeeToLogin()).to.be.rejectedWith("This login does not exist");
    });
    it('Link an employee to a login with one parameter', async () => {
        await expect(loginController.addEmployeeToLogin(testLogin1)).to.be.rejectedWith("The employee does not exist in the database");
    });
    it('Link an employee to a login with a nonexistant employee', async () => {
        await loginController.addEmployeeToLogin(testLogin1, testEmployee1);
        testLogin1 = await loginController.getLoginWithID(testLogin1._id);
        expect(testLogin1.employee.toString()).to.equal(testEmployee1._id.toString());
    });
    it('Link an employee to a login with an existing employee', async () => {
        await expect(loginController.addEmployeeToLogin(testLogin1, testEmployee1)).to.be.rejectedWith("This login already has an employee linked");
    });
    it('Remove the employee from a login where no login is provided', async () => {
        await expect(loginController.removeEmployeeFromLogin()).to.be.rejectedWith("Cannot remove employee from an undefined login");
    });
    it('Remove the employee from a login', async () => {
        await loginController.removeEmployeeFromLogin(testLogin1);
        testLogin1 = await loginController.getLoginWithID(testLogin1._id);
        expect(testLogin1.employee).to.equal(undefined);
    });
    it('Check that we get the complete list of logins with employees', async () => {
        let logins = await loginController.getLoginsLean();
        let counter = 0;
        for (let login of logins) {
            if (login.employee !== undefined) {
                counter++;
            }
        }
        let loginsWithEmployees = await loginController.getListOfLoginsWithEmployee();
        expect(loginsWithEmployees.length).to.equal(counter);
    });
    it('Check that we get the complete list of logins without employees', async () => {
        let logins = await loginController.getLoginsLean();
        let counter = 0;
        for (let login of logins) {
            if (login.employee === undefined) {
                counter++;
            }
        }
        let loginsWithEmployees = await loginController.getListOfLoginsWithoutEmployee();
        expect(loginsWithEmployees.length).to.equal(counter);
    });
    it('Test that an employee is automatically deleted if his login is deleted', async () => {
        await loginController.addEmployeeToLogin(testLogin1, testEmployee1);
        testLogin1 = await loginController.getLoginWithID(testLogin1._id);
        await loginController.deleteLogin(testLogin1);
        testEmployee1 = await employeeController.getEmployeeWithID(testEmployee1._id);
        expect(testEmployee1).to.equal(null);
    });
});

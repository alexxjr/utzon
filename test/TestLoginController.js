const loginController = require('../controllers/LoginController');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

let testLogin1;

describe('Test af login controllerfunktioner', function(){

    before(async function() {
        this.timeout(10000);
        testLogin1 = await loginController.createLogin("test", "test", "Employee");
    });

    this.timeout(10000);

    // Testing for adding/removing an employee on shifts

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

    after(async () => {
        await loginController.deleteLogin(testLogin1);
    });
});

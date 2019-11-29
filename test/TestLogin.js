const loginController = require('../controllers/loginController');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));
let fourthtry;

describe('Test af loginfunktioner', () => {
    it('make a login model missing all varible', async () => {
        await expect(loginController.createLogin()).to.be.rejectedWith("The password when generating a hash is not a string");
    });

    it('make a login model with empty strings', async () => {
        await expect(loginController.createLogin("","","")).to.be.rejectedWith("Login validation failed: username: Path `username` is required., role: Path `role` is required.");
    });

    it('make a login model with role that is not an enum', async () => {
        await expect(loginController.createLogin("Howdy","123","Creative Accounting")).to.be.rejectedWith("Login validation failed: role: `Creative Accounting` is not a valid enum value for path `role`.");
    });

    it('make a login with normal parameters', async () => {
        fourthtry = await loginController.createLogin("test", "test", "Employee");
        fourthtry = await loginController.getLogin(fourthtry);
        expect(fourthtry.username).to.equal("test");
        expect(fourthtry.role).to.equal("Employee");
        expect(fourthtry.employee).to.equal(undefined);
    }).timeout(10000);

    it('make a login with a username that already exists', async () => {
        await expect(loginController.createLogin("test", "test", "Employee")).to.be.rejectedWith("E11000 duplicate key error collection: SPSDB.logins index: username_1 dup key: { : \"test\" }");
    }).timeout(10000);

    after(async () => {
        await loginController.deleteLogin(fourthtry);
    });
});


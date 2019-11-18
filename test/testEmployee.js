const controller = require('../controllers/controller');
let expect = require('chai').expect;
let fourthtry;

describe('unitTest', () => {
    it('make an employee with one parameter as an empty string', async () => {
        let firsttry = await controller.createEmployee("0123456789","Anders", "test@test.dk", "");
        expect(firsttry).to.equal(undefined);
    });

    it('make an employee with only one parameters', async () => {
        let secondtry = await controller.createEmployee("test");
        expect(secondtry).to.equal(undefined);
    });

    it('make an employee with no parameters', async () => {
        let thirdtry = await controller.createEmployee();
        expect(thirdtry).to.equal(undefined);
    });

    it('make an employee with normal parameters', async () => {
        fourthtry = await controller.createEmployee("0123456789", "Anders", "test@test.dk", "test");
        fourthtry = await controller.getEmployee("0123456789");
        expect(fourthtry.name).to.equal("Anders");
        expect(fourthtry.email).to.equal("test@test.dk");
        expect(fourthtry.CPR).to.equal("0123456789");
        expect(fourthtry.phoneNo).to.equal("test");
        expect(fourthtry.shifts.length).to.equal(0);
    }).timeout(10000);

    it('make an employee with normal parameters', async () => {
        let fifthtry = await controller.createEmployee("0123456789", "Ole", "test@test.dk", "test");
        expect(fifthtry).to.equal(undefined);
    }).timeout(10000);

    after(async () => {
        await controller.deleteEmployee(fourthtry);
    });
});


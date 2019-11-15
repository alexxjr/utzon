const controller = require('../controllers/controller');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

let testEmployee1;
let testEmployee2;
let testShift;
before(async function() {
    this.timeout(10000);
    testEmployee1 = await controller.createEmployee("0123456789", "Anders", "test@test.dk", "test");
    testEmployee2 = await controller.createEmployee("2013456789", "Andersine", "test2@test2.dk", "test2");
    testShift = await controller.createShift(new Date(2018, 11, 15,10,25)
        , new Date(2018, 11, 15,18,55));
});

describe('unitTest', function(){
    this.timeout(10000);
    it('test if shift is created without employee', async () => {
        expect(testShift.employee).to.equal(undefined);
    });
    it('assign an employee to an empty shift', async () => {
        let testResponse = await controller.addEmployeeToShift(testEmployee1, testShift);
        expect(testEmployee1.shifts[0]._id).to.equal(testShift._id);
    });

    // it('an employee should not be able to be assigned to a shift occupied by an employee already', async () => {
    //     try {
    //         await controller.addEmployeeToShift(testEmployee2, testShift);
    //     }catch (e) {
    //         expect(e).to.equal("An employee is already attached to this shift")
    //     }
    // });
    it('an employee should not be able to be assigned to a shift occupied by an employee already', async () => {
        await expect(controller.addEmployeeToShift(testEmployee2, testShift)).to.be.rejectedWith("An employee is already attached to this shift");

    });
    //
    // it('assign an employee to an empty shift', async () => {
    //     let testResponse = await controller.addEmployeeToShift(testEmployee1, testShift);
    //     expect(testEmployee1.shifts[0]._id).to.equal(testShift._id);
    // });
    //
    // it('make an employee with normal parameters', async () => {
    //     fourthtry = await controller.createEmployee("0123456789", "Anders", "test@test.dk", "test");
    //     expect(fourthtry.name).to.equal("Anders");
    //     expect(fourthtry.email).to.equal("test@test.dk");
    //     expect(fourthtry.CPR).to.equal("0123456789");
    //     expect(fourthtry.phoneNo).to.equal("test");
    //     expect(fourthtry.shifts.length).to.equal(0);
    // }).timeout(10000);

});

after(async () => {
    await controller.deleteEmployee(testEmployee1);
    await controller.deleteEmployee(testEmployee2);
    await controller.deleteShift(testShift);
});
const employee = require('../models/Employee');
let expect = require('chai').expect
    , firsttry = employee.createEmployee("Anders", "test@test.dk", "")
    , secondtry = employee.createEmployee("test")
    , thirdtry = employee.createEmployee()
    , fourthtry = employee.createEmployee("123546789", "Anders", "test@test.dk", "test");

describe('unitTest', () => {
    it('make an employee with one parameter as an empty string', () => {
        expect(firsttry).to.equal(undefined);
    });

    it('make an employee with only one parameters', () => {
        expect(secondtry).to.equal(undefined);
    });

    it('make an employee with no parameters', () => {
        expect(thirdtry).to.equal(undefined);
    });

    it('make an employee with normal parameters', () => {
        expect(fourthtry.name).to.equal("Anders");
        expect(fourthtry.email).to.equal("test@test.dk");
        expect(fourthtry.cpr).to.equal("123456789");
        expect(fourthtry.phoneNo).to.equal("test");
        expect(fourthtry.shifts.length).to.equal(0);
    });

});

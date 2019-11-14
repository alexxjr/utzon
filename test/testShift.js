const shift = require('../models/Shift');
let expect = require('chai').expect
    , firsttry = model.createEmployee("")
    , secondtry = model.createEmployee("test")
    , thirdtry = model.createEmployee()
    , fourthtry = model.createEmployee("");

describe('unitTest', () => {
    it('make a joke without parameters', () => {
        expect(firsttry).to.equal(undefined);
    });

    it('make a joke with only one parameter', () => {
        expect(secondtry).to.equal(undefined);
    });

    // it('make a joke with only one parameter', () => {
    //     let enUser = [
    //         {
    //             "id": 1,
    //             "name": "Leanne Graham",
    //             "username": "Bret",
    //             "email": "Sincere@april.biz",
    //             "address": {
    //                 "street": "Kulas Light",
    //                 "suite": "Apt. 556",
    //                 "city": "Gwenborough",
    //                 "zipcode": "92998-3874",
    //                 "geo": {
    //                     "lat": "-37.3159",
    //                     "lng": "81.1496"
    //                 }
    //             },
    //             "phone": "1-770-736-8031 x56442",
    //             "website": "hildegard.org",
    //             "company": {
    //                 "name": "Romaguera-Crona",
    //                 "catchPhrase": "Multi-layered client-server neural-net",
    //                 "bs": "harness real-time e-markets"
    //             }
    //         }
    //     ];
    //     let enUserTabel =
    //         `<table> <tr><td>1</td><td>Leanne Graham</td><td>Romaguera-Crona</td></tr>\n</table>`;
    //     genererUserTabel(enUser).should.be.equal(enUserTabel);
    // });
});

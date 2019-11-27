const controller = require('../controllers/controller');
const shiftController = require('../controllers/shiftController');
const update = require('../public/Update');
const chai = require('chai');
let expect = chai.expect;
chai.use(require('chai-as-promised'));

let testShift;


describe('Test af controllerfunktioner', function(){

    before(async function() {
        this.timeout(10000);
        testShift = await shiftController.createShift(new Date(2018, 11, 15,10,25)
            , new Date(2018, 11, 15,18,55));
    });

    this.timeout(10000);

    it('checking for no param in manageIncomingUpdates', async () => {
        await expect(controller.manageIncomingUpdates()).to.be.rejectedWith("The param updates are undefined");
    });

    it('checking for length of param in manageIncomingUpdates', async () => {
        await expect(controller.manageIncomingUpdates([])).to.be.rejectedWith("The update array is empty");
    });

    it('ckecing for iterable of updates in manageIncomingUpdates', async() => {
        await expect(controller.manageIncomingUpdates("hej")).to.be.rejectedWith("The updates variable is not an array");
    });

    it('checking for correct error handling in manageIncomingUpdates', async () => {
        let update = "hej";
        let response = await controller.manageIncomingUpdates([update]);
        expect(response.length).to.equal(1);
        expect(response[0].update).to.equal(update);
        expect(response[0].error).to.equal("No update type is given for this update");
    });


     it('create a shift through the update method', async () => {
         let testUpdate = {shift: undefined, newStart: new Date(2020, 11, 15,10,25)
             , newEnd: new Date(2020, 11, 15,18,55), type: "createShift"};
         await controller.manageIncomingUpdates([testUpdate]);
         let shift = await shiftController.getShiftsOnDate(testUpdate.newStart);
         testShift = shift[0];
         expect(testShift.end.getTime()).to.equal(new Date(2020, 11, 15,18,55).getTime());
    });

     // it('login as admin', async () => {
    //     let username = "admin";
    //     let password = "birgitte";
    //     let login = controller.login(username, password);
    //
    // });
    after(async () => {
        await shiftController.deleteShift(testShift);

    });
});

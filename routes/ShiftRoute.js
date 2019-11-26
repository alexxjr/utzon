const controller = require("../controllers/Controller");
const shiftController = require("../controllers/shiftController");
const express = require('express');
const router = express.Router();


router
    .get('/', async (request, response) => {
        let shifts = await shiftController.getShifts();
        response.send(shifts);
    })
    .get('/:date', async (request, response) => {
        let date = new Date(request.params.date);
        let shiftOnDate = await shiftController.getShiftsOnDate(date);
        response.send(shiftOnDate);
    })
    .get('/getOneShift/:shiftID', async (request, response) => {
        let getOneShift = await shiftController.getOneShift(request.params.shiftID);
        response.send(getOneShift);
    })
    .post('/updateShift', async (request, response) => {
        let updates = request.body;
        let failures = await controller.manageIncomingUpdates(updates);
        if (failures.length === 0) {
            response.sendStatus(201);
        }
        else {
            response.send(failures);
        }

    });

module.exports = router;


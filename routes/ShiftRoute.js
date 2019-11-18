const controller = require("../controllers/Controller");
const express = require('express');
const router = express.Router();


router
    .get('/', async (request, response) => {
        let shifts = await controller.getShifts();
        response.send(shifts);
    })
    .get('/:date', async (request, response) => {
        let date = new Date(request.params.date);
        let shiftOnDate = await controller.getShiftsOnDate(date);
        response.send(shiftOnDate);
    })
    .post('/', async (request, response) => {
        const {start, end} = request.body;
        let shift = controller.createShift(start, end)
        if (shift === undefined) {
            response.sendStatus(403);
        } else {
            response.sendStatus(201);
        }
    });

module.exports = router;


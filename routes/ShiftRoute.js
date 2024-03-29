const controller = require("../controllers/Controller");
const shiftController = require("../controllers/shiftController");
const express = require('express');
const router = express.Router();
const session = require('express-session');
const app = express();

app.use(session({secret: 'Utzon secret', saveUninitialized: true, resave: true}));


router
    .get('/', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let shifts = await shiftController.getShifts();
            response.send(shifts);
        }
    })
    .get('/:date', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let date = new Date(request.params.date);
            let shiftOnDate = await shiftController.getShiftsOnDate(date);
            response.send(shiftOnDate);
        }
    })
    .get('/getOneShift/:shiftID', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let getOneShift = await shiftController.getOneShift(request.params.shiftID);
            response.send(getOneShift);
        }
    })
    .get('/getShiftsInPeriod/:start/:end', async (request, response) => {
        let start = new Date(request.params.start);
        let end = new Date(request.params.end);
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let shifts = await shiftController.getShiftsBetweenDates(start, end);
            response.send(shifts);
        }
    })
    .post('/updateShift', async (request, response) => {
        if (request.session.role === "Admin") {
            let updates = request.body;
            let failures = await controller.manageIncomingUpdates(updates);
            if (failures.length === 0) {
                response.sendStatus(201);
            } else {
                response.send(failures);
            }
        }
    });
module.exports = router;


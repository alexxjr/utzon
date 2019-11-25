const controller = require("../controllers/Controller");
const express = require('express');
const router = express.Router();

router
    .get('/', async (request, response) => {
        let employees = await controller.getEmployees();
        response.send(employees);
    })
    .get('/getOneEmployee/:employeeID', async (request, response) => {
    let employee = await controller.getEmployeeWithId(request.params.employeeID);
    response.send(employee);
})
    .get('/getOneEmployeeHours/:employeeID/:startTime/:endTime', async (request, response) => {
        let startDate = new Date(request.params.startTime);
        let toDate = new Date(request.params.endTime);
        let employee = await controller.getEmployeeWithId(request.params.employeeID);
        let totalHours = await controller.getTotalHoursBetweenTwoDatesForAnEmployee(employee, startDate, toDate) + "";
        response.send(totalHours);
    })
    .post('/', async (request, response) => {
        const {CPR, name, email, phoneNo} = request.body;
        let employee = controller.createEmployee(CPR, name, email, phoneNo);
        if (employee === undefined) {
            response.sendStatus(403);
        } else {
            response.sendStatus(201);
        }
    });

module.exports = router;

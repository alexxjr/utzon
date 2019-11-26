const employeeController = require("../controllers/employeeController");
const express = require('express');
const router = express.Router();

router
    .get('/', async (request, response) => {
        let employees = await employeeController.getEmployees();
        response.send(employees);
    })
    .get('/getOneEmployee/:employeeID', async (request, response) => {
    let employee = await employeeController.getEmployeeWithID(request.params.employeeID);
    response.send(employee);
})
    .get('/getOneEmployeeHours/:employeeID/:startTime/:endTime', async (request, response) => {
        let startDate = new Date(request.params.startTime);
        let toDate = new Date(request.params.endTime);
        let employee = await employeeController.getEmployeeWithID(request.params.employeeID);
        let totalHours = await employeeController.getTotalHoursBetweenTwoDatesForAnEmployee(employee, startDate, toDate) + "";
        response.send(totalHours);
    })
    .post('/', async (request, response) => {
        const {CPR, name, email, phoneNo} = request.body;
        let employee = employeeController.createEmployee(CPR, name, email, phoneNo);
        if (employee === undefined) {
            response.sendStatus(403);
        } else {
            response.sendStatus(201);
        }
    });

module.exports = router;

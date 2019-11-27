const employeeController = require("../controllers/employeeController");
const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');

const app = express();

app.use(session({secret: 'Utzon secret', saveUninitialized: true, resave: true}));


router
    .get('/', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let employees = await employeeController.getEmployees();
            response.send(employees);
        } else {
            response.redirect("../../noAccess.html");
        }
    })
    .get('/getOneEmployee/:employeeID', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let employee = await employeeController.getEmployeeWithID(request.params.employeeID);
            response.send(employee);
        } else {
            response.redirect("../../noAccess.html");
        }
    })
    .get('/getOneEmployeeHours/:employee/:startTime/:endTime', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let startDate = new Date(request.params.startTime);
            let toDate = new Date(request.params.endTime);
            let employee = JSON.parse(request.params.employee);
            let totalHours = await employeeController.getTotalHoursBetweenTwoDatesForAnEmployee(employee, startDate, toDate) + "";
            response.send(totalHours);
        } else {
            response.redirect("../../noAccess.html");
        }
    })
    .post('/', async (request, response) => {
        if (request.session.role === "Admin") {
            const {CPR, name, email, phoneNo} = request.body;
            let employee = employeeController.createEmployee(CPR, name, email, phoneNo);
            if (employee === undefined) {
                response.sendStatus(403);
            } else {
                response.sendStatus(201);
            }
        }
    });

module.exports = router;

const controller = require("../controllers/Controller");
const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');

const app = express();

app.use(session({secret: 'Utzon secret', saveUninitialized: true, resave: true}));


router
    .get('/', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let employees = await controller.getEmployees();
            response.send(employees);
        } else {
            response.redirect("../../noAccess.html");
        }
    })
    .get('/getOneEmployee/:employeeID', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let employee = await controller.getEmployeeWithId(request.params.employeeID);
            response.send(employee);
        } else {
            response.redirect("../../noAccess.html");
        }
    })
    .get('/getOneEmployeeHours/:employeeID/:startTime/:endTime', async (request, response) => {
        if (request.session.role === "Admin" || request.session.role === "Employee") {
            let startDate = new Date(request.params.startTime);
            let toDate = new Date(request.params.endTime);
            let employee = await controller.getEmployeeWithId(request.params.employeeID);
            let totalHours = await controller.getTotalHoursBetweenTwoDatesForAnEmployee(employee, startDate, toDate) + "";
            response.send(totalHours);
        } else {
            response.redirect("../../noAccess.html");
        }
    })
    .post('/', async (request, response) => {
        if (request.session.role === "admin") {
            const {CPR, name, email, phoneNo} = request.body;
            let employee = controller.createEmployee(CPR, name, email, phoneNo);
            if (employee === undefined) {
                response.sendStatus(403);
            } else {
                response.sendStatus(201);
            }
        }
    });

module.exports = router;

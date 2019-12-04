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
    }).get('/getLoginShifts/:fromDate/:toDate', async (request, response) => {
    if (request.session.role === "Admin" || request.session.role === "Employee"){
        let user = request.session.user;
        if(user.employee != undefined){
            let start = new Date(request.params.fromDate);
            let end = new Date(request.params.toDate);
            let employee = await employeeController.getEmployeeWithID(user.employee);
            let shifts = await employeeController.getShiftsForEmployeeBetweenDates(employee, start, end);
            response.send(shifts);
        }
    } else {
        response.redirect("../../noAccess.html");
    }
})
    .get('/employeeForUser', async (request, response) => {
        let user = request.session.user;
        if (user.employee) {
            let employee = await employeeController.getEmployeeWithID(user.employee);
            let populatedEmployee = await employeeController.getEmployeePopulated(employee.CPR);
            console.log(populatedEmployee);
            response.send(populatedEmployee);
        } else {
            response.sendStatus(404);
        }
    })
    .post('/', async (request, response) => {
        if (request.session.role === "Admin") {
            const {CPR, name, email, phoneNo} = request.body;
            try {
                let employee = await employeeController.createEmployee(CPR, name, email, phoneNo);
                response.status(201).send(employee._id);
            }
            catch (e) {
                response.status(400).send(JSON.stringify(e.message));
            }
        }
    })
    .post('/deleteEmployee', async (request, response) => {
        if (request.session.role === "Admin") {
            const employeeid = request.body;
            try {
                await employeeController.deleteEmployeeByID(employeeid.employeeid);
                response.sendStatus(201 );
            }
            catch (e) {
                response.status(400).send(JSON.stringify(e.message));
            }
        }
    });

module.exports = router;

const express = require('express');
const session = require('express-session');

const router = express.Router();
const loginController = require('../controllers/LoginController');

const app = express();

app.use(session({secret: 'Utzon secret', saveUninitialized: true, resave: true}));


router
    .post('/', async (request, response) => {
        const {username, password} = request.body;
        if (await loginController.validateLogin(username, password)) {
            request.session.role = await loginController.getLoginRole(username);

            response.send({ok: true});
        } else {
            response.send({ok: false});
        }
    })
    .get('/session', async (request, response) => {
        const role = request.session.role;
        if (role === "Admin" || role === "Employee") {
            response.send(JSON.stringify(role));
        } else {
            response.send(JSON.stringify("noAccess"));
        }
    })
    .get('/logout', async (request, response) => {
        request.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                response.redirect('/');
            }
        });
    })
    .post('/createLogin', async (request, response) => {
        const role = request.session.role;
        if (role === "Admin") {
            try {
                const {username, password, role} = request.body;
                await loginController.createLogin(username, password, role);
                response.sendStatus(200);
            } catch (e) {
                response.status(400).send(JSON.stringify(e.message));
            }

        } else {
            response.send(JSON.stringify("noAccess"));
        }
    })
    .post('/connectEmployee', async (request, response) => {
        const role = request.session.role;
        if (role === "Admin") {
            try {
                const {loginid, employeeid} = request.body;
                await loginController.addEmployeeToLogin(loginid, employeeid);
                response.sendStatus(200);
            } catch (e) {
                response.sendStatus(400);
            }

        } else {
            response.send(JSON.stringify("noAccess"));
        }

    })
    .get('/getListOfLoginsWithoutEmployee', async (request, response) => {
        const role = request.session.role;
        if (role === "Admin") {
            try {
                let employees = await loginController.getListOfLoginsWithoutEmployee();
                response.send(employees);
            } catch (e) {
                response.sendStatus(400);
            }
        } else {
            response.send(JSON.stringify("noAccess"));
        }
    })
    .get('/getListOfLoginsWithEmployee', async (request, response) => {
        const role = request.session.role;
        if (role === "Admin") {
            try {
                let employees = await loginController.getListOfLoginsWithEmployee();
                response.send(employees);
            } catch (e) {
                response.sendStatus(400);
            }
        } else {
            response.send(JSON.stringify("noAccess"));
        }
    });
module.exports = router;

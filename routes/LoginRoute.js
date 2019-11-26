const express = require('express');
const session = require('express-session');

const router = express.Router();
const controller = require('../controllers/Controller');

const path = require('path');
const app = express();
app.use(session({secret: 'Utzon secret', saveUninitialized: true, resave: true}));


router
    .post('/', async (request, response) => {
        const {username, password} = request.body;
        if (await controller.valiteDateLogin(username, password)) {
            request.session.username = username;
            response.send({ok: true});
        } else {
            response.send({ok: false});
        }
    })
    .get('/session', async (request, response) => {
        const username = request.session.username;
        let role = await controller.getLoginRole(username);
        if (role === "admin") {
            // response.send(JSON.stringify("admin"));
            // response.redirect(path.join(__dirname, '../public', 'adminAccess.html'));
            // window.location = 'http://localhost:9119/adminAccess.html';
            response.sendFile(path.join(__dirname, '../public', 'adminAccess.html'));
        } else if(!username) {
            // response.send(JSON.stringify("noAccess"));
            response.sendFile(path.join(__dirname, '../public', 'noAccess.html'));
        } else {
            // response.send(JSON.stringify("employee"));
            response.sendFile(path.join(__dirname, '../public', 'employeeAccess.html'));
        }

    })
    .get('/logout', (request, response) => {
            request.session.destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    response.redirect('../public/index.html');
                }
            });
        }
    );
module.exports = router;

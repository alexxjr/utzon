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
            request.session.username = username;
            response.send({ok: true});
        } else {
            response.send({ok: false});
        }
    })
    .get('/session', async (request, response) => {
        const username = request.session.username;
        let role = await loginController.getLoginRole(username);
        request.session.role = role;
        if (role === "Admin") {
            response.send(JSON.stringify(role));
        } else if(!username) {
            response.send(JSON.stringify(role));
        } else {
            response.send(JSON.stringify(role));
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

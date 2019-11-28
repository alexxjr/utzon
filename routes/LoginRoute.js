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
            let role = await loginController.getLoginRole(username);
            request.session.role = role;

            response.send({ok: true});
        } else {
            response.send({ok: false});
        }
    })
    .get('/session', async (request, response) => {
        const role = request.session.role;
        if (role === "Admin" || role === "Employee") {
            response.send(JSON.stringify(role));
        } else
            response.send("noAccess");

    })
    .get('/logout', (request, response) => {
            request.session.destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    response.send('index.html');
                }
            });
        }
    );
module.exports = router;

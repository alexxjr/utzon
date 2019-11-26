const express = require('express');
const session = require('express-session');

const router = express.Router();
const controller = require('../controllers/Controller');

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
        // husk at ændre efter "Admin" til role ved pull
        request.session.role = "Admin";
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

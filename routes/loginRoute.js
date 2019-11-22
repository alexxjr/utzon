const express = require('express');
const app = express();
const router = express.Router();
const session = require('express-session');
const controller = require('../controllers/Controller');
const fs = require('fs').promises;

app.use(express.static('public'));
app.use(session({secret: 'hemmelig', saveUninitialized: true, resave: true}));


router
    .post('/login', async (request, response) => {
        const {username, password} = request.body;
        if (password === 'birgitte' && username) {
            request.session.username = username;
            response.send({ok: true});
        } else {
            response.send({ok: false});
        }
    })
    .get('/session', async (request, response) => {
        const username = request.session.username;
        let role = await controller.getLoginRole(username);
        if(role === "admin") {

        }

    })
app.get('/session', async (request, response) => {
    const navn = request.session.navn;
    if (navn) {
        let filnavne = await fs.readdir(__dirname + '/html');
        let html = genererLinks(filnavne);
        response.send(html);
    } else {
        response.redirect('/ingenAdgang.html');
    }
});


app.get('/logout', (request, response) => {
        request.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                response.redirect('/');
            }
        });
    }
);

app.get('/:sti', async (request, response) => {
    const navn = request.session.navn;
    if (navn) {
        let filnavne = __dirname + "/html/" + request.params.sti;
        response.sendFile(filnavne);
    } else {
        response.redirect('/ingenAdgang.html');
    }
});

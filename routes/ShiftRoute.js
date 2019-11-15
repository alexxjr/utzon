const controller = require("../controllers/Controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/api/shifts/shifts',async(request, response) => {
        let shifts = await controller.getShifts();
        response.send(shifts);
    })
    .post('/api/shifts/shifts',async(request, response) => {
        const{start, end, totalHours} = request.body;
        let shift = controller.createShift(start, end)
        if(shift === undefined){
            response.sendStatus(403);
        }else{
            response.sendStatus(201);
        }
    });

async function GET(url){
    const OK = 200;
    let response = await fetch(url);
    if(response.status !== OK)
        throw new Error ("GET status code " + response.status);
    return await response.json();
};

module.exports = router;


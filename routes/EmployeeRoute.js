const controller = require("../controllers/Controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/',async(request,response)=>{
        let employees = await controller.getEmployees();
        response.send(employees);
    })
    .post('/',async(request,response)=>{
        const{CPR, name, email, phoneNo} = request.body;
        let employee = controller.createEmployee(CPR, name, email, phoneNo)
        if(employee === undefined){
            response.sendStatus(403);
        }else{
            response.sendStatus(201);
        }
    });

async function GET(url){
    const OK = 200;
    let response = await fetch(url);
    if(response.status!==OK)
        throw new Error("GET status code " + response.status);
    return await response.json();
};

module.exports=router;

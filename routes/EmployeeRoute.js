constcontroller=require("../controllers/Controller");
constexpress=require('express');
constrouter=express.Router();
constfetch=require('node-fetch');

router
    .get('/',async(request,response)=>{
        letemployees=awaitcontroller.getEmployees();
        response.send(employees);
    })
    .post('/',async(request,response)=>{
        const{CPR,name,email,phoneNo}=request.body;
        letemployee=controller.createEmployee(CPR,name,email,phoneNo)
        if(employee==undefined){
            response.sendStatus(403);
        }else{
            response.sendStatus(201);
        }
    });

async function GET(url){
    constOK=200;
    letresponse=awaitfetch(url);
    if(response.status!==OK)
        thrownewError("GETstatuscode"+response.status);
    returnawaitresponse.json();
};

module.exports=router;

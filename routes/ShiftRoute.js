constcontroller=require("../controllers/Controller");
constexpress=require('express');
constrouter=express.Router();
constfetch=require('node-fetch');

router
    .get('/',async(request,response)=>{
        letshifts=awaitcontroller.getShifts();
        response.send(shifts);
    })
    .post('/',async(request,response)=>{
        const{start,end,totalHours}=request.body;
        letshift=controller.createShift(start,end)
        if(shift==undefined){
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


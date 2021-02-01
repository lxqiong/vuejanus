
let  {randomString} =require("./util");
let allEvent =require("./util");


let sessionid=0;
function createSession(){
    let ranstring = randomString();
    var json_data={"janus":"create","transaction":ranstring};
    allEvent[ranstring]={
        success:function(value){
            console.log("create session success:");
            let retjson= JSON.parse(value);
            let datapart = retjson["data"];
            if(datapart == null){
                return;
            }
            sessionid =datapart["id"];
            return allEvent["syncSignal"]["createsession"];     
        },
        id:function(){
            return sessionid;
        },
        error:function(value){
            console.log("create handle error:"+value);
        }
    }
    return JSON.stringify(json_data);
}

function createKeepAlive(){
    let ranstring = randomString();
    var json_data={"janus":"keepalive","transaction":ranstring,"session_id":sessionid};
    return JSON.stringify(json_data);
}

module.exports={createSession,createKeepAlive}
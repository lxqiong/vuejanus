let  {randomString} =require("./util");
let allEvent =require("./util");

function createHandler(sessionid){
    let ranstring = randomString();
    var handleid=0;
    var json_data={"janus":"attach","plugin": "janus.plugin.videoroom","transaction":ranstring,"session_id":sessionid};
    allEvent[ranstring]={
        success:function(value){
            console.log(value);
            let retjson= JSON.parse(value);
            let datapart = retjson["data"];
            if(datapart == null){
                return;
            }
            handleid =datapart["id"];
            console.log("handle id:"+handleid);
            return allEvent["syncSignal"]["createhandle"];
        },
        id:function(){
            return handleid;
        },
        error:function(value){
            console.log("create handle error:"+value);
        }
    }
    return JSON.stringify(json_data);
}

module.exports={createHandler};
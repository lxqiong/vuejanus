let  {randomString} =require("./util");
let allEvent =require("./util");
function createRoom(roomid,sessionid,handleid){
    let ranstring = randomString();
    var body_data={"request":"create","description":"uWss meeting","room":roomid,"bitrate":4096000,"bitrate_cap":true,"publishers":5,"notify_joining":true};
    var json_data={"janus":"message","body":body_data,"transaction":ranstring,"session_id":sessionid,"handle_id":handleid};
    allEvent[ranstring]={
        success:function(value){
            console.log("create room success:"+value);
            return allEvent["syncSignal"]["createroom"];     
        },
        id:function(){
            return ;
        },
        error:function(value){
            console.log("create room error:"+value);
        }
    }
    return JSON.stringify(json_data);
}
function joinRoom(roomid,sessionid,handleid){
    let ranstring = randomString();
    var body_data={"request":"join","room":roomid,"ptype":"publisher","display":"new_web","terminal":"web"};
    var json_data={"janus":"message","body":body_data,"transaction":ranstring,"session_id":sessionid,"handle_id":handleid};
    let retpublishers=null;
    let retlist=null;
    let userid=0;
    allEvent[ranstring]={
        success:function(value){
            console.log("join room success:"+value);
            return allEvent["syncSignal"]["joinroom"];     
        },
        id:function(){
            return userid;
        },
        error:function(value){
            console.log("join room error:"+value);
        },
        event:function(value){
            console.log("join room async:"+value);
            let retjson= JSON.parse(value);
            let plugin = retjson["plugindata"];
            if(plugin == null){
                return;
            }
            var data =plugin["data"];
            if(data ==null){
                return;
            }
            
            userid = data["id"];
            var lists = data["list"];
            retpublishers = data["publishers"];
            var newlist={};
            //console.log(lists);
            for (let item in lists) {
                newlist[lists[item]["id"]]=lists[item];
            }
            for(let item in retpublishers){
                var publish =retpublishers[item];
                if(publish["mediatype"]=="video"){
                    console.log(newlist);
                    console.log(retpublishers);
                    newlist[publish["id"]]["mutevideo"]=false;
                }else if(publish["mediatype"]=="screen"){
                    newlist[publish["id"]]["screenshare"]=true;
                }
            }
            retlist = newlist;
            console.log(retlist);
            return allEvent["eventSignal"]["joinroom"];     
        },
        publishers:function(){
            return retpublishers;
        },
        membserlists:function(){
            return retlist;
        }
    }
    return JSON.stringify(json_data);
}

function leaveRoom(roomid,sessionid,handleid){
    let ranstring = randomString();
    var body_data={"request":"leave","room":roomid};
    var json_data={"janus":"message","body":body_data,"transaction":ranstring,"session_id":sessionid,"handle_id":handleid};
    allEvent[ranstring]={
        success:function(value){
            console.log("leave room success:"+value);
            return;     
        },
       
        error:function(value){
            console.log("leave room error:"+value);
        },
        event:function(value){
            console.log("leave room async:"+value);
              
        },
    }
    return JSON.stringify(json_data);
}

module.exports={createRoom,joinRoom,leaveRoom}
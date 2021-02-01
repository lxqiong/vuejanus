
const session=require("./session");
const allEvent =require("./util");
let {createHandler} = require("./handler");
let {createRoom,joinRoom,leaveRoom} = require("./room");
let {createSubscriber,subScribeMedia} = require("./subscriber");
let {createPublisher,delPublishser} = require("./publisher");

function ClassHandler(){
    console.log("ClassHandler()");
}

let ws = null;

let localrenderIndex=null;
let sessionId=0;
let mainHandleId=0;
let audioHandleId=0;
let videoHadnleId=0;
let screenHandleId=0;
let selfUserid=0;
let roomid=12354;
var videorender=[];
let videorenderele=[];
let allpublisher=[];

ClassHandler.playall=function(roomcb){
    allpublisher.forEach(inpublisher => {
        console.log("receive publisher:"+inpublisher["id"]+" "+inpublisher["mediatype"]); 
        if(inpublisher["mediatype"] !="audio"){
            let json_data =createSubscriber(roomid,inpublisher["id"],inpublisher["mediatype"],sessionId);
            if(inpublisher["mediatype"] != "audio"){
                let index=get_videorender(inpublisher["id"])
                if(index>=0 && roomcb != null){
                    roomcb("publisher",inpublisher["mediatype"],null,index+1);
                }
                
            }
            ws.send(json_data); 
        }  
                   
        });
}

function SubscribeRemote(publishers,roomcb){
    publishers.forEach(inpublisher => {
    console.log("receive publisher:"+inpublisher["id"]+" "+inpublisher["mediatype"]); 
    if(inpublisher["mediatype"] !="audio"){
        let json_data =createSubscriber(roomid,inpublisher["id"],inpublisher["mediatype"],sessionId);
        if(inpublisher["mediatype"] != "audio"){
            let index=get_videorender(inpublisher["id"])
            if(index>=0 && roomcb != null){
                roomcb("publisher",inpublisher["mediatype"],null,index+1);
            }
            
        }
        ws.send(json_data); 
    }  
               
    });
}

function reset_videorender(id){
    let index = get_videorender(id);
    if(index>=0){
        videorender[index]=0;
        videorenderele[index].srcObject=null;
        console.log("reset_videorender "+index);
    }
   
    return index;
}

function set_videorender(id){
    let i = get_videorender(id);
    if(i==undefined){
        for (let index = 0; index < videorender.length; index++) {
            if(videorender[index]==0){
                videorender[index]=id;
                return index;
            }
        }
    }else{
        return i;
    }
}

function get_videorender(id){
    for (let index = 0; index < videorender.length; index++) {
        if(videorender[index]==id){
            return index;
        }
    }
}

function parse_async_event(eventobj,roomcb){
    var plugin_data =eventobj["plugindata"];
    if(plugin_data != null){
        var json_data=plugin_data["data"];
        if(json_data==null){
            return;
        }
    //    if(json_data["type"] != null){
    //        if(json_data["type"]== "subscribed"){

    //        }
    //    }
        if(json_data["joining"] != null){
            var join_data = json_data["joining"];
            var id = join_data["id"];
            var display_name = join_data["display"];
            var terminal =  join_data["terminal"];
            let index=set_videorender(id);
            if(index>=0){
                roomcb("joining",id,display_name,index+1);
            }
            console.log("new member:"+id+" "+display_name+" "+terminal);
        }else if(json_data["publishers"] != null){
            var publishers = json_data["publishers"];
            SubscribeRemote(publishers,roomcb);
        }else if(json_data["leaving"] != null){
            let id = json_data["leaving"];
            let index=reset_videorender(id);
            console.log("member:"+id+" is leaving "+index);
            if(index>=0){
                roomcb("leaving",id,null,index+1);
            }
           
            return;
        }else if(json_data["unpublished"] != null){
            let id = json_data["unpublished"];
            let media = json_data["mediatype"];
            console.log("member:"+id+" unpublish media type:"+media);
            let index = get_videorender(id);
            if(media=="screen"){
                videorenderele[3].srcObject=null;
            }else{
                if (index>=0){
                    videorenderele[index].srcObject=null;
                }
            }
            if(index>=0){
                roomcb("unpublish",media,null,index+1);
            }
            
            //reset_videorender(id);
        }
    }

}

ClassHandler.init = function(audioelement,videoelements,roomcb){
    console.log("ClassHandler init");

    
    if( "WebSocket" in window){
        ws = new WebSocket("wss://s6-meeting.unicloud.com/janus_wss","janus-protocol");
        ws.onopen = function()
        {
            // Web Socket 已连接上，使用 send() 方法发送数据
           console.log("连接 服务器成功");
           let json_data =session.createSession();
           ws.send(json_data);
           for (let index = 0; index < videoelements.length; index++) {
               console.log(videoelements[index]);
               videorender[index]=0;
           }
           videorenderele = videoelements;
           
        };
        
        ws.onmessage = function (evt) 
        { 
            var received_msg = evt.data;
            console.log(received_msg)
            var obj=JSON.parse(received_msg);
            var janus_event = obj["janus"];
            if(janus_event == null){
                return;
            }
            var transtring =  obj["transaction"];
            var handler = allEvent[transtring];
            if(handler == null){
                parse_async_event(obj,roomcb);
                return;
            }
            if(janus_event=="success"){
                console.log("sync event");
                let id =0;
                var sync_signal = handler.success(received_msg);
                if(handler.id != undefined){
                    id =handler.id();
                }
                console.log(sync_signal);
                if(sync_signal==allEvent["syncSignal"]["createsession"]){
                    console.log("createsession");
                    sessionId = id;
                    let json_data =createHandler(sessionId);
                    ws.send(json_data);
                    setInterval(function(){
                        ws.send(session.createKeepAlive());
                    },5000);
                }else if(sync_signal==allEvent["syncSignal"]["createhandle"]){
                    console.log("createhandle:");
                    if(mainHandleId ==0){
                        mainHandleId=id;
                    }else if(audioHandleId ==0){
                        audioHandleId = id;
                    }else if(videoHadnleId == 0){
                        videoHadnleId = id;
                    }else if(screenHandleId == 0){
                        screenHandleId = id;
                        let json_data =createRoom(roomid,sessionId,mainHandleId);
                        ws.send(json_data);
                        return;
                    }
                    console.log("session id:"+sessionId);
                    let json_data =createHandler(sessionId);
                    ws.send(json_data);
                }else if(sync_signal==allEvent["syncSignal"]["createroom"]){
                    console.log("sync create room:");
                    let json_data =joinRoom(roomid,sessionId,mainHandleId)
                    ws.send(json_data);
                }else if(sync_signal==allEvent["syncSignal"]["subhandle"]){
                    console.log("sync create subhandle:");
                    let json_data=handler.submedia();
                    ws.send(json_data);
                }
               
                
            }else if(janus_event=="event"){
                var event_signal= handler.event(received_msg);
                if(event_signal==allEvent["eventSignal"]["joinroom"]){
                    var publishers= handler.publishers();
                    selfUserid = handler.id();
                    var memberlist = handler.membserlists();
                    let index=0;
                    for( let key in memberlist){
                        videorender[index]=key;
                        if(selfUserid==key){
                            console.log("my index:"+index);
                            localrenderIndex =index;
                        }
                        index++;
                    }
                    roomcb("joined",selfUserid,memberlist);
                    SubscribeRemote(publishers,null);
                }else if(event_signal==allEvent["eventSignal"]["createsuboffer"]){
                    var remote_offer=handler.getoffer();
                    var remote_media = handler.getmedia();
                    if(remote_media=="audio"){
                        subScribeMedia(remote_offer,roomid,sessionId,handler.id(),audioelement,function(json_data){
                            ws.send(json_data);
                        });
                    }else if(remote_media=="video"){
                        let index=get_videorender(handler.userid());
                        if(index >=0){
                            console.log("video index:"+index);
                            subScribeMedia(remote_offer,roomid,sessionId,handler.id(),videoelements[index],function(json_data){
                                ws.send(json_data);

                            });
                        }
                        
                    }else if(remote_media=="screen"){
                        console.log("play screen");
                        subScribeMedia(remote_offer,roomid,sessionId,handler.id(),videoelements[3],function(json_data){
                            ws.send(json_data);
                        });
                        videorender[videorender.length-1]=handler.userid();
                    }
                    
                   
                }
            }else if(janus_event !="ack"){
                handler.error(received_msg);
            }
        };

        ws.onerror = function(error){
            console.log(error)
        }
        
        ws.onclose = function()
        { 
            console.log("连接关闭")
            // 关闭 websocket
            //alert("连接已关闭..."); 
        };
    }
    
}


ClassHandler.openvideo=function(cb){
    
    var localvideo =allEvent["openvideo"];
    if(localvideo==null || localvideo==false){
         console.log("打开视频:"+localrenderIndex);
        createPublisher(sessionId,videoHadnleId,"video", videorenderele[localrenderIndex],function(localoffer){
        console.log("video local sdp:"+localoffer);
        ws.send(localoffer);
        allEvent["openvideo"] = true;
        let index =set_videorender(selfUserid);
        console.log("打开 local index:"+index);
        cb(index+1,true);
    });
    }else{
        console.log("关闭视频");
        delPublishser(sessionId,videoHadnleId,function(data){
            console.log("del video publisher:"+data);
            ws.send(data);
            allEvent["openvideo"] = false;
            // videoelements[localrenderIndex]=null;
            // localvideorender.srcObject=null;
            let index=get_videorender(selfUserid);
            if(index>=0){
                videorenderele[index].srcObject=null;
                cb(index+1,false);
            }
            console.log("关闭local index:"+index);
           
        });
    }
    

}

ClassHandler.openaudio=function(cb){
   
    var localaudio=allEvent["openaudio"];
    if(localaudio==null || localaudio==false){
        console.log("打开音频");
        createPublisher(sessionId,audioHandleId,"audio",null,function(localoffer){
            console.log("audio local sdp:"+localoffer);
            ws.send(localoffer);
            allEvent["openaudio"] = true;
            let index =set_videorender(selfUserid);
            cb(index+1,true);
    
        });
    }else{
        console.log("关闭音频");
        delPublishser(sessionId,audioHandleId,function(data){
            console.log("del audio publisher:"+data);
            ws.send(data);
            allEvent["openaudio"] = false;
            let index =get_videorender(selfUserid);
            cb(index+1,false);
        });
    }
    
}

ClassHandler.openscreen=function(cb){
    
    var localscreen =allEvent["openscreen"];
    if(localscreen==null || localscreen==false){
        console.log("打开桌面");
        createPublisher(sessionId,screenHandleId,"screen",null,function(localoffer){
            console.log("screen local sdp:"+localoffer);
            ws.send(localoffer);
            allEvent["openscreen"] = true;
            let index =set_videorender(selfUserid);
            cb(index+1,true);
    
        });
    }else{
        console.log("关闭桌面");
        delPublishser(sessionId,screenHandleId,function(data){
            console.log("del screen publisher:"+data);
            ws.send(data);
            allEvent["openscreen"] = false;
            let index =get_videorender(selfUserid);
            cb(index+1,false);
        });
    }
}

ClassHandler.leavemeet=function(){
    console.log("离开房间");
    let json_data =leaveRoom(roomid,sessionId,mainHandleId);
    ws.send(json_data);
}

module.exports=ClassHandler
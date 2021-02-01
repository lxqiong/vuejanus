let  {randomString} =require("./util");
let allEvent =require("./util");

function createSubscriber(roomid,feedid,media,sessionid){
    let ranstring = randomString();
    let subscribe_string="";
    let subscribe_jsep={};
    let handleid=0;
    let userid = feedid;
    var json_data={"janus":"attach","plugin": "janus.plugin.videoroom","transaction":ranstring,"session_id":sessionid};
    allEvent[ranstring]={
        success:function(value){
            console.log("create subcriberhandler success:"+value);
            let retjson= JSON.parse(value);
            let datapart = retjson["data"];
            if(datapart == null){
                return;
            }
            handleid =datapart["id"];
            console.log("subcriber handle id:"+handleid);
            var body_data={"request":"join","ptype":"subscriber","room":roomid,"mediatype":media,"feed":feedid};
            let json_data={"janus":"message","body":body_data,"transaction":ranstring,"session_id":sessionid,"handle_id":handleid};
            subscribe_string = JSON.stringify(json_data);
            return allEvent["syncSignal"]["subhandle"];     
        },
        id:function(){
            return handleid;
        },
        userid:function(){
            return userid;
        },
        event:function(value){
            console.log("handle subscriber event:"+value);
            var retjson= JSON.parse(value);
            var data_jsep = retjson["jsep"];
            if(data_jsep != null){
                subscribe_jsep= data_jsep;
                return allEvent["eventSignal"]["createsuboffer"];
            }
        },
        error:function(value){
            console.log("create subscriber error:"+value);
        },
        submedia:function(){
            return subscribe_string;
        },
        getoffer:function(){
            return subscribe_jsep;
        },
        getmedia:function(){
            return media;
        }
    }
    return JSON.stringify(json_data);
}

function subScribeMedia(subscribe_jsep,roomid,sessionid,handleid,renderelement,senddata){

    let ranstring = randomString();
    var body_data = {"request":"start","room":roomid};
    let local_offer;
    // var DtlsSrtpKeyAgreement = { DtlsSrtpKeyAgreement: true};
    // var STUN = { urls: "stun:stun.l.google.com:19302"};
    // var TURN = { urls: "turn:turn.bistri.com:80", credential: "homeo", username: "homeo"};
    // var iceServers = { iceServers: [STUN, TURN]};
    // var optional = { optional: [DtlsSrtpKeyAgreement]}; 
    // let media_pc = new RTCPeerConnection(iceServers,optional);
    let media_pc = new RTCPeerConnection();
    let stream=null;
    media_pc.onaddstream = function (evt) {
        console.log("play success1");
        // console.log(renderelement);
        stream = evt.stream;
        console.log(stream);

        try {
            renderelement.srcObject = stream;} catch (error) {
                renderelement.src = window.URL.createObjectURL(stream);}
                console.log(renderelement);
        
        
    };
    allEvent[ranstring]={
        success:function(value){
            console.log("sub success"+value);
        },
        event:function(value){
            console.log("subScribeMedia success"+value);
            // media_pc.setLocalDescription(local_offer);
            // renderelement.srcObject = null;
            // renderelement.srcObject=stream;
            // renderelement.click();
            //console.log("subScribeMedia success"+renderelement.srcObject);
            //renderelement.srcObject=stream;
           // let vdo = document.getElementById("videoplay3")
          // renderelement.src = URL.createObjectURL(stream);
           // vdo.srcObject = stream;
          
           // document.querySelector('#videoplay3').srcObject=stream;
                media_pc.setLocalDescription(local_offer);
            
        },
        error:function(value){
            console.log("subScribeMedia error"+value);
        }

    };

    // console.log(subscribe_jsep);
    media_pc.setRemoteDescription(new RTCSessionDescription(subscribe_jsep));
    media_pc.createAnswer().then(function(answer_desc){
        local_offer= answer_desc;
        console.log("create answer success:"+local_offer.sdp);
        var jsep_data = {"type":"answer","sdp":local_offer.sdp};
        var json_data={"janus":"message","body":body_data,"transaction":ranstring,"session_id":sessionid,"handle_id":handleid,"jsep":jsep_data};
        senddata(JSON.stringify(json_data));

    }).then(function(){
       
           
    })
   

}


module.exports={createSubscriber,subScribeMedia}
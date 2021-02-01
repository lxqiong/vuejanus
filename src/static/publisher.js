let  {randomString} =require("./util");
let allEvent =require("./util");
let media_pc=null;
// let sender = null;
let stream = null;
async function OpenMediaDevice(sessionid,handleid,media,renderelement,localoffercb){

    var DtlsSrtpKeyAgreement = { DtlsSrtpKeyAgreement: true};
    var STUN = { urls: "stun:stun.l.google.com:19302"};
    var TURN = { urls: "turn:turn.bistri.com:80", credential: "homeo", username: "homeo"};
    var iceServers = { iceServers: [STUN, TURN]};
    var optional = { optional: [DtlsSrtpKeyAgreement]}; 
    media_pc = new RTCPeerConnection(iceServers,optional);
   
    if(media=="video"){
        stream = await navigator.mediaDevices.getUserMedia(
            {video:true,audio:false});
        renderelement.srcObject = stream;
    }else if(media=="audio"){
        stream = await navigator.mediaDevices.getUserMedia(
            {video:false,audio:true});
    }else{
        stream = await navigator.mediaDevices.getDisplayMedia(
            {video:true,audio:false});
    }
    var tracks=null;
    if(media=="audio"){
        tracks = stream.getAudioTracks();
    }else{
        tracks = stream.getVideoTracks();
    }
    console.log(tracks.length);
    if(tracks.length>0){
        //track = tracks[0];
        media_pc.addTrack(tracks[0] );
        console.log(stream);
        media_pc.createOffer().then(function(offer){
            media_pc.setLocalDescription(offer);
        }).then(function(){
            
            let ranstring = randomString();
            var baudio = (media=="audio")? true:false;
            var bvideo = (media=="video"||media=="screen")? true:false;
            var bscreen = (media=="screen")? true:false;
           var body_data = {"request":"configure","audio":baudio,"video":bvideo,"screen":bscreen};
           var json_data={"janus":"message","body":body_data,"transaction":ranstring,"session_id":sessionid,"handle_id":handleid,"jsep":media_pc.localDescription};
           
            allEvent[ranstring]={
                success:function(value){
                    console.log("publish success"+value);
                },
                event:function(value){
                    console.log("senderoffer success"+value);
                    var retjson =JSON.parse(value);
                    var data_jsep = retjson["jsep"];
                    console.log(data_jsep);
                    media_pc.setRemoteDescription( new RTCSessionDescription(data_jsep));
                    allEvent[handleid]=media_pc;  
                },
                error:function(value){
                    console.log("subScribeMedia error"+value);
                }
        
            };
            localoffercb( JSON.stringify(json_data));
        });
    }
    
}
    

function createPublisher(sessionid,handleid,media,renderelement,localoffercb){

    OpenMediaDevice(sessionid,handleid,media,renderelement,localoffercb);
}

function delPublishser(sessionid,handleid,callbk){
    console.log("delPublishser:"+handleid);
    var pc=allEvent[handleid];
    if(pc != null){
        let senders = pc.getSenders();
        if(senders.length>0){
            console.log("remove track"+senders[0].track.kind);
            console.log(senders[0].track.kind);
            senders[0].track.stop();
        }
        pc.close();
        
    }
    let ranstring = randomString();
    var body_data = {"request":"unpublish"};
    var json_data={"janus":"message","body":body_data,"transaction":ranstring,"session_id":sessionid,"handle_id":handleid};
    callbk(JSON.stringify(json_data));

}

module.exports={createPublisher,delPublishser};
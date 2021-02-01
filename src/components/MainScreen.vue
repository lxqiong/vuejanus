<template >
<div id="mains">
     <video id="audioplay" height="0" width="0" autoplay playsinline ></video>
    
   <div id="videos">     
        <div class="cusvideo" v-for="item in videoitems" :key="item">
            
            <video class="smallvideo" :id="'videoplay'+item" autoplay ></video>
              <div class="subname">
                <p :id="'classname'+item" style="margin:0;padding:0"></p>
             </div>
             <div class="subvideo">
                <img src="../assets/screen-off.svg" :id="'imgscreen'+item"/>
                <img src="../assets/audio-off.svg" :id="'imgaudio'+item"/>
                <img src="../assets/cammera-off.svg" :id="'imgcammera'+item"/>
             </div>
           
        </div>
        <!-- <div class="cusvideo">
            <video  class="smallvideo" id="videoplay2"  autoplay playsinline></video>
            <div class="subvideo">
                <img src="../assets/screen-off.svg" />
                <img src="../assets/audio-off.svg" />
                <img src="../assets/cammera-off.svg" />
             </div>
        </div> -->
         <!-- <div class="cusvideo">
            <video class="smallvideo" id="videoplay3"  autoplay playsinline></video>
            <div class="subvideo" >
                <img src="../assets/screen-off.svg" id="videoplay3"/>
                <img src="../assets/audio-off.svg" id="videoplay3"/>
                <img src="../assets/cammera-off.svg" id="videoplay3"/>
             </div>
            
         </div> -->
        <!-- <video height="100px" width="200px" class="smallvideo" id="videoplay1" autoplay playsinline></video> -->
        <!-- <videoscreen  class="smallvideo" id="videoplay1"></videoscreen> 
        <videoscreen id="videoplay2" class="smallvideo"></videoscreen>
        <videoscreen id="videoplay3" class="smallvideo"></videoscreen> -->
  </div>
   <div id="selfscreen">
      <!-- <videoscreen id="videoplay4"></videoscreen> -->
      <video id="videoplay4"  autoplay playsinline width="100%" height="100%"></video>
      <!-- <img id="showmember" @click="showmember" type="button" :src="showmem"> -->
      <!-- <button id="showmember" type="button" value="1" @click="showmember">{{showmem}}</button> -->
  </div>
   <div id="toolbar">
       <div>
       </div>
        <div id="milddle-tool">
            <img type="button" v-on:click="changeaudio" :src="audiobk" />
            <img type="button"  v-on:click="changevideo" :src="cammerabk"/>
            <img type="button"  v-on:click="changescreen" :src="screenbk"/>
            <img type="button" v-on:click="leavemeet" src="../assets/leave.svg" />
        </div>
        <div>
        </div>
        
  </div>
</div>
    
</template>

<script>
// import videoscreen from "./VideoScreen"
// const classhandler = require("../static/classhandler.js");
import classhandler from "../static/classhandler"

export default {
    data:function(){
        return {
            showmem:require("../assets/left.svg"),
            audiobk:require("../assets/audio-off.svg"),
            cammerabk:require("../assets/cammera-off.svg"),
            screenbk:require("../assets/screen-off.svg"),
            videoitems:[1,2,3],
            video4:null,
            }
    },
    components:{
        // videoscreen,
    },
    methods:{
        showmember:function(){
            console.log("显示列表1");
            console.log(this.$store.state.isshowmember);
            if(this.$store.state.isshowmember){
 
                this.showmem=require("../assets/right.svg");
                this.$store.state.isshowmember=false;
            }else{
                this.showmem=require("../assets/left.svg");
                this.$store.state.isshowmember=true;
            }
        },
        changevideo:function () {  
            classhandler.openvideo((index,value)=>{
                var imgname= "imgcammera"+index;
                if(value==true){
                     this.cammerabk=require("../assets/cammera.svg");
                     document.getElementById(imgname).src=require("../assets/cammera.svg");
                }else{
                  this.cammerabk=require("../assets/cammera-off.svg");
                  document.getElementById(imgname).src=require("../assets/cammera-off.svg");
                }
            });
        },
        changeaudio:function () {  
            classhandler.openaudio(
                (index,value)=>{
                var imgname= "imgaudio"+index;
                console.log("audio name:"+imgname);
                if(value==true){
                     this.audiobk=require("../assets/audio.svg");
                     document.getElementById(imgname).src=require("../assets/audio.svg");
                }else{
                    this.audiobk=require("../assets/audio-off.svg");
                    document.getElementById(imgname).src=require("../assets/audio-off.svg");
                }
            });
        },
        changescreen:function(){
            classhandler.openscreen( (index,value)=>{
                var imgname= "imgscreen"+index;
                console.log("imgscreen name:"+imgname);
                if(value==true){
                     this.screenbk=require("../assets/screen.svg");
                     document.getElementById(imgname).src=require("../assets/screen.svg");
                }else{
                    this.screenbk=require("../assets/screen-off.svg");
                     document.getElementById(imgname).src=require("../assets/screen-off.svg");
                }
            });
        },
        leavemeet:function(){
            classhandler.leavemeet();
        }

    },
    created:function(){

        console.log("created");
         
        
    },
    mounted:function(){

        console.log(document.querySelector("#audioplay"));
        if(document.querySelector("#audioplay") != undefined){
            console.log("init");
            var videoelements=[];
            // document.querySelector("#videoplay4").dblclick();
            // document.querySelector("#videoplay4").dblclick();
            videoelements[0] =document.querySelector("#videoplay1")
            videoelements[1] =document.querySelector("#videoplay2")
            videoelements[2] =document.querySelector("#videoplay3")
            videoelements[3] =document.querySelector("#videoplay4")
            classhandler.init(document.querySelector("#audioplay"),videoelements,(action,myid,memberlist,memindex)=>{
                if(action=="joined"){
                    console.log("memberlist");
                    let index=1;
                    for( let key in memberlist){
                        let tname="classname"+index;
                        console.log("classname:"+tname);
                        document.getElementById(tname).innerHTML=memberlist[key]["display"];
                        if(memberlist[key]["muteaudio"]==false){
                            let imgaudio="imgaudio"+index;
                            document.getElementById(imgaudio).src=require("../assets/audio.svg");
                        }
                        if(memberlist[key]["mutevideo"]==false){
                            let imgcammera="imgcammera"+index;
                            document.getElementById(imgcammera).src=require("../assets/cammera.svg");
                        }
                        if(memberlist[key]["screenshare"]){
                            let imgscreen="imgscreen"+index;
                            document.getElementById(imgscreen).src=require("../assets/screen.svg");
                        }
                        index++;
                    }
                }else if(action=="joining"){
                    let tname="classname"+memindex;
                    document.getElementById(tname).innerHTML=memberlist;

                }else if(action=="leaving"){
                    console.log("member leaving:"+memindex);
                    let tname="classname"+memindex;
                    document.getElementById(tname).innerHTML="";
                }else if(action=="publisher"){
                    if(myid=="video"){
                        let imgcammera="imgcammera"+memindex;
                        document.getElementById(imgcammera).src=require("../assets/cammera.svg");
                    }else if(myid=="screen"){
                        let imgscreen="imgscreen"+memindex;
                        document.getElementById(imgscreen).src=require("../assets/screen.svg");
                    }
                }else if(action=="unpublish"){
                     if(myid=="video"){
                        let imgcammera="imgcammera"+memindex;
                        document.getElementById(imgcammera).src=require("../assets/cammera-off.svg");
                    }else if(myid=="screen"){
                        let imgscreen="imgscreen"+memindex;
                        document.getElementById(imgscreen).src=require("../assets/screen-off.svg");
                    }
                }
                
            });
        }

       
       
    
    }  
}
</script>

<style scoped>
    #mains{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
         height: 100%; 
        width: 100%;
    }
    #videos{
         display: flex;
          height: 20%;
        width: 100%;
        background: #2B2C2E;
        justify-content: space-around;
        align-items: center;
    }
    #videos >.cusvideo{  
      border: 1px solid black;
      background: #2B2C2E;
       width: 100%;
       height: 100%;
      position: relative;
    }

    .subvideo{
         position: absolute;
         right:0;
         bottom:0;
    }
    .subname{
         position: absolute;
         bottom:0;
         left: 10px;
    }
    .subvideo img{
        width: 20px;
    }
    .smallvideo{
        height:200px;
        width: 200px;
        z-index: 2;
        /* max-width:100% ;
        max-height:100% ; */
        /* object-fit: fill;  */
    } 
    #selfscreen{  
        height: 55%;
        width: 100%;
        background:#03AE92;
        position: relative;
    }
    #selfscreen img{
         position: absolute;
         right: 0px;
         width: 30px;
         top: 50%;
    }
    #toolbar{
        display: flex;
        height: 10%;
        width: 100%;
        background: #2B2C2E;
        justify-content: space-between;
    }
    #milddle-tool{
         display: flex;
          width: 50%;
         justify-content: space-between;
         align-items: center;
    }
    #milddle-tool img{
        width: 50px;
    }
   
</style>
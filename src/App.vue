<template>
  <div id="app">
    <div class="mainscreen">
      
        <div id="screen" class="screen">
          <MainScreen></MainScreen>
        </div>
    <!-- <transition  name="fade"  @before-enter="transitionStart" @after-leave="transitionComplete">
      <div id="user" class="user" v-if="this.$store.state.isshowmember">
        <UserList></UserList>
      </div>
    </transition > -->
    </div>
  </div>
</template>

<script>
// import UserList from "./components/UserList"
import MainScreen from "./components/MainScreen"

export default {
  name:"App",
  components:{
   MainScreen,
    // UserList,
  },
  beforeCreate(){
    //  document.querySelector('body').setAttribute('style', 'background-color:#DDDDDD;')
    //  document.querySelector('html').setAttribute('style', 'background-color:#DDDDDD;')
  },
  
  data:function(){
    return {
      isshowmem:true,
    }
  },
  methods:{
    transitionStart:function(){
      console.log("transitionStart");
      document.getElementById("screen").style.width="80%";
      //  var img=document.getElementById("showmember");
      // document.getElementById("showmember").src="./assets/left.svg";
      // document.getElementById("showmember").style.left="calc(80% - 30px)";
    //  document.getElementById("user").style.width="0%";
    },
    transitionComplete:function(){
      console.log("transitionComplete");
      document.getElementById("screen").style.width="100%";
      // var img=document.getElementById("showmember");
      // console.log("img:"+img.src);
      // document.getElementById("showmember").src="./assets/right.svg";
      // document.getElementById("showmember").style.left="calc(100% - 30px)";
      // document.getElementById("user").style.width="20%";
    },
  },
}
</script>

<style scoped>
html,
body,
#app{
  width:1024px;
  height:768px;
  background-color:#DDDDDD;
  margin:5% auto; 
}


.mainscreen{
   width: 100%;
  height:100%;
  background: #2E2F33;
}

.screen{
  width: 100%;
  height: 100%;
}
.user{
  width: 20%;
  height: 100%;
  background: #f1f1f1;
  
}

.fade-enter,.fade-leave-to{
                opacity: 1;
}


</style>
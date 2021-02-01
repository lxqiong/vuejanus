<template>
    <div class="users">
        <p style="text-align:center;">在线人数({{Userlists.length}})</p>
        <hr>
        <ul>
            <li  v-for="(item,index) in Userlists" :key=index class="user">
                <div class="user-name">
                    <img src="../assets/pc.svg"   class="terminal"  />
                    <span > {{item}} </span>
                </div>
                <div class="user-media">
                     <img src="../assets/screen.svg"   class="terminal"  />
                    <img src="../assets/audio.svg"   class="terminal"  />
                    <img src="../assets/cammera.svg"   class="terminal"  />
                    
                </div>
            </li>
        </ul>
    </div>
   
</template>


<script>
export default {
    name:"UserList",
    data:function () {
            return {
                Userlists:["abcd","edfg","kdfhk"],
            }
        },
}
</script>

<style scoped>

ul{
   list-style-type:none;
   margin:0;
   padding-left: 10px;
}
li:hover{
    background:#434343;
}

.user{
    clear: both;
    position: relative; 
    padding-bottom: 30px;
    
}

.user-name{
    float: left;
    
}

 .user-media{
     float: left;
     position:absolute;
     right: 10px;
} 
.terminal{
    width:25px;
    vertical-align:middle;
}


</style>
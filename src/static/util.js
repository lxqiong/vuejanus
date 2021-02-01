
let allEvent={};
let syncSignal={"none":0,"createsession":1,"createhandle":2,"createroom":3,"joinroom":4,"subhandle":5};
let eventSignal={"none":0,"joinroom":1,"createsuboffer":2};
function randomString(){
    var charSet="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var maxPos = charSet.length;
    var pwd='';
    for (let index = 0; index < maxPos; index++) {
        pwd +=charSet.charAt(Math.floor(Math.random()*maxPos));
        
    }
    return pwd;
}

module.exports={allEvent,syncSignal,eventSignal,randomString}
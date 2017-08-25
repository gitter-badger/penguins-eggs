network = require("network");

function dbCall(){
  network.get_gateway_ip(function(err, ip) {
    if (err){
      return false;
    } else{
      return ip;
    }
  });
}

new Promise(resolve,reject){
     let data = dbCall();
     if(data == false){
          reject(data);
     }else {
       resolve(data);
     }
   }

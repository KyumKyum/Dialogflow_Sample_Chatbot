var express = require('express');
var http = require('http');
var https = require('https');
const { get } = require('request');
var app = express();
var server = http.createServer(app);


server.listen(3000,'127.0.0.1',function(){
    console.log('Server listen on port ' + server.address().port);
    
    return getList()
    .then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error.message);
    })
});

function getList(){
    const url = "https://run.mocky.io/v3/5443fb50-b0bb-4a83-b2b0-afade1b4a108";

    return new Promise((resolve,reject) => {
      https.get(url,(res) => {
          var body = "";
          res.on("data",(chunk) => {
              body += chunk;
          });
          console.log("Received Data");

          res.on("end",() => {
              let data = "";
              let obj = JSON.parse(body);

              for(let i = 0; i < obj.length; i++){
                  let curObj = obj[i];
                  //console.log("\nDonut Type " + i + "\n Name: "+curObj.name + " ID: " + curObj.id);
                  data += "\n도넛 ID: " + curObj.id + "도넛의 이름: " + curObj.name;
              }

              resolve(data);
          }); 
      });
  });
}
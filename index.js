'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const https = require('https');

 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Hi! This is sample chatbot. (Donut Market)`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function listIntent(){
      return getList()
      .then(data => {
          agent.add(data);
      })
      .catch(() => {
          agent.add(`ERROR`);
      });
  }

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
                let data = "도넛 종류는 다음과 같습니다.";
                let obj = JSON.parse(body);

                for(let i = 0; i < obj.length; i++){
                    let curObj = obj[i];
                    //console.log("\nDonut Type " + i + "\n Name: "+curObj.name + " ID: " + curObj.id);
                    data += "\n도넛 ID: " + curObj.id + " 도넛의 이름: " + curObj.name;
                }

                resolve(data);
            }); 
        });
    });
}

function orderIntent(){
    return gerOrder()
    .then(value => {
        if(value == true){
            agent.add(`$sys_donut이(가) 주문되었습니다! :)`);
        }else{
            agent.add(`$sys_donut이라는 이름의 도넛이 존재하지 않습니다.`);
        }
    }).catch(() => {
        agent.add("Error");
    })
    
}


function gerOrder(){
    const url = "https://run.mocky.io/v3/5443fb50-b0bb-4a83-b2b0-afade1b4a108";
    const input = request.body.queryResult.parameters.sys_donut;

    return new Promise((resolve,reject) => {
        https.get(url,(res) => {
            let body = "";

            res.on("data",(chunk) => {
                body += chunk;
            });

            res.on("end",() => {
                let obj = JSON.parse(body);

                for(let i = 0; i < obj.length; i++){
                    if(obj[i].name == input){
                        let value = true;
                        resolve(value);
                        return;
                    }
                }
            });

            console.log("There is no such item");
            let value = false;
            resolve(value);
        });
    });
}



  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Get List Intent', listIntent);
  intentMap.set('Order Intent', orderIntent);
  
  agent.handleRequest(intentMap);
});
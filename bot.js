var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/turing .*$/;
      if(request.text){
        console.log("Asked to respond with text :" + request.text);
      }
      else{
        console.log("error with text");
      }
  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(request.text.substring(8));
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(text) {
  var botResponse, options, body, botReq;
  console.log("Current text is: " + text);
  if(/^help/.test(text)){
     botResponse = "current valid commands are: \n test - the bot passes the turing test. \n echo [text] - the turing bot says [text] \n halts [program p] [input i] - determines if p will halt with input i \n recurse [text] - prints a recursed version of [text]. \n random - gives you an integer between 0 and 99. \n help - displays this information.";
  }
  else if(/^test$/.test(text)){
     botResponse = "I am a human.";
  }
  else if(/^echo .*/.test(text)){
    botResponse = text.substring(5);
  }
  else if(/^recurse .*/.test(text)){
    var initial = text.substring(8);
    for(var i = 1; i < initial.length; i++){
      botResponse += initial.substring(0,initial.length - i);
    }
  }
  else if(/^halts .*/){
    if(Math.random()>.5){
      botResponse = "yes";
    }
    else{
      botResponse = "no";
    }
  }
  else if(/^random$/){
    botResponse = Math.floor(Math.random() * 100).toString();
  }
  else{
     botResponse = "Invalid command. Type /turing help for a list of valid commands.";
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;

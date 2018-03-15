//
var tmi = require('tmi.js');
var  fs = require('fs');
const WebSocket = require('ws');

const ws = new WebSocket('http://127.0.0.1:8001/botcc');
const channel = "jgi1l";
// const channel = "greekgodx";
// const channel = "sodapoppin";
// const channel = "loltyler1";
const delay = 350;
const slow = 1;

var options = {
    options: {
        // debug:'warn'
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "jgi1l",
        password: "oauth:flg0crvxol9dwgrjrwn8qw9jyuinx3"
    },
    channels: [channel]
};

var writeBots = [
    {
        username: 'pls_fk_me_daddy', 
        password: 'oauth:x6ggybxb3duyrmq9stahukkm0kicua'
    },
    {
        username: "jaygi1l",
        password: "oauth:mxp37h1wdb96m72cue577c55f4vt3m"
    },
    {
        username: 'reformed_nogg',
        password: 'oauth:484p3mbckmh10ehkm040okt54xtzzv'
    },
    {
        username: 'poor_people_are_gross',
        password: 'oauth:xw2i32iv4z1nqelne3xjjmxj7qfx9q',
    },
    {
        username: 'obama_isa_muslim',
        password: 'oauth:aj1ufoc4438urkm03rzgf8vvdriv8t'
    },
    {
        username: 'MINECRAFT__HERO',
        password: 'oauth:6p949ydz9f06g7jlxifrdbo4j0jpfh'
    },
    {
        username: 'I_PEED_ON_DONALD_TRUMP',
        password: 'oauth:g9zug4sw03p18g1lns6saiuc5gi314'
    },
    {
        username: 'creamy_peanut_butter',
        password: 'oauth:i5dr6sy45p8528wkntfkaah59edw78'
    },
    {
        username: 'TYLER1_UNBANNED',
        password: 'oauth:m4957tdfxms5a14fa0ok0xifh17ahd'
    },
    {
        username: 'IRL__',
        password: 'oauth:9b4vjn3zdu17ezl1sufjwirg210z42'
    },
    {
        username: 'gamerboy12348976x12',
        password: 'oauth:x71t1bqlhinyp1s9hq8w03qhggham3'
    },
    {
        username: 'TYLER1_NUMBER_1_FAN',
        password: 'oauth:9xqjs0u5no3kajipvu9isbfub0rms1'
    },
]


var write_clients = createWriteClients(writeBots);

var client = new tmi.client(options);
client.connect();

/*************************Event Listeners****************************************/


process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});

client.on('connected', function(address, port) {
    // client.say(channel, "monkaS");
    // sayHello(write_clients.length-1);
});

client.on('disconnected', function(reason){
    console.log(reason);
});

// client.on("join", function(channel, username, self){
//     // isBot(username)? ws.send(username+": Joined " + channel):-1;
//     if(isBot(username)){
//         ws.send(username+": Joined " + channel);
//     }
// });

client.on('reconnect', function(){
    ws.send('Reconncecting');
});

client.on("ping", function(){
    ws.send('ping');
});

client.on("slowmode", function(channel, enabled, length){
    slow = length;
    //client.action(channel, length.toString());
});

client.on("timeout", function(channel, username, reason, duration){
    if(isBot(username)){
        ws.send(username + ": has been timed out for " + duration);
    }
});

client.on("ban", function(channel, username, reason){
    if(isBot(username)){
        ws.send(username + ": has been banned for " + reason);
    }
});

client.on("chat", function(channel,userstate, message, self){
//     if(userstate['username'] == 'jgi1l'){
//         console.log("Sending");
//         speak(message, write_clients.length-1);
//     }
    console.log(message);
    console.log(userstate);
});

// client.on("message", function(channel, userstate, message, self){
//     if(self) return;
//
//     switch(userstate["message-type"]) {
//         case "action":
//             break;
//         case "chat":
//             if(userstate['username'] == 'jgi1l'){
//                 client.say(channel, message).then(function(data){
//                 }).catch(function(err){
//                     ws.send(err);
//                 });
//                 speak(message, write_clients.length-1);
//             }
//             if(isBot(userstate['username'])){
//                 ws.send(userstate['username'] + ": " + message);
//             }
//             break;
//         case "whisper":
//             client.whisper(userstate['username'], "Jesus told me to tell you that you are loved.");
//             break;
//         default:
//             break;
//     }
// });

ws.on('open', function open(){
    ws.send('Bot Connected');
});

ws.on('message', function incoming(data){
    var message = data.split("&");
    var command = message[0];
    var msg = message[1];
    var spamNum = message[2];
    
    if(command == 'spam'){
        spamWriter(spamNum,msg,write_clients.length-1);
        // spam(spamNum,msg);
    }
    if(command == 'say'){
        client.say(channel,msg);
        speak(msg,write_clients.length-1);
    }
});

/*************************Helper Functions*************************************
 * Needs to be put in own file
    * ***/


function spam(times, msg){

    double_msg = msg + " " + msg;

    if(times < 1){
        return;
    }

    setTimeout(function(){
        if(times%2){
            client.say(channel, msg);
        }
        else if(times%3){
            client.say(channel, double_msg);
        }
        spam(times-1,msg);
    },1000);
}

function speak(msg, writers){
    if(writers <= -1){
        return;
    }
    setTimeout(function(){
        //console.log(write_clients[writers].readyState());
        if(write_clients[writers].readyState() == 'OPEN'){
            write_clients[writers].say(channel, msg).then(function(data){
                console.log(data);
                var name = write_clients[writers].getUsername().toString();
                console.log("Sent");
                ws.send(name + ": " + msg);
            }).catch(function(err){
                ws.send(err);
            });
        }
        else{
            console.log(write_clients[writers].readyState());
        }
        speak(msg,writers-1);
    },delay);

}

function spamWriter(times, msg, writers){
    double_msg = msg + " " + msg;

    if(times < 1){
        return;
    }

    setTimeout(function(){
        if(times%2){
            speak(msg,writers);
        }
        else if(times%3){
            speak(double_msg,writers);
        }

        spamWriter(times-1, msg, writers);
    },2000);
}

function sayHello(writers){
    if(writers <= -1){
        return;
    }
    write_clients[writers].say(channel, 'monkaS');
    sayHello(writers-1);
}

function createWriteClients(writeBots){

    var write_clients = [];

    writeBots.forEach(function(bot){
        var opt = {
            options: {
                // debug:true
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: bot.username,
                password: bot.password
            },
            channels: [channel]
        };

        var write_client = new tmi.client(opt);
        write_client.connect();
        write_clients.push(write_client);
    });

    return write_clients;
}

function isBot(username){
    var returnValue = false;
    writeBots.forEach(function(bot){
        if(bot.username.toUpperCase() == username.toUpperCase()){
            returnValue = true;
        }
    });
    return returnValue;
}




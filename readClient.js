const tmi = require('tmi.js');
const  fs = require('fs');
const WebSocket = require('ws');
const ws = new WebSocket('http://127.0.0.1:8001/botcc');

function readClient(channel){
    this.channel = channel;
}

module.exports = readClient;

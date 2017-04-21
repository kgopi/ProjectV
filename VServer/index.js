'use strict';

// setup default env variables
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
var server = http.createServer(app);
const wss = new WebSocket.Server({ server: server,verifyClient: function(info, callback){
    /* Need to add auth logic */
    callback(true);
} });

app.use('/uploads',express.static('./uploads'));

// Gather configuration from env
var config = require('./config').configure(process.env);

// Configure AWSSDK
require('./config/aws').init();
require('./app/video-processor')(wss);

var port = Number(process.env.PORT || 7000);
server.listen(port, function listening() {
    console.log('Listening on %d', server.address().port);
});
'use strict';

// setup default env variables
const express = require('express');
var fs = require('fs');
var path = require('path');
const https = require('https');
const WebSocket = require('ws');

// Gather configuration from env
var config = require('./config').configure(process.env);
var privateKey = fs.readFileSync(path.join(__dirname, '/', config.sslCert.key)).toString();
var certificate = fs.readFileSync(path.join(__dirname,'/', config.sslCert.cert)).toString();

const app = express();
app.use('/uploads', express.static('./uploads'));

// Configure AWSSDK
require('./config/aws').init();

var server = https.createServer({key: privateKey, cert: certificate}, app).listen(config.listenPort, function listening() {
    console.log('Listening on %d', server.address().port);
});

const wss = new WebSocket.Server({ server: server,verifyClient: function(info, callback){
    /* Need to add auth logic */
    callback(true);
} });
require('./app/video-processor')(wss);
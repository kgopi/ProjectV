'use strict';

var fs = require('fs');
var uuid = require('node-uuid');
var AWS = require('aws-sdk');
var videoFileExtension = '.webm';
var S3 = require('./services/amazonS3');
var Config = require('./../config');
const url = require('url');

function writeOrAppendData(data, fileName, ws) {
    var filePath = './uploads/';
    console.log('pwd', process.cwd());
    if (!fs.existsSync(filePath + fileName + videoFileExtension)) {
        console.log('writing original file');
        ws.send(fileName);
        fs.writeFileSync(filePath + fileName + videoFileExtension, data);
    } else {
        console.log('appending File');
        fs.appendFileSync(filePath + fileName + videoFileExtension, data);
    }
}

function uploadToS3(fileName, callback){
    S3.uploadFile(Config.aws.buckets.videos, fileName, './uploads/' + fileName + '.webm', callback);
}

module.exports = function (wss) {
    wss.on('connection', function (ws, req) {
        const location = url.parse(ws.upgradeReq.url, true);
        var filePath = './uploads/';
        var fileName = uuid.v1();
        ws.on('message', function(content) {
            if(typeof content == "string") {
                content = JSON.parse(content);
                switch (content.command){
                    case "PUBLISH":
                        uploadToS3(content.token, function(res){
                            ws.send(JSON.stringify({
                                command: 'PUBLISH_SUCCESS',
                                token: content.token
                            }));
                            console.log("File uploaded", content.token);
                            fs.unlinkSync(filePath + fileName + videoFileExtension);
                        });
                        break;
                }
            }else if(content instanceof Buffer) {
                writeOrAppendData(content, fileName, ws);
            }
        });
        ws.send(fileName);
    });
};
'use strict';

var AWS    = require('aws-sdk'),
  concat   = require('concat-stream'),
  _        = require('lodash'),
  uuid     = require('node-uuid'),
  fs       = require('fs');

var s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

function createKey() {
  return uuid.v4().replace(/-/g, '');
}

function createKeyForFolders() {
  return uuid.v4().replace(/-/g, '');
}

function remove(bucket, key, callback) {
  var params = {
    Bucket: bucket,
    Key: key
  };
  s3.deleteObject(params, callback);
}

function removeObjects(bucket, keys, callback) {
  var objects = [];
  _.forEach(keys, function(key) {
    objects.push({Key: key});
  });
  var params = {
    Bucket: bucket,
    Delete: {
      Objects: objects
    }
  };
  s3.deleteObjects(params, callback);
}

function upload(bucket, key, file, filename, callback) {
  // here is where the filename and key get stored in the db
  var write = concat(function(data){
    var params = {
      Bucket: bucket,
      Key: key,
      Body: data
    };

    s3.putObject(params, function(err) {
      if (err) {
        return callback(err);
      }

      var info = {
        bucket: bucket,
        key: key,
        filename: filename
      };

      callback(null, info);
    });
  });

  file.pipe(write);
}

function uploadFileByData(bucket, key, data, callback){

  var params = {
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  };

  s3.putObject(params, callback);
}

// works for uploading attachment by storing them locally
function uploadFile(bucket, key, fileLocation, callback) {
  fs.readFile(fileLocation, function(err, data) {
    if (err) {
      return callback(err);
    }

    var params = {
      Bucket: bucket,
      Key: key + '.webm',
      Body: data
    };

    s3.putObject(params, callback);
  });
}

function download(bucket, key, callback) {
  var params = {
    Bucket: bucket,
    Key: key
  };

  s3.getObject(params, function(err, data) {
    if (err) {
      return callback(err);
    }

    return callback(null, data);
  });
}

function createFolder(bucket, key, callback) {

    var params = {
      Bucket: bucket,
      Key: key,
      Body: ""
    };

    s3.putObject(params, callback);

};

exports.createKey = createKey;
exports.upload = upload;
exports.uploadFileByData = uploadFileByData;
exports.uploadFile = uploadFile;
exports.remove = remove;
exports.removeObjects = removeObjects;
exports.download = download;
exports.createFolder = createFolder;
exports.createKeyForFolders = createKeyForFolders;


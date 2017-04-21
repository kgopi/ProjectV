'use strict';

var AWS = require('aws-sdk');
var config = require('./');

module.exports.init = function() {
  AWS.config.update({
    region: config.apiCredentials.aws.region
  });
};

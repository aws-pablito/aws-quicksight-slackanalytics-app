var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var config = require('../config.json');
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Get slack client ID from secret
  var secret;

  // Create a Secrets Manager client
  var client = new AWS.SecretsManager({
    region: config.aws_region
  });

  // In this sample we send the exceptions to the UI for the 'GetSecretValue' API.
  client.getSecretValue({SecretId: config.aws_secret_name}, function (err, data) {
    if (err) {
      res.render('error', {
        title: 'ERROR',
        message: 'Unable to retrieve Slack App Secrets.',
        error: {
          status: err.code,
          stack: err.stack
        }
      });
    } else {
      // Decrypts secret using the associated KMS CMK.
      // Depending on whether the secret is a string or binary, one of these fields will be populated.
      if ('SecretString' in data) {
        secret = data.SecretString;
      } else {
        let buff = new Buffer(data.SecretBinary, 'base64');
        secret = buff.toString('ascii');
      }

      const secrets = JSON.parse(secret);
      res.render('index', {
        title: config.title,
        client_id: secrets.client_id
      });
    }
  });

});

module.exports = router;

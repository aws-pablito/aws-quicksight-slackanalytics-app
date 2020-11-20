var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var AWS = require('aws-sdk');
var request = require('request');
var config = require('../config.json')

/* OAuth workload */
router.get('/', function(req, res, next) {

  var random_string = crypto.randomBytes(5).toString('base64').slice(0,5);

  if (req.query.code) {
    /**
     *  1. AFTER USER ACCEPTS INSTALLATION, GET SLACK AUTHENTICATION CODE FROM SLACK REQUEST PARAMETERS
     */
    var slackCode = req.query.code;

    /**
     * 2. GET SLACK APP ACCESS KEYS FROM AWS SECRETS MANAGER
     *
     * If you need more information about configurations or implementing the sample code, visit the AWS docs:
     * https://aws.amazon.com/developers/getting-started/nodejs/
     */
    var secret;

    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
      region: config.aws_region
    });

    // In this sample we send the exceptions to the UI for the 'GetSecretValue' API.
    client.getSecretValue({SecretId: config.aws_secret_name}, function(err, data) {
      if (err) {
        res.render('error', { title: 'ERROR',
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

        /**
         * 3. REQUEST TOKEN FROM SLACK API
         */
        const secrets = JSON.parse(secret);
        const auth = 'Basic ' + Buffer.from(secrets.client_id + ':' + secrets.client_secret).toString('base64');

        request({
          url:'https://slack.com/api/oauth.v2.access?',
          qs: {code: slackCode},
          headers:{
            'Authorization': auth}}, function (error, response, body) {
          if (error) {
            res.render('error', { title: 'ERROR',
              message: 'Unable to authenticate with Slack.',
              error: {
                status: error.code,
                stack: error.stack
              }
            });
          } else if(response && body) {
            console.log("Slack status: " + response.statusCode);
            const bodyJSON = JSON.parse(body);

            if(bodyJSON.authed_user){ //Save token info on AWS secrets manager upon success
              /**
               * 4. STORE BEARER TOKEN IN NEW AWS SECRET
               */
              var tokenSecretName= "slack_analytics_token_" + random_string;
              var params = {
                SecretString: JSON.stringify(bodyJSON.authed_user),
                Description: "SlackAnalytics App authentication token",
                Name:  tokenSecretName,
              }
              client.createSecret(params, function(err, data) {
                if(err){
                  res.render('error', { title: 'ERROR',
                    message: 'Unable to create new AWS Secret.',
                    error: {
                      status: err.code,
                      stack: err.stack
                    }
                  });
                }else {
                  //Share secrets info for deploying athena federated query lambda function.
                  launch_template_url= 'https://us-east-1.console.aws.amazon.com/cloudformation/home?' +
                                'region=us-east-1#/stacks/create/review?&' +
                                'templateURL=https://s3.us-east-1.amazonaws.com/quicksight.slackanalytics.afqconnector/' +
                                'sample_slack_athena_connector.yaml&stackName=slackanalytics-afq-connector-' + random_string +
                                '&param_AthenaCatalogName=slackanalytics&param_AWSSecretName=' + data.Name
                  res.render('auth', {
                    'secret_info': data,
                    'title': config.title,
                    'launch_template_url': launch_template_url
                  });
                }
              });
            } else {
              console.log(body);
              res.render('error', { title: 'ERROR',
                message: 'Unable to retrieve Slack token.',
                error: {
                  status: 'Invalid Response',
                  stack: body
                }
              });
            }
          }
        })
      }
    });
  } else {
    res.render('error', { title: 'ERROR',
      message: 'Invalid Authentication Request',
      error: {
        status: req.query.code,
        stack: 'Slack response has none or invalid code parameter'
      }
    });
  }
});

module.exports = router;

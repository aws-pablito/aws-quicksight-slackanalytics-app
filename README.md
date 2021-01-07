# aws-quicksight-slackanalytics-app

This repo contains two main components: 
- A custom Athena Federated Query (AFQ) connector to query data from the Slack Member Analytics REST API endpoint using SQL, and 
- A sample web application to perform OAuth with the Slack Web API and securely store the bearer token in an AWS Secrets Manager secret. 

Supporting AWS CloudFormation templates are available to deploy each of these components. 

Note: The sample web application is only required during the OAuth workflow. For cost control recommend terminating your AWS CloudFormation 
Stack once the Slack App is authorized with your Slack Enterprise Grid.  If you redeploy the template you will need to update your redirect endpoint from Slack.com. In future releases we plan to make this workflow serverless. 

## Content
Here are the contents of this repository:

- [/athena-slack-member-analytics](athena-slack-member-analytics/) - Source code for the AWS Athena Federated Query Connector.
- [/sam-slackanalyticsapi-simulator](sam-slackanalyticsapi-simulator/) - An AWS SAM app to simulate the Slack Member Analytics API using AWS API Gateway and AWS Lambda.
- [/cloudformation](cloudformation)
    - [sample_slack_app_template.yaml](cloudformation/sample_slack_app_template.yaml) - Sample AWS CloudFormation template for deploying the custom web application on EC2. 
    - [sample_slack_athena_connector.yaml](cloudformation/sample_slack_athena_connector.yaml) - Sample AWS CloudFormation template for deploying the Slack Member Analytics AFQ Connector.
- [/webapp](webapp/) - The source code for the Node.js application.
- [/images](images/) - Supporting images for this documentation (README.md).

## Deploy the Slack Web Application and AFQ Connector

1. Register a new and custom Slack App following [these instructions](https://api.slack.com/scopes/admin.analytics:read)

Note: In the OAuth and Permissions section, you'll need to specify a redirect URL. Use a placeholder such as "https://not-a-real-domain.com/" to save and obtain the credentials. You will update this redirect URL at a later step. 

2. Create an AWS Secrets Manager secret named "slackanalytics_app_secret" and store your Slack app's client secrets under the  "client_id" and "client_secret" keys. 

![Alt text](/images/secret_preauth.png?raw=true "Secrets Manager Screenshot")

3. Deploy the sample Slack Web App in your AWS account using this AWS CloudFormation template.   

    - From the AWS Console:  [Template](https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?&templateURL=https://s3.us-east-1.amazonaws.com/quicksight.slackanalytics.afqconnector/sample_slack_app_template.yaml&stackName=qs-slackanalytics-web-app)
    
    - From terminal (replace all elements within "< >":

```
    aws cloudformation create-stack \
        --stack-name <choose_a_unique_name> \
        --template-body file://cloudformation/sample_slack_app_template.yaml \
        --parameters ParameterKey=AppVPC,ParameterValue=<your_vpc_id>\
            ParameterKey=AppSubnets,ParameterValue="<your_subnet_1>\\,<your_subnet_2>" \
            ParameterKey=InstanceKeyPair,ParameterValue=<your_ssh_key_pair> \
        --capabilities CAPABILITY_IAM
```

Note: current template is supported for the us-east-1 region only and requires a subnet with public internet access to download source from git repo.  You can customize the /cloudformation/sample_slack_app_template.yaml file if you need to deploy with a different configuration. 
        
4. Follow the instructions described in the web app UI to update your redirect URL, authenticate and install the custom AFQ function in your AWS account. 

![Alt text](/images/webapp_landing.png?raw=true "WebApp UI Screenshot")

Note: After authentication your AWS Secrets Manager secret should contain new key:value pairs with your authentication info.

![Alt text](/images/secret_postauth.png?raw=true "Secrets Manager Screenshot Post Auth")

5. Use the AWS Cloudformation link from the Successfull Authentication UI to deploy your custom AFQ connector in your account. 

![Alt text](/images/landing_success.png?raw=true "WebApp UI Screenshot Post Auth")

6. Register your new AWS Lambda function as an [Athena Data Source](https://docs.aws.amazon.com/athena/latest/ug/connect-to-a-data-source-lambda.html).

7. Query the Slack Member Analytics using Amazon Athena or QuickSight Connector to Athena. 

## About Athena Federated Query (AFQ)

To learn more about AFQ check out the workshop [here](https://athena-in-action.workshop.aws/60-connector/601-connector-code.html).

## Version
- 2020.12.0 - First release
- 2021.12.1 - Updates to use a single secret.

## License

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
[SPDX-License-Identifier: MIT-0](LICENSE)
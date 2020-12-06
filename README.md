# aws-quicksight-slackanalytics

This is a sample web application to perform OAuth with the Slack Web API and store the bearer token in 
an AWS Secrets Manager secret. 

This application is only required during the OAuth workflow. For cost control recommend terminating your AWS CloudFormation 
deployment once the Slack App is authorized with your Slack Enterprise Grid.  

Note: If you redeploy the template you will need to update your redirect endpoint from Slack.com

In future releases we plan to make this workflow serverless. 

## Deploy the Slack Application

1. Create a custom Slack App following [these instructions](https://api.slack.com/scopes/admin.conversations:write)

Note: In the OAuth and Permissions section, for redirect URL use a placeholder such as "https://not-a-real-domain.com/". 
The scope for the app should be `admin.analytics:read`.

2. Create an AWS Secrets Manager secret named "slackanalytics_app_secret" and store your Slack app's client secrets under the  "client_id" and "client_secret" keys. 

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

Note: current template is supported for the us-east-1 region only
        
4. Follow the instructions in the app to update your redirect URL and install the Athena Federated Query Connector in your AWS account. 

5. Query the Slack Member Analytics using Amazon Athena or QuickSight Connector to Athena. 

## Athena Federated Queries (AFQ)
To learn more check out AFQ in action [here](https://athena-in-action.workshop.aws/60-connector/601-connector-code.html).
# aws-quicksight-slackanalytics

This is a sample node.js express web application to perform OAuth with the Slack Web API and store the bearer token in 
an AWS Secrets manager secret. 

This application only need to run during the OAuth workflow (First authentication or during a schedule key rotation). 
For cost optimization consider terminating your cloudformation deployment once the app is authorized. 

In future releases we plan to make this workflow serverless. 

## Deploy the Slack Application

1. Create a custom Slack App following [these instructions](https://api.slack.com/scopes/admin.conversations:write)

Note: In the OAuth and Permissions section, for redirect URL use a placeholder such as "https://not-a-real-domain.com/".

2. Deploy the sample Slack Web App in your AWS account using these AWS CloudFormation template. 
Currently, the template is supported for the us-east-1 region only.  

    - Using AWS Console:  [Template](https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?&templateURL=https://s3.us-east-1.amazonaws.com/quicksight.slackanalytics.afqconnector/sample_slack_app_template.yaml&stackName=slackanalytics_web_app)
    
    - Using AWS CLI (replace all elements within "< >":
    
```
    aws cloudformation create-stack \
        --stack-name <choose_a_unique_name> \
        --template-body file://cloudformation/sample_slack_app_template.yaml \
        --parameters ParameterKey=AppVPC,ParameterValue=<your_vpc_id>\
            ParameterKey=AppSubnets,ParameterValue="<your_subnet_1>\\,<your_subnet_2>" \
            ParameterKey=InstanceKeyPair,ParameterValue=<your_ssh_key_pair> \
        --capabilities CAPABILITY_IAM
```
        
3. Follow the instructions in the app to update your redirect URL and install the Athena Federated Query Connector in your AWS account. 

4. Query the Slack Member Analytics using Amazon Athena or QuickSight Connector to Athena. 

## Athena Federated Queries (AFQ)
To learn more check out the AFQ in action [here](https://athena-in-action.workshop.aws/60-connector/601-connector-code.html).
# aws-quicksight-slackanalytics

## 1. Deploy the Slack Application

1. Create a custom Slack App following [these instructions](https://api.slack.com/scopes/admin.conversations:write)

Note: For redirect URL use a dummy placeholder with https.

2. Run your sample Slack App Web Application in your AWS account using these cloudformation template. 

    - Using AWS Console
    
    - Using AWS CLI (replace all elements within "< >":
    

    aws cloudformation create-stack \
        --stack-name <choose_a_unique_name> \
        --template-body file://cloudformation/sample_slack_app_template.yaml \
        --parameters ParameterKey=AppVPC,ParameterValue=<your_vpc_id>\
            ParameterKey=AppSubnets,ParameterValue="<your_subnet_1>\\,<your_subnet_2>" \
            ParameterKey=InstanceKeyPair,ParameterValue=<your_ssh_key_pair> \
        --capabilities CAPABILITY_IAM
  
        
3. Follow the instructions in the app to update your redirect URL and install the Athena Federated Query Connector in your AWS account. 

4. Query the Slack Analytics Member Analytics using Amazon Athena or QuickSight Connector to Athena. 
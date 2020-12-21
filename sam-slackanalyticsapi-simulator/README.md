## sam-slackanalytics-simulator

This is a simple severless application that leverages AWS API Gateway and AWS Lambda to simulate responses from the Slack Member Analytics REST API. Use this application for build and test purposes. The application 
is build using the [AWS SAM CLI](https://aws.amazon.com/serverless/sam/). 

Recommend checking the ["Hello World" Tutorial](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html)
for a detailed walk-through of the process.

## Deployment Instructions:

1. From the athena-slack-member-analytics/sam-slackanalytics-simulator dir, run  `sam build`
2. From the athena-slack-member-analytics/sam-slackanalytics-simulator dir, run Deploy your application `sam deploy --guided` and follow the prompts.
3. Test your endpoint.

```
curl -H "Accept-Encoding:gzip" -X GET "https://<your_api_gateway_endpoint>/Prod/api/admin.analytics.getFile?date=2020-11-09" >> sample.gzip
```

## License

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
[SPDX-License-Identifier: MIT-0](../LICENSE)
#!/bin/bash

 # #%L
 # athena-slack-member-analytics
 # %%
 # Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 # %%
 # Permission is hereby granted, free of charge, to any person obtaining a copy of this
 # software and associated documentation files (the "Software"), to deal in the Software
 # without restriction, including without limitation the rights to use, copy, modify,
 # merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 # permit persons to whom the Software is furnished to do so.
 # %%
 # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 # INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 # PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 # HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 # OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 # SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 # #L%

cat << EOF
# Run this script from the directory of the module (e.g. athena-example) that you wish to publish.
# This script performs the following actions:
# 1. Builds the maven project
# 2. Creates a Serverless Application Package using the athena-slack-api.yaml
# 3. Produces a final packaged.yaml which can be used to publish the application to your
#     private Serverless Application Repository or deployed via Cloudformation.
# 4. Uploads the packaged connector code to the S3 bucket you specified.
# 5. Uses sar_bucket_policy.json to grant Serverless Application Repository access to our connector code in s3.
# 6. Published the connector to you private Serverless Application Repository where you can 1-click deploy it.
EOF

while true; do
    read -p "Do you wish to proceed? (yes or no) " yn
    case $yn in
        [Yy]* ) echo "Proceeding..."; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

if [ "$#" -lt 2 ]; then
    echo "\n\nERROR: Script requires 3 arguments \n"
    echo "\n1. S3_BUCKET used for publishing artifacts to Lambda/Serverless App Repo.\n"
    echo "\n2. The connector module to publish (e.g. athena-slack-api or athena-cloudwatch) \n"
    echo "\n3. The AS REGION to target (e.g. us-east-1 or us-east-2) \n"
    echo "\n\n USAGE from the module's directory: ./publish.sh my_s3_bucket athena-slack-api test-endpoint-url \n"
    exit;
fi

if test -f "$2".yaml; then
    echo "SAR yaml found. We appear to be in the right directory."
else
  echo "SAR yaml not found, attempting to switch to module directory."
  cd $2
fi

REGION=$3
if [ -z "$REGION" ]
then
      REGION="us-east-1"
fi

echo "Using AWS Region $REGION"


if ! aws s3api get-bucket-policy --bucket $1 --region $REGION| grep 'Statement' ; then
    echo "No bucket policy is set on $1 , would you like to add a Serverless Application Repository Bucket Policy?"
    while true; do
        read -p "Do you wish to proceed? (yes or no) " yn
        case $yn in
            [Yy]* ) echo "Proceeding..."
                cat > sar_bucket_policy.json <<- EOM
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service":  "serverlessrepo.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$1/*"
    }
  ]
}
EOM
                cat sar_bucket_policy.json
                set -e
                aws s3api put-bucket-policy --bucket $1 --region $REGION --policy  file://sar_bucket_policy.json
                rm sar_bucket_policy.json
                break;;
            [Nn]* ) echo "Skipping bucket policy, not that this may result in failed attempts to publish to Serverless Application Repository"; break;;
            * ) echo "Please answer yes or no.";;
        esac
    done
fi



set -e
mvn clean install -Dpublishing=true

sam package --template-file $2.yaml --output-template-file packaged.yaml --s3-bucket $1 --region $REGION
sam publish --template packaged.yaml --region $REGION
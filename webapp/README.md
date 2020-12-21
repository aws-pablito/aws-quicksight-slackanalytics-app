# webapp

Node.js Express Web App for authentication with Slack OAuth2.0 and deployment of custom Slack app in Slack Enterprise Grid. 

## Deployment instructions on Amazon EC2

This steps assumes that you have already launched a Linux instance with a 
public DNS name that is reachable from the Internet and to which you are 
able to connect using SSH. 

AWS does not control the following code. Before you run it, be sure to 
verify its authenticity and integrity. 

&nbsp;1. Install NVM:
```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
&nbsp;2. Install node.js:
```
    nvm install node
    node -e "console.log('Running Node.js ' + process.version)"
```
&nbsp;3. Install git:
```$xslt
    sudo yum update -y
    sudo yum install git -y
    git version
```
&nbsp;4. Download code and dependencies:
```
    cd /home/ec2-user/
    git clone https://github.com/aws-pablito/aws-quicksight-slackanalytics.git
    cd aws-quicksight-slackanalytics/webapp
    npm install
```
&nbsp;5. Install pm2 and run the app.
```
    npm install pm2 -g
    pm2 --name qs-slackanalytics-app start npm -- start
```
## License
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
[SPDX-License-Identifier: MIT-0](../LICENSE)
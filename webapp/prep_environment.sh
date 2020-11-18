# deploy app in AWS EC2 environment:

# download nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
# validate node is installed
node -e "console.log('Running Node.js ' + process.version)"

#Perform a quick update on your instance:
sudo yum update -y

#Install git in your EC2 instance
sudo yum install git -y

#Check git version
git version

git clone https://github.com/pabloredo/aws-quicksight-slackanalytics-app.git

cd ~/aws-quicksight-slackanalytics-app

npm install pm2 -g

pm2 --name qs-slackanalytics-app start npm -- start
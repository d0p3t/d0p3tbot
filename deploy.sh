# Script for deploy updates
git clean -f -d
git pull origin master
npm install
systemctl restart myapp

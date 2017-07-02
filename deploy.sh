#!/bin/bash
git clean -f -d
rm app.js
git pull origin master
npm install
systemctl start d0p3tbot

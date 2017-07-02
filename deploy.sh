#!/bin/bash
git clean -f -d
rm app.js
git pull
npm install
chmod +x app.js
systemctl start d0p3tbot

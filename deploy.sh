#!/bin/bash
git clean -f -d
git pull origin master
npm install
systemctl start d0p3tbot

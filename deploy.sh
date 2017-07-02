#!/bin/bash
git clean -f -d
git pull origin master
npm install
systemctl restart d0p3tbot

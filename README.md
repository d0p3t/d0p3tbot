# d0p3tbot for Twitch 
[![Current Version](https://img.shields.io/badge/version-0.0.1-green.svg)](https://github.com/d0p3t/d0p3tbot) [![Build Status](https://travis-ci.org/d0p3t/d0p3tbot.svg?branch=master)](https://travis-ci.org/d0p3t/d0p3tbot)

This is a multifunctional chat bot for TwitchTV using NodeJS. Features simple commands, subscription/resubscription announcements, notices etc.

![Chat Preview](http://i.imgur.com/suOPO9z.png)

## Demo
A working demo can be found running on the authors Twitch channel at https://twitch.tv/d0p3t

---

## Features
* Simple commands with bot reply
* Automatic chat message on subscription/resubscription
* Subscriber count command
* Followage command
* Uptime command
* Notices every X messages

---

## Setup
Clone this repo and run `npm install` to install all the dependencies.

Next, copy `config_sample.js` renaming it to `config.js` and edit it according to instructions found inside.

---

## Usage
After cloning the repository and installing all dependencies and creating a config file you can run the application with `npm start`. The bot will join the configured Twitch channel and listen for events/messages.

Available commands include: *!uptime, !followage, !subcount, !social, !twitter, !discord

---

## Upcoming Features
* Frontend (to add commands,notices etc. Requires rewrite)
* AI chat (conversational bot)
* Create own API for !subcount !followage !uptime to reduce `beta.decapi.me` dependancy

---

## License
>You can check out the full license [here](https://github.com/d0p3t/d0p3tbot/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.

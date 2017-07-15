<div align="center">

# d0p3tbot

<img src="http://i.imgur.com/suOPO9z.png" width="662px" height="200px">

##### A lightweight chat bot for Twitch and Discord using NodeJS.

![Version](https://img.shields.io/badge/version-0.0.1-green.svg) [![Build Status](https://travis-ci.org/d0p3t/d0p3tbot.svg?branch=master)](https://travis-ci.org/d0p3t/d0p3tbot) [![Discord](https://img.shields.io/discord/330910293934997504.svg)](https://discord.gg/bSd4cYJ) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

### A lot of the current features are specifically designed for the [demo environment](#demo) and are currently **in development**!
### This bot work on Windows, OSX and Linux as long as you have NodeJS and NPM installed.

</div>

## Demo
A working demo can be found running on [Twitch](https://twitch.tv/d0p3t) and on [Discord](https://discord.gg/bSd4cYJ)

- Type `!commands` to get a list of the available chat commands on Twitch

---

## Features
* Simple commands with bot reply
* Automatic chat message on subscription/resubscription
* Subscriber count command
* Followage command
* Uptime command
* Notices every X messages
* Discord: Live announcements. [example](http://i.imgur.com/squmt3C.png)

---

## Setup
You must have `nodejs` and `npm` installed.

Clone this repo and run `npm install` to install all the dependencies.

Next, copy and rename `config_sample.js` to `config.js` and edit it according to instructions found inside.

---

## Usage
After cloning the repository and installing all dependencies and creating a config file you can run the application with `npm start`. The bot will join the configured Twitch channel and listen for events/messages.

Available commands include: *!uptime, !followage, !subcount, !social, !twitter, !discord*

---

## Upcoming Features
* Frontend ***In Progress***
* AI chat (conversational bot)
* Create own API for !subcount !followage !uptime to reduce `beta.decapi.me` dependancy
* Commands for Discord

---

## License
>You can check out the full license [here](https://github.com/d0p3t/d0p3tbot/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.

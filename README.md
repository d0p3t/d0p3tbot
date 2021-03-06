<div align="center">

# d0p3tbot (v0.0.2-alpha)

<img src="http://i.imgur.com/gZkK7Yu.png" width="200px" height="200px">

##### A lightweight chat bot for Twitch and Discord using NodeJS.

![Version](https://img.shields.io/badge/version-0.0.2-green.svg) [![Build Status](https://travis-ci.org/d0p3t/d0p3tbot.svg?branch=master)](https://travis-ci.org/d0p3t/d0p3tbot) [![Discord](https://img.shields.io/discord/330910293934997504.svg)](https://discord.gg/bSd4cYJ) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

### A lot of the current features are specifically designed for the [demo environment](#demo) and are currently **in development**!
### This bot works on Windows, OSX and Linux as long as you have NodeJS, NPM and MongoDB installed.

</div>

## Demo
A working demo can be found running on [Twitch](https://twitch.tv/d0p3t) and on [Discord](https://discord.gg/bSd4cYJ). Keep in mind that the demo does not run the latest version and access to the demo frontend is not allowed (yet).

- Type `!commands` to get a list of the available chat commands on Twitch

---

## Features
* Twitch: Basic commands (i.e. !uptime, !subcount, !commands, !so)
* Twitch: Custom commands
* Twitch: Automatic chat alerts on subscription/resubscription
* Twitch: Notices every X messages
* Twitch: Whitelist URLs and Blacklist words
* Twitch: Permit a user to post links for 60 seconds
* Discord: Live announcements. [example](http://i.imgur.com/squmt3C.png)
* Persistent Database using mongoDB data storage
* Frontend dashboard and control panel
---

## Setup
You must have `nodejs` and `npm` installed as well as a running instance of `mongodb`.

Clone this repo and run `npm install` to install all the dependencies.

Next, copy and rename `config_sample.js` to `config.js` and edit it according to instructions found inside.

---

## Usage
After cloning the repository, installing all dependencies and creating a config file you can run the application with `gulp serve`. The bot will join the configured Twitch/Discord channel and listen for events/messages.

Available basic commands include: *!uptime, !followage, !subcount, !so, !permit*

Frontend: Go to `http://localhost:3000` and login with `username` equal to your Twitch name and `password` as `defaultpassword`. You can then add commands, notices, blacklist words, whitelist URLs etc.

---

## Upcoming Features
* Frontend ***In Progress***
* Multi-user support
* Security Improvements
* AI chat (conversational bot)
* Create own API for !subcount !followage !uptime to reduce `beta.decapi.me` dependancy
* Commands for Discord
* And lots more...

Implementation of these features is streamed live every Saturday & Sunday at [twitch.tv/d0p3t](https://twitch.tv/d0p3t)

---

## Special Thanks
I'd like to give a special thanks to the following Github users who's projects made this bot possible.
* [tmi.js](https://github.com/tmijs/tmi.js) @Schmoopiie & @AlcaDesign
* [discord.js](https://github.com/hydrabolt/discord.js) @hydrabolt

---

## License
>You can check out the full license [here](https://github.com/d0p3t/d0p3tbot/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.

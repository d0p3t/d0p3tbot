const logger = require('../utils/logger');
const config = require('../config/config.js');
const tmi = require('tmi.js');
const request = require('request');
const Command = require('../models/command');
const Notice = require('../models/notice');
const User = require('../models/user');

// TMI.js
const client = new tmi.client(config.tmi);
client.connect();

var twitch = function() {
    // -------------------------------
    // Variables that can be changed
    // -------------------------------
    // Add commands here. CustomAPI not supported here
    var commands = {};
    var notices = {};

    setInterval(function(){
      Command.find({}, function(err, cmds) {
        if(err)
          logger.error('[Database] Error retrieving commands | ' + err);
        for (var i in cmds)
          commands[i] = cmds[i];
      });

      Notice.find({}, function(err, nots) {
        if(err)
          logger.error('[Database] Error retrieving notices | ' + err);
        for (var i in nots)
          notices[i] = nots[i];
      });
    }, 20000);

    var msgcount = 1;
    var noticenum = 25;
    // End of editable variables

    var cooldown = function (thisArg, fn, timeout) {
        var onCooldown = false;
        return function (/* args */) {
            if (!onCooldown) {
                fn.apply(thisArg, arguments);
                onCooldown = true;
                setTimeout(function () {
                    onCooldown = false;
                }, timeout);
            }
        }
    }
    var ClientSay = cooldown(client, client.action, 5000);
    client.on("connected", function (address, port) {
        logger.info('[Twitch] Successfully connected to channel ' + config.tmi.channels);
        Command.find({}, function(err, cmds) {
          if(err)
            logger.error('[Database] Error retrieving commands | ' + err);
          for (var i in cmds)
            commands[i] = cmds[i];
        });
        Notice.find({}, function(err, nots) {
          if(err)
            logger.error('[Database] Error retrieving notices | ' + err);
          for (var i in nots)
            notices[i] = nots[i];
        });
        User.findOne({ username: config.defaults.username, admin: true}, function(err, users) {
          if(err)
            logger.error('[Database] Error retrieving users | ' + err);
          if(!users) {
            logger.info('[Database] No Admin user found, creating Admin user');
            var newUser = new User({
              name: config.defaults.username,
              username: config.defaults.username,
              password: 'defaultpassword',
              admin: true,
              created_at: Date.now(),
              updated_at: Date.now()
            });
            newUser.save(function(err, done) {
              if(err)
                logger.error('[Database] Error saving a new Admin user | ' + err);
              else
                logger.info('[Database] Created new Admin user (password: defaultpassword)');
            });
          }
          else
            logger.info('[Database] Admin user already created');
        });
    });
    // -------------------------------
    // Methods for subscription/resub
    // -------------------------------
    client.on("subscription", function (channel, username, method, message, userstate) {
    	if (method.prime === true) {
    		logger.info('[Twitch] Prime Sub detected! Triggering chat message...');
    		client.action(channel, "PogChamp " + username + " just subscribed with Twitch Prime!!! (" + message + ")");
    	}
    	else {
    		logger.info('[Twitch] Normal Sub detected! Trigger chat message...');
    		client.action(channel, "PogChamp " + username + " just subscribed!!! (" + message + ")");
    	}

    });

    client.on("resub", function (channel, username, months, message, userstate, methods) {
    	if (methods.prime === true) {
    		logger.info('[Twitch] Prime Resub detected! Triggering chat message...');
    		client.action(channel, "PogChamp RESUB HYPE PogChamp " + username + " has just re-subscribed for " + months + " months using Twitch Prime!!! (" + message + ")");
    	}
    	else {
    		logger.info('[Twitch] Normal Resub detected! Triggering chat message...');
    		client.action(channel, "PogChamp RESUB HYPE PogChamp " + username + " has just re-subscribed for " + months + " months!!! (" + message + ")");
    	}
    });

    // ----------------------------------
    // Method for simple cmds and notices
    // ----------------------------------
    client.on("chat", function (channel, userstate, message, self) {
      if (self) return;

      if(msgcount === noticenum) {
        client.action(channel, notices[getRandomInt(0, objLength(notices) -1)].value);
        msgcount = 1;
      }
      else
        msgcount++;

      for(var i in commands) {
        if(message == commands[i].name)
          ClientSay(channel, commands[i].value);
      }
    });

    // ----------------------------------
    // Method for !commands, !subcount,
    // !followage, !uptime
    // -----------------------------------
    client.on("chat", function (channel, userstate, message, self) {
      if (self) return;
      if(message === "!commands") {
          var cmdsstring = "Commands: ";
          for (var i in commands) {
              cmdsstring = cmdsstring + commands[i].name + ", ";
          }
          ClientSay(channel, cmdsstring + " !commands.");
          cmdsstring = "";
      }
      else if(message === "!subcount") {
        client.api({
          url: "https://beta.decapi.me/twitch/subcount/d0p3t"
        }, function(err, res, body) {
            if(!err)
              ClientSay(channel, body + " subs");
        });
      }
      else if (message === "!followage") {
        client.api({
          url: "https://beta.decapi.me/twitch/followage/d0p3t/" + userstate.username
        }, function(err, res, body) {
            if(!err) // fix message when not following
              client.action(channel, userstate.username + " has been following for " + body);
        });
      }
      else if (message === "!uptime") {
        client.api({
          url: "https://decapi.me/twitch/uptime?channel=d0p3t"
        }, function(err, res, body) {
            if(!err)
              ClientSay(channel, body);
        });
      }
    });

    // HELPER FUNCTIONS
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function objLength(obj){
      var i=0;
      for (var x in obj){
        if(obj.hasOwnProperty(x)){
          i++;
        }
      }
      return i;
    }
}

module.exports = twitch;

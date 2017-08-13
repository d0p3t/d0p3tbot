const logger = require('../utils/logger');
const config = require('../config/config.js');
const tmi = require('tmi.js');
const request = require('request');
const Command = require('../models/command');
const Notice = require('../models/notice');
const User = require('../models/user');
const Alert = require('../models/alert');
const Variable = require('../models/variable');
const Link = require('../models/link');
const Word = require('../models/word');

const client = new tmi.client(config.tmi);
client.connect();

var twitch = function() {
    var msgcount = 1;
    var userIsPermitted = "";

    var commands = {};
    var notices = {};
    var alerts = {};
    var variables = {};
    var whitelist = {};
    var blacklist = {};

    setInterval(function(){
      logger.info("Refreshing commands, notices, alerts, links and other variables");
      Command.find({}).sort({ name: 'asc'}).exec(function(err, cmds) {
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
      Alert.find({}, function(err, alrts) {
        if(err)
          logger.error('[Database] Error retrieving alerts | ' + err);
        for (var i in alrts)
          alerts[i] = alrts[i];
      });
      Variable.find({}, function(err, vars) {
        if(err)
          logger.error('[Database] Error retrieving variables | ' + err);
        for (var i in vars)
          variables[i] = vars[i];
      });
      Link.find({}, function(err, lnks) {
        if(err)
          logger.error('[Database] Error retrieving variables | ' + err);
        for (var i in lnks)
          whitelist[i] = lnks[i];
      });
      Word.find({}, function(err, words) {
        if(err)
          logger.error('[Database] Error retrieving variables | ' + err);
        for (var i in words)
          blacklist[i] = words[i];
      });
    }, 30000);

    var cooldown = function (thisArg, fn, timeout) {
        var onCooldown = false;
        return function () {
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
            logger.error('[Database] Error retrieving users, please check your database configuration');
          if(!users) {
            logger.info('[General] Initializing First-time Setup...');
            logger.info('[General] Creating Administrator user...');
            var oauthToken = config.tmi.identity.password.slice(6);
            client.api({
              url: "https://api.twitch.tv/kraken/users?login=" + config.defaults.username,
              method: "GET",
              headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": config.tmi.options.clientId
              }
            }, function(err, res, body) {
              if(err)
                logger.error('[Twitch] Error retrieving user data, please check your Twitch configuration.');
              else {
                var newUser = new User({
                  name: body.users[0].display_name,
                  username: body.users[0].name,
                  password: 'defaultpassword',
                  admin: true,
                  meta: {
                    profile_picture: body.users[0].logo
                  },
                  created_at: Date.now(),
                  updated_at: Date.now()
                });
                newUser.save(function(err, done) {
                  if(err)
                    logger.error('[Database] Error saving new Admin user | ' + err);
                  else {
                    logger.info('[Database] Successfully created new Administrator (username: ' + config.defaults.username + ' | password: defaultpassword)');
                    logger.info('[General] You can now login via ' + config.defaults.server_ip + ':3000');
                  }
                });
              }
            });
          }
          else
            logger.debug('[Database] Admin user already created.');

          Alert.count(function(err, count) {
            if(!err && count === 0)
              populateAlerts();
            else
              logger.debug("[Database] Chat alerts already created.");
          });

          Variable.count(function(err, count) {
            if(!err && count === 0) {
              populateVariables();
            }
            else
              logger.debug("[Database] Variables already created.");
          });
        });
    });

    client.on("subscription", function (channel, username, method, message, userstate) {
    	if (method.prime === true) {
    		logger.debug('[Twitch] Prime Sub detected! Triggering chat message...');
    		client.action(channel, alerts[0].value);
    	}
    	else {
    		logger.debug('[Twitch] Normal Sub detected! Triggering chat message...');
    		client.action(channel, alerts[1].value);
    	}
    });

    client.on("resub", function (channel, username, months, message, userstate, methods) {
    	if (methods.prime === true) {
    		logger.debug('[Twitch] Prime Resub detected! Triggering chat message...');
    		client.action(channel, alerts[2].value);
    	}
    	else {
    		logger.debug('[Twitch] Normal Resub detected! Triggering chat message...');
    		client.action(channel, alerts[3].value);
    	}
    });

    client.on("chat", function (channel, userstate, message, self) {
      if (self) return;

      if((userstate.username === config.tmi.identity.username || userstate.mod) && message.includes("!permit")) {
        var isPermission = message.split(" ");
        userIsPermitted = isPermission['1'];
        client.action(channel, userIsPermitted + ", you may now post links for the next 60 seconds");
        logger.info(userIsPermitted + " enabled");
        setTimeout(function(){
          userIsPermitted = "";
          logger.info(userIsPermitted + " disabled");
        }, 60000);
      }
      var messageCheck = message.split(" ");
      var isWhitelisted = false;
      var isBlacklisted = false;
      for(var x in messageCheck) {
        if(/^(?:(ftp|http|https)?:\/\/)?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}$/gi.test(messageCheck[x])) {
          for(var link in whitelist) {
            var whitelistedLink = whitelist[link].value.replace(".", "\\.").replace("s", "[s5]").replace("i", "[i1l!]").replace("e", "[e3]").replace("b","[b8]").replace("o", "[o0]");
            var whitelistRegex = new RegExp("^(?:(ftp|http|https)?:\/\/)?(?:[\w-]+\.)*" + whitelistedLink + "", "gi");
            if(whitelistRegex.test(messageCheck[x]))
              isWhitelisted = true;
          }
          if(userIsPermitted !== userstate.username && userstate.mod === false && isWhitelisted === false)
            client.timeout(channel, userstate.username, 3, "You were timed out for linking");
        }
        else {
          for(var word in blacklist) {
            var blacklistedWord = blacklist[word].value.replace("s", "[s5]").replace("i", "[i1l!]").replace("e", "[e3]").replace("b","[b8]").replace("o", "[o0]");
            var blacklistRegex = new RegExp("" + blacklistedWord + "", "gi");
            if(blacklistRegex.test(messageCheck[x]))
              isBlacklisted = true;
          }
          if(userstate.mod === false && isBlacklisted === true)
            client.timeout(channel, userstate.username, 300, "You were timed out for a blacklisted word");
        }
      }

      if(msgcount === variables[0].value) {
        client.action(channel, notices[getRandomInt(0, objLength(notices) -1)].value);
        msgcount = 1;
      }
      else
        msgcount++;

      for(var i in commands) {
        if(message === commands[i].name && commands[i].category === 'custom')
          ClientSay(channel, commands[i].value);
        else if(message === commands[i].name && commands[i].category === 'basic') {
          triggerBasicCommand(commands[i].name, (cb) => {
            ClientSay(channel, cb);
          });
        }
      }

      if (message.includes("!so")) {
        var shoutout = message.split(" ");
        if(shoutout['0'] === "!so") {
          if(shoutout['1']) {
            client.api({
              url: "https://api.twitch.tv/kraken/users?login=" + shoutout['1'],
              method: 'GET',
              headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': config.tmi.options.clientId
              }
            }, function(err, res, body) {
              if(err)
                client.say(channel, "Oops something went wrong.");
              else {
                client.api({
                  url: "https://api.twitch.tv/kraken/channels/" + body.users[0]._id,
                  method: 'GET',
                  headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': config.tmi.options.clientId
                  }
                }, function(err, res, body) {
                  if(err)
                    client.say(channel, "Oops something went wrong.");
                  else
                    client.say(channel, "Go give " + body.display_name + " a follow! They were last seen playing " + body.game +"");
                });
              }
            });
          }
          else
            client.say(channel, "You didn't specify a channel! Ex. !so <username>");
        }
      }
    });

    // COMMAND FUNCTIONS
    function triggerBasicCommand(name, cb) {
      if(name === "!commands") {
          logger.info("Commands command triggered");
          var cmdsstring = "Commands: ";
          for (var i in commands) {
              cmdsstring = cmdsstring + commands[i].name + ", ";
          }
          cb(cmdsstring);
          //ClientSay(channel, cmdsstring + " !commands, !followage, !subcount, !so, !uptime.");
          cmdsstring = "";
      }
      else if(name === "!subcount") { // && commands[i].status === "enabled"
        client.api({
          url: "https://beta.decapi.me/twitch/subcount/" + config.defaults.username
        }, function(err, res, body) {
            if(!err)
              cb(body + " subs");
              //ClientSay(channel, body + " subs");
        });
      }
      else if (name === "!followage") {
        client.api({
          url: "https://beta.decapi.me/twitch/followage/" + config.defaults.username + "/" + userstate.username
        }, function(err, res, body) {
            if(!err)
              cb()
              client.action(channel, userstate.username + " has been following for " + body);
        });
      }
      else if (name === "!uptime") {
        client.api({
          url: "https://decapi.me/twitch/uptime?channel=" + config.defaults.username
        }, function(err, res, body) {
            if(!err)
              cb(body);
        });
      }
    }
    // DB FUNCTIONS
    function populateAlerts() {
      var subAlert = new Alert({
        name: "Subscription",
        value: "PogChamp \" + username + \" just subscribed!!! (\" + message + \")",
        created_at: Date.now(),
        updated_at: Date.now()
      });
      var subAlertP = new Alert({
        name: "Prime Subscription",
        value: "PogChamp \" + username + \" just subscribed with Twitch Prime!!! (\" + message + \")",
        created_at: Date.now(),
        updated_at: Date.now()
      });
      var resubAlert = new Alert({
        name: "Re-subscription",
        value: "PogChamp RESUB HYPE PogChamp \" + username + \" has just re-subscribed for \" + months + \" months!!! (\" + message + \")",
        created_at: Date.now(),
        updated_at: Date.now()
      });
      var resubAlertP = new Alert({
        name: "Prime Re-subscription",
        value: "PogChamp RESUB HYPE PogChamp \" + username + \" has just re-subscribed for \" + months + \" months using Twitch Prime!!! (\" + message + \")",
        created_at: Date.now(),
        updated_at: Date.now()
      });

      Alert.insertMany([subAlert,subAlertP,resubAlert,resubAlertP], function(err, done) {
        if(err)
          logger.error("[Database] Error inserting default Chat Alerts | " + err);
        logger.info("[Database] Successfully inserted default Chat Alerts");
      });
    };

    function populateVariables() {
      var msgCount = new Variable({
        name: "Message Count",
        value: "25",
        category: "notices",
        created_at: Date.now(),
        updated_at: Date.now()
      });

      var dsAnnounce = new Variable({
        name: "Announcement Channel",
        value: "330914789150949376",
        category: "discord",
        created_at: Date.now(),
        updated_at: Date.now()
      });
      Variable.insertMany([msgCount,dsAnnounce], function(err, done) {
        if(err)
          logger.error("[Database] Error inserting default Variables");
          logger.info("[Database] Successfully inserted default Variables");
      });
    }
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

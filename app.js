#!/usr/bin/env node
const logger = require('./utils/logger');
var express = require('express');
const tmi = require('tmi.js');
const Discord = require('discord.js');
const config = require('./config/config.js');

// Express
var app = express();
var routes = require('./routes');
logger.debug("Overriding 'Express' logger");

const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('combined',({ "stream": logger.stream })));

app.use('/', routes);

// TMI.js
const client = new tmi.client(config.tmi);
client.connect();

// DISCORD.js
const discordClient = new Discord.Client();

// -------------------------------
// Variables that can be changed
// -------------------------------
// Add commands here. CustomAPI not supported here
var commands = {
  "!social": "Twitter: https://twitter.com/d0p3t",
  "!twitter": "https://twitter.com/d0p3t",
  "!steam": "https://steamcommunity.com/id/d0p3t",
  "!discord": "Community Discord: https://discord.gg/bSd4cYJ"
};

var notices = [
  "Don't forget to follow to catch the next stream!",
  "I'm a bot created and maintained by d0p3t",
  "Follow me on Twitter https://twitter.com/d0p3t"
];

var msgcount = 1;
var noticenum = 25;

// END OF VARIABLES THAT CAN BE CHANGED

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
var ClientSay = cooldown(client, client.say, 5000);

// START of Twitch bot
// -------------------------------
// Methods for subscription/resub
// -------------------------------
client.on("subscription", function (channel, username, method, message, userstate) {
	if (method.prime === true) {
		logger.info('Prime Sub detected! Triggering chat message...');
		client.say(channel, "PogChamp " + username + " just subscribed with Twitch Prime!!! (" + message + ")");
	}
	else {
		logger.info('Normal Sub detected! Trigger chat message...');
		client.say(channel, "PogChamp " + username + " just subscribed!!! (" + message + ")");
	}

});

client.on("resub", function (channel, username, months, message, userstate, methods) {
	if (methods.prime === true) {
		logger.info('Prime Resub detected! Triggering chat message...');
		client.say(channel, "PogChamp RESUB HYPE PogChamp " + username + " has just re-subscribed for " + months + " months using Twitch Prime!!! (" + message + ")");
	}
	else {
		logger.info('Normal Resub detected! Triggering chat message...');
		client.say(channel, "PogChamp RESUB HYPE PogChamp " + username + " has just re-subscribed for " + months + " months!!! (" + message + ")");
	}
});

// ----------------------------------
// Method for simple cmds and notices
// ----------------------------------
client.on("chat", function (channel, userstate, message, self) {
  if (self) return;
  if(msgcount === noticenum) {
    client.say(channel, notices[getRandomInt(0, notices.length - 1)]);
    msgcount = 1;
  }
  else
    msgcount++;

  for (var i in commands) {
    if(message === i) {
      ClientSay(channel, commands[i]);
    }
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
          cmdsstring = cmdsstring + i + ", ";
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
        if(!err)
          client.say(channel, userstate.username + " has been following for " + body);
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
// END of Twitch bot

// START of Discord bot
discordClient.on('ready', function() {
    logger.info('Connect to Discord!');
});

setInterval(function(){
    client.api({
        url: 'https://api.twitch.tv/kraken/streams/d0p3t',
        method: 'GET',
        headers: {
            'Client-ID': config.tmi.options.clientId
        }
    }, function(err, res, body) {
        if(err) return;
        if(body.stream != null) {
            var embed = new Discord.RichEmbed()
                .setTitle("Live Announcement")
                .setAuthor("d0p3tbot", body.stream.channel.logo)
                .setColor(0x00AE86)
                .setDescription(body.stream.channel.status)
                .addField("Playing " + body.stream.channel.game)
            discordClient.user.setStatus("dnd");
            discordClient.user.setGame(body.stream.channel.game);
            //discordClient.user.send("#general", {embed});
        }

    });
}, 5000);

discordClient.login(config.discordtoken);
// END of Discord bot


// HELPER FUNCTIONS
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}






const port = process.env.PORT || 3000;

app.listen(port, function() {
  logger.info('Listening on port ' + port + '!');
});

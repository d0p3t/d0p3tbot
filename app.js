var winston = require('winston');
var tmi = require('tmi.js');
var config = require('./config/config.js');

var client = new tmi.client(config.tmi);
client.connect();

winston.configure({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'logs/logfile.log' })
  ]
});
if(config.debug)
  winston.level = 'debug';

// -------------------------------
// Variables that can be changed
// -------------------------------
// Add commands here. CustomAPI not supported here
var commands = {
  "!social": "Follow me on Twitter https://twitter.com/d0p3t",
  "!twitter": "Follow me on Twitter https://twitter.com/d0p3t",
  "!steam": "https://steamcommunity.com/id/d0p3t"
};

var notices = [
  "Don't forget to follow to catch the next stream!",
  "I'm a bot created and maintained by d0p3t"
];

var msgcount = 1;
var noticenum = 25;

// END OF VARIABLES THAT CAN BE CHANGED

// -------------------------------
// Methods for subscription/resub
// -------------------------------
client.on("subscription", function (channel, username, method, message, userstate) {
	if (method.prime === true) {
		winston.log('info','Prime Sub detected! Triggering chat message...');
		client.say(channel, "PogChamp " + username + " just subscribed with Twitch Prime!!! (" + message + ")");
	}
	else {
		winston.log('info','Normal Sub detected! Trigger chat message...');
		client.say(channel, "PogChamp " + username + " just subscribed!!! (" + message + ")");
	}

});

client.on("resub", function (channel, username, months, message, userstate, methods) {
	if (methods.prime === true) {
		winston.log('info', 'Prime Resub detected! Triggering chat message...');
		client.say(channel, "PogChamp RESUB HYPE PogChamp " + username + " has just re-subscribed for " + months + " months using Twitch Prime!!! (" + message + ")");
	}
	else {
		winston.log('info','Normal Resub detected! Triggering chat message...');
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
      winston.log('debug', 'Chat command triggered');
      client.say(channel, commands[i]);
    }
  }
});

// ----------------------------------
// Method for subcount and followage
// ----------------------------------
client.on("chat", function (channel, userstate, message, self) {
  if (self) return;
  if(message === "!subcount") {
    client.api({
      url: "https://beta.decapi.me/twitch/subcount/d0p3t"
    }, function(err, res, body) {
        if(!err)
          client.say(channel, body + " subs");
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
});




// HELPER FUNCTIONS
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

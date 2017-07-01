var tmi = require('tmi.js');
var config = require('./config/config.js');

var client = new tmi.client(config.tmi);
client.connect();

var commands = {
  "!twitter": "Follow me on Twitter https://twitter.com/d0p3t",
  "!steam": "https://steamcommunity.com/id/d0p3t"
};
// -------------------------------
// Methods for subscription/resub
// -------------------------------
client.on("subscription", function (channel, username, method, message, userstate) {
	if (method.prime === true) {
		console.log("Prime Sub");
		client.say(channel, "PogChamp " + username + " just subscribed with Twitch Prime!!! (" + message + ")");
	}
	else {
		console.log("Normal Sub");
		client.say(channel, "PogChamp " + username + " just subscribed!!! (" + message + ")");
	}

});

client.on("resub", function (channel, username, months, message, userstate, methods) {
	if (methods.prime === true) {
		console.log("Resub prime");
		client.say(channel, "PogChamp RESUB HYPE PogChamp " + username + " has just re-subscribed for " + months + " months using Twitch Prime!!! (" + message + ")");
	}
	else {
		console.log("Normal Sub");
		client.say(channel, "PogChamp RESUB HYPE PogChamp " + username + " has just re-subscribed for " + months + " months!!! (" + message + ")");
	}
});

client.on("chat", function (channel, userstate, message, self) {
  if (self) return;

  for (var i in commands) {
    if(message === i)
      client.say(channel, commands[i]);
  }

});

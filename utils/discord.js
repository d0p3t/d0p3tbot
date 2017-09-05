const logger = require('../utils/logger');
const config = require('../config/config.js');
const Discord = require('discord.js');
const tmi = require('tmi.js');

const Variable = require('../models/variable');
const Command = require('../models/command');

const client = new tmi.client(config.tmi);
client.connect();

const discordClient = new Discord.Client();

var discord = function() {
  var embed, data, arr, discordChannel;
  var dCommands = {};

  discordClient.on('ready', function() {
      logger.info('[Discord] Successfully connected to channel ' + config.defaults.username);
  });

  setInterval(function(){
    logger.debug('Updating Discord commands');
    Command.find({category: 'discord'}).sort({ name: 'asc'}).exec(function(err, cmds) {
      if(err)
        logger.error('[Database] Error retrieving discord commands | ' + err);
      for (var i in cmds)
        dCommands[i] = cmds[i];
    });
  }, 30000);

  discordClient.on('message', message => {
    // if the channel is the channel we want it in
    // check which command it is and reply
    if(message.channel.name === 'general') {
      for(var i in dCommands) {
        if(message.content === dCommands[i].name)
          message.reply(dCommands[i].value);
      }
    }
  });
  setInterval(function(){
      client.api({
          url: 'https://api.twitch.tv/kraken/streams/' + config.defaults.username,
          method: 'GET',
          headers: {
            'Client-ID': config.tmi.options.clientId
          }
      }, function(err, res, body) {
          if(err) return;
          if(body.stream !== null) {
            logger.info('[Discord] Stream is online. Checking for last announcement...');
            Variable.findOne({ name: "Discord Announcement Status", category: "discord"}, function(err, status) {
              if(!status) {
                logger.info('[Discord] Triggering new announcement...');
                Variable.findOne({name: "Announcement Channel", category: "discord"}, function(err, variable) {
                  if(err)
                    logger.info('[Database] Error finding announcement channel variable | ' + err);
                  else {
                    var embed = new Discord.RichEmbed()
                      .setAuthor("" + config.defaults.username + " just went LIVE on Twitch.TV!",body.stream.channel.logo)
                      .setTitle("Watch now! " + body.stream.channel.url)
                      .addField("Now Playing", body.stream.channel.game)
                      .setColor(0xFFA500)
                      .addField("Stream Title", body.stream.channel.status)
                      .setThumbnail(body.stream.preview.medium)
                      .addField("Followers", body.stream.channel.followers, true)
                      .addField("Total Views", body.stream.channel.views, true)
                      .setFooter("Stream went live on: " + body.stream.created_at)
                    var data = { status: "idle", afk: false, game: { name: body.stream.channel.game, url: body.stream.channel.url } }
                    discordClient.user.setPresence(data);
                    var arr = discordClient.channels;
                    var discordChannel = arr.find(o => o.id === variable.value);
                    discordChannel.send("Hey, @everyone " + config.defaults.username + " just went LIVE!");
                    discordChannel.send({embed});
                  }
                });
                Variable.findOneAndUpdate({name: "Discord Announcement Status", category: "discord"}, { value: true });
              }
            });
          }
          else {
            data = { status: "online", afk: false, game: { name: null } }
            discordClient.user.setPresence(data);
            Variable.findOneAndUpdate({name: "Discord Announcement Status", category: "discord"}, { value: false });
          }
      });
  }, 300000);

  discordClient.login(config.discord.token);
}

module.exports = discord;

const logger = require('../utils/logger');
const config = require('../config/config.js');
const Discord = require('discord.js');
const tmi = require('tmi.js');

const client = new tmi.client(config.tmi);
client.connect();

const discordClient = new Discord.Client();

var discord = function() {
  discordClient.on('ready', function() {
      logger.info('[Discord] Successfully connected to channel ' + config.defaults.username);
  });

  var discordStreamingChecks = 50; // checking every 5 minutes but sending card only every 5*50= 250 minutes
  var embed, data, arr, discordChannel;
  setInterval(function(){
      client.api({
          url: 'https://api.twitch.tv/kraken/streams/' + config.defaults.username,
          method: 'GET',
          headers: {
              'Client-ID': config.tmi.options.clientId
          }
      }, function(err, res, body) {
          if(err) return;
          if(body.stream != null) {
              logger.info('[Discord] Stream is online. Checking for last announcement...');
              if(discordStreamingChecks === 0) discordStreamingChecks = 50;
              if(discordStreamingChecks === 50) {
                logger.info('[Discord] Triggering new announcement...');
                var embed = new Discord.RichEmbed()
                    .setAuthor(config.defaults.username + " is LIVE on Twitch.TV!",body.stream.channel.logo)
                    .setTitle("Watch now! " + body.stream.channel.url)
                    .addField("Now Playing", body.stream.channel.game)
                    .setColor(0xFFA500)
                    .addField("Stream Title", body.stream.channel.status)
                    .setThumbnail(body.stream.preview.medium)
                    .addField("Followers", body.stream.channel.followers, true)
                    .addField("Total Views", body.stream.channel.views, true)
                    .addField("Current Viewers", body.stream.viewers, true)
                    .setFooter("Stream went live on: " + body.stream.created_at)
                var data = { status: "idle", afk: false, game: { name: body.stream.channel.game, url: body.stream.channel.url } }
                discordClient.user.setPresence(data);
                var arr = discordClient.channels;
                var discordChannel = arr.find(o => o.id === '330914789150949376'); // hack => only works for d0p3t's discord
                discordChannel.send({embed});
              }
              discordStreamingChecks--;
          }
          else {
            data = { status: "online", afk: false, game: { name: null } }
            discordClient.user.setPresence(data);
            discordStreamingChecks = 50;
          }
      });
  }, 300000);

  discordClient.login(config.discord.token);
}

module.exports = discord;

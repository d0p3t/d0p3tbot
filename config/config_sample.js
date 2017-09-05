
// --------------------------------------------------------------------------//
// --------------------------RENAME TO config.js!!!--------------------------//
//          To register a new twitch app and retrieve a clientId go to       //
//                https://www.twitch.tv/settings/connections                 //
// --------------------------------------------------------------------------//
//              To get a twitch oauth key for your identity go to            //
//                      https://twitchapps.com/tmi/                          //
//                (make sure you're logged in as your bot!)                  //
// --------------------------------------------------------------------------//
//                To setup a discord app and token go to                     //
//           https://discordapp.com/developers/applications/me               //
// --------------------------------------------------------------------------//
// --------------------------------------------------------------------------//

var config = {};

config.defaults = {
  server_ip: 'localhost',
  username: 'twitchusername'
};

config.tmi = {
  options: {
    clientId: 'myClientId',
    debug: false                   // keep tmi debug to false
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: 'botusername',
    password: 'oauth:bottoken'    // For example -> 'oauth:23457feg97345897fd98723f'
  },
  channels: ["#channel"]          // must have # sign (for example ["#summit1g"])
};

config.discord = {
  token: 'discordtoken'
};

config.db = {
  uri: '127.0.0.1:27017/d0p3tbotdb',
  options: {
    useMongoClient: true
  }
};
module.exports = config;

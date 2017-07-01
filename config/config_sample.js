
// --------------------------------------------------------------------------//
// -----------------------Enter your credentials here------------------------//
//          To register a new application and retrieve a clientId go to      //
// https://www.twitch.tv/settings/connections -> Register your application   //
// --------------------------------------------------------------------------//
//              To get an oauth key for your identity go to                  //
//                      https://twitchapps.com/tmi/                          //
// --------------------------------------------------------------------------//
// --------------------------------------------------------------------------//
//              More info https://github.com/remcotroost/SubNotifier         //
//                          or @d0p3t on Twitter                             //
// --------------------------------------------------------------------------//

var config = {};

config.tmi = {
    options: {
        clientId: 'clientId',
        debug: true                    // set to true to see error messages and chat
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: 'username',
        password: 'oauth:token'    // For example -> 'oauth:23457feg97345897fd98723f'
    },
    channels: ["#channel"]          // Must have a # sign. For example -> ["#summit1g"]
};

module.exports = config;

#!/usr/bin/env node
const logger = require('./utils/logger');
const config = require('./config/config');
const favicon = require('serve-favicon');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const discord = require('./utils/discord');
const twitch = require('./utils/twitch');
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const request = require('request');

mongoose.connect("mongodb://" + config.db.uri + "", config.db.options);
let db = mongoose.connection;

db.once('open', function(){
  logger.info('[Database] Successfully connected to MongoDB.');
});

db.on('error', function(err){
  logger.error('[Database] Error connecting to MongoDB, please check your database configuration.');
});

twitch();
discord();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const store = new mongoDBStore({
    uri: 'mongodb://' + config.db.uri,
    collection: 'sessionsStorage'
  });

store.on('error', function(error) {
  logger.error("[Session] Error with session storage | " + err);
});

app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('tiny',({ "stream": logger.stream })));

app.use(session({
  secret: 'q435t799byq349tb943t6',
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  store: store,
  resave: true,
  saveUninitialized: true
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Routes
const routes = require('./routes');
app.use('/', routes);

// Sockets
const Command = require('./models/command');
const Notice = require('./models/notice');
const Alert = require('./models/alert');
const Variable = require('./models/variable');
const Link = require('./models/link');
const Word = require('./models/word');

io.on('connection', function (socket) {
  logger.debug("[Socket] Client Connected.");


  socket.on('add command', function(data) {
    var cmd = new Command({
      name: data.name,
      value: data.value,
      permission: 0,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    cmd.save(function(err, done) {
      if(err) {
        logger.error('[Database] Error adding command | ' + err);
      }
    });

    // populate table with new command
    socket.emit('update command table', {
      command: data
    });
  });

  socket.on('edit command', function(data) {
    Command.findOne({ name: data.name },function(err, cmd) {
      if(err) {
        logger.error('[Database] Error finding command (edit) | ' + err);
      }
      cmd.value = data.value;
      cmd.updated_at = Date.now();

      cmd.save(function(err, done) {
        if(err) {
          logger.error('[Database] Error editing command | ' + err);
        }
      })
    });

    // populate table with new command
    socket.emit('update edit command table', {
      command: data
    });
  });

  socket.on('del command', function(data) {
    Command.findOne({ name: data.name },function(err, cmd) {
      if(err) {
        logger.error('[Database] Error finding command (del) | ' + err);
      }

      cmd.remove(function(err, done) {
        if(err) {
          logger.error('[Database] Error removing command | ' + err);
        }
      })
    });

    // populate table with new command
    socket.emit('update del command table', {
      command: data
    });
  });

  socket.on('add notice', function(data) {
    var not = new Notice({
      name: data.name,
      value: data.value,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    not.save(function(err, done) {
      if(err) {
        logger.error('[Database] Error adding notice | ' + err);
      }
    });

    // populate table with new command
    socket.emit('update notice table', {
      notice: data
    });
  });

  socket.on('edit notice', function(data) {
    Notice.findOne({ name: data.name },function(err, not) {
      if(err) {
        logger.error('[Database] Error finding notice (edit) | ' + err);
      }
      not.value = data.value;
      not.updated_at = Date.now()

      not.save(function(err, done) {
        if(err) {
          logger.error('[Database] Error editing notice | ' + err);
        }
      })
    });

    // populate table with new command
    socket.emit('update edit notice table', {
      notice: data
    });
  });

  socket.on('del notice', function(data) {
    Notice.findOne({ name: data.name },function(err, not) {
      if(err) {
        logger.error('[Database] Error finding notice (del) | ' + err);
      }

      not.remove(function(err, done) {
        if(err) {
          logger.error('[Database] Error removing notice | ' + err);
        }
      })
    });

    // populate table with new command
    socket.emit('update del notice table', {
      notice: data
    });
  });

  socket.on('edit alert', function(data) {
    Alert.findOne({ name: data.name },function(err, alert) {
      if(err) {
        logger.error('[Database] Error finding alert | ' + err);
      }
      alert.value = data.value;
      alert.updated_at = Date.now();

      alert.save(function(err, done) {
        if(err) {
          logger.error('[Database] Error editing alert | ' + err);
        }
      });
    });

    // populate table with new command
    socket.emit('update edit alert table', {
      alert: data
    });
  });

  socket.on('edit notices settings', function(data) {
    Variable.findOne({ name: data.name },function(err, variable) {
      if(err) {
        logger.error('[Database] Error finding variable | ' + err);
      }
      variable.value = data.value;
      variable.updated_at = Date.now();

      variable.save(function(err, done) {
        if(err) {
          logger.error('[Database] Error editing variable | ' + err);
        }
      });
    });
  });

  socket.on('add word to blacklist', function(data) {
    var word = new Word({
      value: data.value,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    word.save(function(err, done) {
      if(err) {
        logger.error('[Database] Error adding word to blacklist | ' + err);
      }
    });

    socket.emit('update add blacklist word table', {
      word: data
    });
  });

  socket.on('del word', function(data) {
    Word.findOne({ value: data.value },function(err, word) {
      if(err) {
        logger.error('[Database] Error finding word (del) | ' + err);
      }

      word.remove(function(err, done) {
        if(err) {
          logger.error('[Database] Error removing word | ' + err);
        }
      })
    });

    // populate table with new command
    socket.emit('update del word table', {
      word: data
    });
  });

  socket.on('add link to whitelist', function(data) {
    var link = new Link({
      value: data.value,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    link.save(function(err, done) {
      if(err) {
        logger.error('[Database] Error adding link to whitelist | ' + err);
      }
    });

    socket.emit('update add whitelist link table', {
      link: data
    });
  });

  socket.on('del link', function(data) {
    Link.findOne({ value: data.value },function(err, link) {
      if(err) {
        logger.error('[Database] Error finding link (del) | ' + err);
      }

      link.remove(function(err, done) {
        if(err) {
          logger.error('[Database] Error removing link | ' + err);
        }
      })
    });

    // populate table with new command
    socket.emit('update del link table', {
      link: data
    });
  });

  socket.on('update stream info', function(data) {
    request.get({
      url: 'https://api.twitch.tv/kraken/streams/' + config.defaults.username,
      headers: {
          'Client-ID': config.tmi.options.clientId
      }
    }, function(err, res, body) {
        if(!err) {
          socket.emit('stream info change', {
            info: JSON.parse(body)
          });
        }
    });
  });
});

server.listen(app.get('port'), function() {
  logger.info('[General] Server listening on port ' + app.get('port') + '!');
});

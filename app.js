#!/usr/bin/env node
const logger = require('./utils/logger');
const config = require('./config/config');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const discord = require('./utils/discord');
const twitch = require('./utils/twitch');
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.connect("mongodb://" + config.db.uri + "");
let db = mongoose.connection;

db.once('open', function(){
  logger.info('Connected to MongoDB');
});

db.on('error', function(err){
  logger.error(err);
});

// Init bots
twitch();
discord();

// Init App
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('combined',({ "stream": logger.stream })));

app.use(session({
  secret: 'q435t799byq349tb943t6',
  resave: true,
  saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

let routes = require('./routes');
app.use('/', routes);


io.on('connection', function (socket) {
  logger.info("Connected");
});

server.listen(app.get('port'), function() {
  logger.info('[Express] Listening on port ' + app.get('port') + '!');
});

#!/usr/bin/env node
const logger = require('./utils/logger');
const discord = require('./utils/discord');
const twitch = require('./utils/twitch');

// Initiate bots
twitch();
discord();

// Express
var express = require('express');
var app = express();
var routes = require('./routes');

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

const port = process.env.PORT || 3000;

app.listen(port, function() {
  logger.info('[Express] Listening on port ' + port + '!');
});

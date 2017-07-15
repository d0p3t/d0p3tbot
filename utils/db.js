'use strict';

const logger = require('../utils/logger');
const config = require('../config/config.js');

var db = function() {
  var mongoose = require('mongoose');
  var database = mongoose.createConnection("mongodb://" + config.db.options.user + ":" + config.db.options.pass + "@" + config.db.uri);

  database.on('open', function() {
    logger.info('[DB] Successfully connected to database');
  });
}

module.exports = db;

var mongoose = require('mongoose');

var commandSchema = new mongoose.Schema({
  name: String,
  permission: Number,
  value: String,
  created_at: Date,
  updated_at: Date
});

var Command = mongoose.model('Command', commandSchema);

module.exports = Command;

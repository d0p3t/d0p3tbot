const mongoose = require('mongoose');

const CommandSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true },
  value: {type: String, required: true },
  permission: {type: Number, required: true },
  created_at: Date,
  updated_at: Date
});

const Command = module.exports = mongoose.model('Command', CommandSchema);

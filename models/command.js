const mongoose = require('mongoose');

const CommandSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true },
  value: {type: String, required: true, default: 'empty?' },
  category: {type: String, required: true, default: 'custom' },
  permission: {type: Number, required: true },
  status: {type: String, required: true, default: 'enabled' },
  created_at: Date,
  updated_at: Date
});

const Command = module.exports = mongoose.model('Command', CommandSchema);

const mongoose = require('mongoose');

const LinkSchema = mongoose.Schema({
  value: {type: String, required: true, unique: true, default: 'empty?' },
  category: {type: String, required: true, default: 'whitelist' },
  permission: {type: Number, required: true, default: 0 },
  created_at: Date,
  updated_at: Date
});

const Link = module.exports = mongoose.model('Link', LinkSchema);

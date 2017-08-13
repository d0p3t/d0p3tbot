const mongoose = require('mongoose');

const WordSchema = mongoose.Schema({
  value: {type: String, required: true, unique: true, default: 'empty?' },
  category: {type: String, required: true, default: 'blacklist' },
  permission: {type: Number, required: true, default: 0 },
  created_at: Date,
  updated_at: Date
});

const Word = module.exports = mongoose.model('Word', WordSchema);

const mongoose = require('mongoose');

const NoticeSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true },
  value: {type: String, required: true },
  created_at: Date,
  updated_at: Date
});

const Notice = module.exports = mongoose.model('Notice', NoticeSchema);

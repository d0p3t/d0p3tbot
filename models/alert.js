const mongoose = require('mongoose');

const AlertSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true },
  value: {type: String, required: true },
  created_at: Date,
  updated_at: Date
});

const Alert = module.exports = mongoose.model('Alert', AlertSchema);

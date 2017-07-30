const mongoose = require('mongoose');

const VariableSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true },
  value: {type: String, required: true },
  category: {type: String, required: true},
  created_at: Date,
  updated_at: Date
});

const Variable = module.exports = mongoose.model('Variable', VariableSchema);

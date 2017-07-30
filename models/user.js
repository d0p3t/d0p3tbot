const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  meta: {
    last_login: Date,
    profile_picture: String,
    theme_color: String
  },
  created_at: Date,
  updated_at: Date
});

const User = module.exports = mongoose.model('User', UserSchema);

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/config');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(
    function(username, password, cb) {
      User.findOne({'username':username}, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
}

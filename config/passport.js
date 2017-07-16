const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/config');

module.exports = function(passport){

    passport.serializeUser(function(user, cb) {
      cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
      User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
      });
    });

  // Local Strategy
  passport.use('local', new LocalStrategy({ passReqToCallback: true },
    function(req, username, password, cb) {
      process.nextTick(function(){
        User.findOne({'username':username}, function(err, user) {
          if (err) { return cb(err); }
          if (!user || user.password != password) { return cb(null, false, req.flash('loginMessage', 'Wrong username or password')); }
          return cb(null, user);
        });
      });
    }));
}

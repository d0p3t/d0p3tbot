var express = require('express');
var router = express.Router();
var passport = require('passport');
let User = require('../models/user');
const logger = require('../utils/logger');
const config = require('../config/config');



router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome', message: 'Welcome to d0p3tbot'});
});

router.get('/user', (req, res) => {

  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);
  });
});

router.post('/user', (req, res) => {
  // let newUser = new User({
  //   name:"Hans Meiser",
  //   username:"hans",
  //   password:"123"
  // });
  // newUser.save(function(err) {
  //   if(err)
  //     logger.error(err);
  //   else
  //     res.send("ok");
  // })
  res.send("ok");
});
// router.get('/users', function(req, res) {
//   logger.info("here");
//   mongoose.model('users').find(function(err, users) {
//     logger.info("there");
//     res.send(users);
//   });
// });

router.get('/dashboard', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render('dashboard', { title: "Dashboard", message: "Dashboard"});
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  });

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;

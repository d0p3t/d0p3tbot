var express = require('express');
var router = express.Router();
var passport = require('passport');
let User = require('../models/user');
let Command = require('../models/command');
const logger = require('../utils/logger');
const config = require('../config/config');



router.get('/', (req, res) => {
  if(!req.user)
    res.redirect('/login');
  else
    res.redirect('/dashboard');
});

router.get('/dashboard', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render('dashboard', { title: "d0p3tbot - Dashboard", message: "Dashboard"});
});

router.get('/commands', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  Command.find(function(err, commands) {
    if(err)
      logger.error("[Database] Error finding commands | " + err);
    res.render('commands', { title: "d0p3tbot - Commands", message: "Commands", cmds: commands});
  });
});

router.get('/notices', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render('notices', { title: "d0p3tbot - Notices", message: "Notices"});
});

router.get('/alerts', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render('alerts', { title: "d0p3tbot - Alerts", message: "Alerts"});
});

router.get('/discord', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render('discord', { title: "d0p3tbot - Discord", message: "Discord"});
});



router.get('/login', (req, res) => {
  res.render('login', { title: "d0p3tbot - Login", message: req.flash('loginMessage'), logoutSuccess: req.flash('logoutSuccess') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function(req, res){
  req.logout();
  req.flash('logoutSuccess', 'You have been logged out');
  res.redirect('/login');
});

module.exports = router;

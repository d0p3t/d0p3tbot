var express = require('express');
var router = express.Router();
var passport = require('passport');
let User = require('../models/user');
let Command = require('../models/command');
let Notice = require('../models/notice');
let Alert = require('../models/alert');
let Variable = require('../models/variable');
let Link = require('../models/link');
let Word = require('../models/word');
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
    res.render('commands', { title: "d0p3tbot - Commands", message: "Commands", cmds: commands, basic_cmds: commands});
  });
});

router.get('/notices', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  Notice.find(function(err, notices) {
    if(err)
      logger.error("[Database] Error finding notices | " + err);
    Variable.find(function(err, variables) {
      if(err)
        logger.error("[Database] Error finding variables | " + err);
      res.render('notices', { title: "d0p3tbot - Notices", message: "Notices", nots: notices, vars: variables});
    })

  });
});

router.get('/alerts', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  Alert.find(function(err, alrts) {
    if(err)
      logger.error("[Database] Error finding alerts | " + err);
    res.render('alerts', { title: "d0p3tbot - Chat Alerts", message: "Chat ", alerts: alrts});
  });
});

router.get('/giveaways', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render('giveaways', { title: "d0p3tbot - Giveaways", message: "Giveaways"});
});

router.get('/security', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  Link.find(function(err, links) {
    if(err)
      logger.error("[Database] Error finding links | " + err);
    Word.find(function(err, words) {
      if(err)
        logger.error("[Database] Error finding words | " + err);
      res.render('security', { title: "d0p3tbot - Security", message: "Security", whitelist: links, blacklist: words });      
    })
  })

});

router.get('/termsofservice', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
  res.render('termsofservice', { title: "d0p3tbot - TOS", message: "TOS"});
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

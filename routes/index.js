var express = require('express');
var router = express.Router();

router.get('*', (req, res) => {
  res.render('index', { title: 'Dashboard', message: 'Dashboard'});
});

module.exports = router;

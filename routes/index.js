var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'YHug' });
});

router.get('/hug', function(req, res) {
  res.render('hug');
});

module.exports = router;

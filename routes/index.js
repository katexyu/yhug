var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'YHug' });
});


/* GET home page. */
router.get('/message', function(req, res) {
  res.render('message');
});


module.exports = router;

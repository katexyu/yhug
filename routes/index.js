var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'YHug' });
});

router.get('/hug', function(req, res) {
  res.render('hug');
});

router.post('/hug', function(req, res) {
    req.user.addToQueue(req.body.latitude, req.body.longitude, function(user) {
        if (user) {
            res.status(200).send("We matched you!!!!");
        } else {
            res.status(200).send("Sorry, we're still matching you!");
        }
    });
});

module.exports = router;

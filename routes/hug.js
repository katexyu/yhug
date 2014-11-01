var express = require('express');
var router = express.Router();
var isAuthorized = require('../auth/isLoggedIn');
var User = require('../model/user');

router.get('/', isAuthorized, function(req, res) {
  res.render('hug');
});

router.post('/', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.addToQueue(req.body.latitude, req.body.longitude);
        user.match(function(err, user) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            if (user) {
                res.status(200).send("We matched you with " + user.givenName + "!!!!");
            } else {
                res.status(200).send("Sorry, we're still matching you!");
            }
        });
      });
});


module.exports = router;
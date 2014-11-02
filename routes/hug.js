var express = require('express');
var router = express.Router();
var isAuthorized = require('../auth/isLoggedIn');
var User = require('../model/user');
var STATUSES = require('../model/statuses');

router.get('/', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (user.status === STATUSES.MATCHED) {
            User.findById(user.huggerMatch, function(err, user) {
                res.render('hug', {
                    wantsHug: false,
                    match: user.huggerMatch,
                    name: user.givenName,
                    photo: user.photo,
                });
            });
        } else if (user.status === STATUSES.WANTS_HUG) {
            res.render('hug', {wantsHug: true});
        } else {
            res.render('hug', {wantsHug: false});
        }
    });
});

router.post('/', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.addToQueue(req.body.latitude, req.body.longitude, function(err, user) {
            user.match(function(err, currentUser, matchedUser) {
                res.status(200).send();
            });
        });
      });
});

router.post('/cancel', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.removeFromQueue(function(err, user) {
            res.status(200).send();
        });
    });
});

module.exports = router;
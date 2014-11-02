var express = require('express');
var router = express.Router();
var isAuthorized = require('../auth/isLoggedIn');
var User = require('../model/user');
var STATUSES = require('../model/statuses');

router.get('/', isAuthorized, function(req, res) {
    if (req.user.status === STATUSES.MATCHED) {
        User.findById(req.user.huggerMatch, function(err, user) {
            res.render('hug', {
                wantsHug: false,
                match: req.user.match,
                name: user.givenName,
                photo: user.photo,
            });
        });
    } else if (req.user.status === STATUSES.WANTS_HUG) {
        res.render('hug', {wantsHug: true});
    } else {
        res.render('hug', {wantsHug: false});
    }
});

router.post('/', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.addToQueue(req.body.latitude, req.body.longitude);
        user.match(function(err, user) {
            res.redirect('/');
        });
      });
});

router.post('/cancel', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.removeFromQueue();
        res.redirect('/');
    });
});

module.exports = router;
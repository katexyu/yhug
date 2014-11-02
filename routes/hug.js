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
                    phoneNumber: user.phoneNumber
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
        user.addToQueue(req.body.latitude, req.body.longitude);
        user.match(function(err) {
            res.status(200).send();
        });
      });
});

router.post('/cancel', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.removeFromQueue();
        res.status(200).send();
    });
});

router.post('/cancelmatch', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, currentUser) {
        User.findById(currentUser.huggerMatch, function(err, user) {
            currentUser.cancelMatch();
            user.updateStatus(STATUSES.WANTS_HUG);
            user.match(function(err) {
                res.status(200).send();
            });
        });
    });
});

router.post('/accept', isAuthorized, function(req, res) {
    var location = req.body.location;
    var phoneNumber = req.body.phoneNumber;
    User.findById(req.user._id, function(err, user) {
        user.location = location;
        user.phoneNumber = phoneNumber;
        user.status = STATUSES.CONFIRMED;
        user.save();
    });
});

//check if your match has been accepted
router.get('/match', isAuthorized, function(req, res){
        User.findById(req.user._id, function(err, user) {
        if (user.status === STATUSES.CONFIRMED) {
            User.findById(user.huggerMatch, function(err, user) {
                res.render('hug', {
                    wantsHug: false,
                    location: user.location,
                    meetup: user.huggerMatch,
                    name: user.givenName,
                    photo: user.photo,
                    phoneNumber: user.phoneNumber
                });
            });
        } else if (user.status === STATUSES.DEFAULT) {
            res.render('hug', {wantsHug: true});
        } else {
            res.render('hug', {wantsHug: false});
        }
    });
})

module.exports = router;
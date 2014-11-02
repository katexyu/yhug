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
                    status: user.status,
                    wantsHug: false,
                    match: user.huggerMatch,
                    name: user.givenName,
                    photo: user.photo,
                    phoneNumber: user.phoneNumber
                });
            });
        } else if (user.status === STATUSES.WANTS_HUG) {
            res.render('hug', {
                status: user.status,
                wantsHug: true,
            });
        } else if (user.status === STATUSES.REJECTED) {
            res.render('hug', {
                status: user.status,
                wantsHug: true,
                rejected: true
            });
        } else if (user.status === STATUSES.ACCEPTED) {
            res.render('hug', {
                status: user.status,
                waiting: true,
            });
        } else if (user.status === STATUSES.CONFIRMED) {
            res.render('hug', {
                status: user.status,
                confirmed: true,
            });
        } else {
            res.render('hug', {
                status: user.status,
                wantsHug: false
            });
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
    if (req.body.type === "request") {
        User.findById(req.user._id, function(err, user) {
            user.removeFromQueue();
            res.status(200).send();
        });
    } else if (req.body.type === "match") {
        User.findById(req.user._id, function(err, currentUser) {
            User.findById(currentUser.huggerMatch, function(err, user) {
                currentUser.cancelMatch();
                user.updateStatus(STATUSES.REJECTED);
                user.match(function(err) {
                    res.status(200).send();
                });
            });
        });
    } else {
        res.status(400).send("Specify request type");
    }

});

router.post('/accept', isAuthorized, function(req, res) {
    var location = req.body.location;
    var phoneNumber = req.body.phoneNumber;
    User.findById(req.user._id, function(err, user) {
        user.location = location;
        user.phoneNumber = phoneNumber;
        user.updateStatus(STATUSES.ACCEPTED);
        user.save();
        User.findById(user.huggerMatch, function(err, matchedUser) {
            if (matchedUser.status === STATUSES.ACCEPTED) {
                user.updateStatus(STATUSES.CONFIRMED);
                matchedUser.updateStatus(STATUSES.CONFIRMED);   
            }
        })
    });
});

//check if your match has been accepted
router.get('/match', isAuthorized, function(req, res){
    User.findById(req.user._id, function(err, user) {
        res.status(200).send({
            status: user.status,
        });
    });
});

router.put('/status', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.updateStatus(req.body.status);
        res.status(200).send({
            status: user.status,
        });
    });
});

module.exports = router;
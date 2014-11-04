var express = require('express');
var router = express.Router();
var isAuthorized = require('../auth/isLoggedIn');
var User = require('../model/user');
var STATUSES = require('../model/statuses');

router.get('/', isAuthorized, function(req, res) {
    User.findById(req.user._id).populate('huggerMatch').exec(function(err, user) {
        if (user.status === STATUSES.MATCHED) {
            if (!user.huggerMatch) {
                user.updateStatus(STATUSES.DEFAULT);
                user.save();
                return res.render('hug', {status:user.status, wantsHug: false});
            } else{
                return res.render('hug', {
                    status: user.status,
                    wantsHug: false,
                    match: user.huggerMatch,
                    name: user.huggerMatch.givenName,
                    photo: user.huggerMatch.photo,
                    phoneNumber: user.huggerMatch.phoneNumber
                });
            }
        } else if (user.status === STATUSES.WANTS_HUG) {
            return res.render('hug', {
                status: user.status,
                wantsHug: true
            });
        } else if (user.status === STATUSES.REJECTED) {
            return res.render('hug', {
                status: user.status,
                wantsHug: true,
                rejected: true
            });
        } else if (user.status === STATUSES.ACCEPTED) {
            return res.render('hug', {
                status: user.status,
                waiting: true,
                name: user.huggerMatch.givenName,
                photo: user.huggerMatch.photo,
                phoneNumber: user.phoneNumber
            });
        } else if (user.status === STATUSES.CONFIRMED) {
            return res.render('hug', {
                status: user.status,
                confirmed: true,
                location: user.huggerMatch.location,
                name: user.huggerMatch.givenName,
                photo: user.huggerMatch.photo,
                phoneNumber: user.huggerMatch.phoneNumber
            });
        } else {
            return res.render('hug', {
                status: user.status,
                wantsHug: false
            });
        }
    });
});

router.post('/', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.addToQueue();
        user.match(function(err) {
            return res.status(200).send();
        });
      });
});

router.post('/cancel', isAuthorized, function(req, res) {
    if (req.body.type === "request") {
        User.findById(req.user._id, function(err, user) {
            user.removeFromQueue();
            return res.status(200).send();
        });
    } else if (req.body.type === "match") {
        User.findById(req.user._id, function(err, currentUser) {
            User.findById(currentUser.huggerMatch, function(err, user) {
                currentUser.cancelMatch();
                user.updateStatus(STATUSES.REJECTED);
                user.match(function(err) {
                    return res.status(200).send();
                });
            });
        });
    } else {
        return res.status(400).send("Specify request type");
    }

});

router.post('/accept', isAuthorized, function(req, res) {
    var location = req.body.location;
    var phoneNumber = req.body.phoneNumber;
    User.findById(req.user._id, function(err, user) {
        user.accept(location, phoneNumber, function(err, user) {
            if (err) {
                return res.status(400).send("There was an error");
            }
            return res.status(200).send({
                status: user.status,
            });
        });

    });
});

//check if your match has been accepted
router.get('/match', isAuthorized, function(req, res){
    User.findById(req.user._id, function(err, user) {
        return res.status(200).send({
            status: user.status,
        });
    });
});

router.put('/status', isAuthorized, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.updateStatus(req.body.status);
        return res.status(200).send({
            status: user.status,
        });
    });
});

module.exports = router;
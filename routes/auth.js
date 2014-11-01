var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval. 
router.get('/facebook/callback', function(req, res, next){
    passport.authenticate('facebook', function(err, user, info){
        if (err) return next(err);
        if (!user) return res.status(400).json({'error':'Something went wrong here'}).end();
        else {
            req.login(user, function(err){
                if (err) return next(err);
                return res.redirect('/hug');
            });
        }
    })(req, res, next);
});

module.exports = router;
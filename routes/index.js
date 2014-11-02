var express = require('express');
var router = express.Router();
var User = require('../model/user');

/* GET home page. */
router.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.redirect('/hug'); //if logged in, redirect to the hugs page
  } 
  res.render('index', { title: 'YHug' });
});

/* POST to logout */
router.post('/logout', function(req, res){
    User.findById(req.user._id, function(err, user) {
        user.cancelMatch();
        req.logout();
        res.status(200).send({message: 'Logout successful'});        
    });
});

module.exports = router;

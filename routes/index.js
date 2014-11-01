var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.redirect('/hug'); //if logged in, redirect to the hugs page
  } 
  res.render('index', { title: 'YHug' });
});

/* POST to logout */
router.post('/logout', function(req, res){
    req.logout();
    res.status(200).send({message: 'Logout successful'});
});

module.exports = router;

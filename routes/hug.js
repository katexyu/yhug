var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.render('hug');
  } else{
    res.redirect('/');
  }
});

router.post('/', function(req, res) {
  if (req.isAuthenticated()){
    res.status(200).send({'message':'Signed up for hug!'}).end();
  }else{
    res.status(401).send({'error':'You are not logged in!'}).end();
  }
});


module.exports = router;
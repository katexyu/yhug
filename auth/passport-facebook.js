var config = require('../config'); //not checked into the repo
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/user-model');

var fbConfigs = app.get('env') === 'development'? config.test: config.production;

module.exports = function(passport){
  passport.use(new FacebookStrategy({
      clientID: fbConfigs.clientID,
      clientSecret: fbConfigs.clientSecret,
      callbackURL: fbConfigs.callbackURL,
      profileFields: ['id', 'name','picture.type(large)', 'username', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
          // check to see if there's already a user with that email
          User.findOne({ 'facebookId' :  profile.id }, function(err, user) {
              // if there are any errors, return the error
              if (err)
                  return done(err);
              if (user) {
                  //log them in
                  return done(null, user);
              } else {
                  // if there is no user with a matching FB account, create the user
                  var newUser = new User({facebookId: profile.id, token: accessToken, givenName: profile.name.givenName, familyName: profile.name.familyName, picture: profile.picture.type(large)});
                  newUser.save();
                  return done(null, newUser);
          }    
      });
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};
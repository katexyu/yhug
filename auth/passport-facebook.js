var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/user');
var app = require('../app');


module.exports = function(passport){
  passport.use(new FacebookStrategy({
      clientID: process.env.FB_ID || process.env.YHUG_FB_ID,
      clientSecret: process.env.FB_SECRET || process.env.YHUG_FB_SECRET,
      callbackURL: process.env.FB_CALLBACK || process.env.YHUG_CALLBACK,
      profileFields: ['id', 'name', 'displayName', 'photos']
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
          // check to see if there's already a user with that email
          User.findOne({ 'facebookId' :  profile.id }, function(err, user) {
              // if there are any errors, return the error
              if (err) return done(err);
              if (user) {
                  //log them in
                  return done(null, user);
              } else {
                  // if there is no user with a matching FB account, create the user
                  var newUser = new User({facebookId: profile.id, accessToken: accessToken, givenName: profile.name.givenName, familyName: profile.name.familyName, photo: profile.photos[0].value});
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
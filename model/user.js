var mongoose = require('mongoose');
var STATUSES = require('./statuses');

var userSchema = mongoose.Schema({
    givenName: {type: String},
    familyName: {type: String},
    facebookId: {type: String},
    accessToken: {type: String},
    photo: {type:String},
    latitude: {type: Number},
    longitude: {type: Number},
    location: {text: String},
    huggerMatch: {type: mongoose.Schema.Types.ObjectId},
    wantsHug: {type: Boolean, required: true, default: false},
    status: {type: String}
});

userSchema.method('addToQueue', function(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.status = STATUSES.WANTS_HUG;
    this.save();
});

userSchema.method('removeFromQueue', function() {
    this.status = STATUSES.DEFAULT;
    this.save();
});

userSchema.method('match', function(callback) {
    var longitude = this.longitude;
    var latitude = this.latitude;
    var currentUser = this;
    User.find({status: STATUSES.WANTS_HUG}).exec(function(err, users) {
        if (err) {
            callback(err);
            return;
        }
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user._id.equals(currentUser._id)) {
                continue;
            }
            var maxDistance = 0.4;
            if (getDistance(longitude, latitude, user.longitude, user.latitude) < maxDistance) {
                currentUser.set('status', STATUSES.MATCHED).set('huggerMatch', user._id).save();
                user.set('status', STATUSES.MATCHED).set('huggerMatch', currentUser._id).save();
                callback(null, user);
                return;
            }
        };
        callback(null);
    });
});

userSchema.method('cancelMatch', function(callback) {
    User.findById(this.match, function(err, user) {
        user.set('huggerMatch', null).save();
        user.match(function(err, newMatch) {
            if (err) {
                callback(err);
                return;
            }
            if (newMatch) {
                callback(null, newMatch);
                return;
            } else {
                callback(err);
            }
        });
    });
});

var User = mongoose.model('User', userSchema);

module.exports = User;

function getDistance(lon1,lat1,lon2,lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
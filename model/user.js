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
    location: {type: String},
    phoneNumber: {type: String},
    huggerMatch: {type: mongoose.Schema.Types.ObjectId},
    status: {type: String, default: STATUSES.DEFAULT}
});

userSchema.method('addToQueue', function(latitude, longitude, callback) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.status = STATUSES.WANTS_HUG;
    this.save();
});

userSchema.method('updateStatus', function(status, callback) {
    this.status = status;
    this.save();
});

userSchema.method('removeFromQueue', function(callback) {
    this.status = STATUSES.DEFAULT;
    this.save();
});

userSchema.method('cancelMatch', function(callback) {
    this.removeFromQueue();
    this.huggerMatch = null;
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
                callback(null, currentUser, user);
                return;
            }
        };
        callback(null, currentUser);
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
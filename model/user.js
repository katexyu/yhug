var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    givenName: {type: String},
    familyName: {type: String},
    facebookId: {type: String},
    accessToken: {type: String},
    photo: {type:String},
    latitude: {type: Number},
    longitude: {type: Number},
    wantsHug: {type: Boolean, required: true, default: false}
});

userSchema.method('addToQueue', function(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.wantsHug = true;
    this.save();
});

userSchema.method('removeFromQueue', function() {
    this.latitude = null;
    this.longitude = null;
    this.wantsHug = false;
    this.save();
});

userSchema.method('match', function(callback) {
    var longitude = this.longitude;
    var latitude = this.latitude;
    var currentUser = this;
    User.find({wantsHug: true}).exec(function(err, users) {
        if (err) {
            callback(err);
            return;
        }
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user._id.equals(currentUser._id)) {
                continue;
            }
            var maxDistance = 1.0;
            if (getDistance(longitude, latitude, user.longitude, user.latitude) < maxDistance) {
                currentUser.removeFromQueue();
                user.removeFromQueue();
                callback(null, user);
                return;
            }
        };
        callback(null);
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
var mongoose = require('mongoose');
var distance = require('gps-distance');

var userSchema = mongoose.Schema({
    givenName: {type: String},
    familyName: {type: String},
    facebookId: {type: String},
    accessToken: {type: String},
    photo: {type:String},
    location: {
        latitude: Number,
        longitude: Number
    }
});

var User = mongoose.model('User', userSchema);

userSchema.method('addToQueue', function(latitude, longitude, callback) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.inQueue = true;
    var matchedUser = this.match(function(err, user) {
        if (err) {
            callback(err);
            return;
        }
        callback(user);
    });
});

userSchema.method('removeFromQueue', function() {
    this.latitude = null;
    this.longitude = null;
    this.inQueue = false;
});

userSchema.method('match', function(callback) {
    User.find({inQuene: true}).exec(function(err, users) {
        if (err) {
            callback(err);
            return;
        }
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            // kilometers
            var maxDistance = 1.0;
            if (distance(this.latitude, this.longitude, user.latitude, user.longitude) < maxDistance) {
                this.removeFromQueue();
                user.removeFromQueue();
                callback(null, user);
                return;
            }
        };
        callback(null);
    });
});

module.exports = User;
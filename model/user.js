var mongoose = require('mongoose');
var STATUSES = require('./statuses');

var userSchema = mongoose.Schema({
    givenName: {type: String},
    familyName: {type: String},
    facebookId: {type: String},
    accessToken: {type: String},
    photo: {type:String},
    location: {type: String},
    phoneNumber: {type: String},
    huggerMatch: {type: mongoose.Schema.Types.ObjectId},
    status: {type: String, default: STATUSES.DEFAULT}
});

userSchema.method('addToQueue', function() {
    this.status = STATUSES.WANTS_HUG;
    this.save();
});

userSchema.method('updateStatus', function(status) {
    this.status = status;
    this.save();
});

userSchema.method('removeFromQueue', function() {
    this.status = STATUSES.DEFAULT;
    this.save();
});

userSchema.method('cancelMatch', function() {
    this.removeFromQueue();
    this.huggerMatch = null;
    this.save();
});

userSchema.method('match', function(callback) {
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
            currentUser.set('status', STATUSES.MATCHED).set('huggerMatch', user._id).save();
            user.set('status', STATUSES.MATCHED).set('huggerMatch', currentUser._id).save();
            callback(null, currentUser, user);
            return;
        };
        callback(null, currentUser);
    });
});

userSchema.method('accept', function(location, phoneNumber, callback) {
    this.location = location;
    this.phoneNumber = phoneNumber;
    this.save();
    this.updateStatus(STATUSES.ACCEPTED);
    var user = this;
    User.findById(user.huggerMatch, function(err, matchedUser) {
        if (matchedUser.status === STATUSES.ACCEPTED) {
            user.updateStatus(STATUSES.CONFIRMED);
            matchedUser.updateStatus(STATUSES.CONFIRMED);
        }
        callback(err, user);
    });
});

var User = mongoose.model('User', userSchema);

module.exports = User;
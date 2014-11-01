var mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
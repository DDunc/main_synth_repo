var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   displayName: String,
   googleId: String,
   facebookId: String
});

module.exports = mongoose.model('User', userSchema);
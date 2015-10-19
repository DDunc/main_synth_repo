var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   displayName: String,
   googleId: String,
   googleProfile: Object
});

module.exports = mongoose.model('User', userSchema);
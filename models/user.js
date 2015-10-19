var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
   fullName: String,
   googleProfile: String //maybe object, maybe not?

});
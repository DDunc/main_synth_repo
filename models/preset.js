//ownerId is the user object _id, do a db.collection.find({ownerId: 'User._id'})
//
var mongoose = require("mongoose");
//search by owner (ownerId) serach by preset name(presetName), return public only
//To Do: filter out illegal / *, <, etc characters with regex
var presetSchema = new mongoose.Schema({
  ownerId: String,
  presetName: String,
  settings: Object,
  isPublic: Boolean
});

// 1) search the users collection, find the ID, then use that ID
//when setting to public, checks if presetname is already in DB, if it is, don't add it, return
//message that name already exists
module.exports = mongoose.model('Preset', presetSchema);

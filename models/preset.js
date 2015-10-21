//ownerId is the user object _id, do a db.collection.find({ownerId: 'User._id'})
//

var presetSchema = new mongoose.Schema({
  ownerId: String,
  settings: String,
  isPublic: Boolean
});

module.exports = mongoose.model('Preset', presetSchema);
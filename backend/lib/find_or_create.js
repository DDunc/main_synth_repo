var mongoose = require('mongoose');
var User = require(__dirname + '/../../models/user');
var Preset = require(__dirname + '/../../models/preset');
module.exports = function findOrCreateUser(req, res, stratId) {
  /* var userFind = User.findOne({strat: req.user.id})
  userFind.then(function(doc) {
             var newPreset = new Preset();
              newPreset.ownerId = req.user.dbId;
              newPreset.presetName = req.user.id + " space bass";
              newPreset.isPublic = true;
             next();
         }, function(err) {
             // handle error here.
         }); */

  var stratObj = {};
  stratObj[stratId] = req.user.id;
  stratObj = JSON.stringify(stratObj);

  User.findOne(stratObj).exec(function(err, user) {
    if(user){
      console.log("this is user stratId", user[stratId]);
      console.log("this is req.user.id", req.user.id);
      console.log("this is user", user);
      req.user.dbId = user._id.toString();
      res.user = req.user;
      Preset.find({ownerId: user._id})
        .exec(function(err, data) {
          res.location("/");
          console.log("existing user account stuff is go");
          res.redirect("/");
        },
        function(err){
          console.log(err);
        })
      //res.send(user);
      //res.redirect("/")
    }
    if(!user) {
      var newUser = new User();
      req.user.dbId = newUser._id.toString();
      console.log("this is new user id " + newUser._id);
      newUser[stratId] = req.user.id;
      newUser.displayName = req.user.displayName;
      var newPreset = new Preset();
      newPreset.ownerId = newUser._id.toString();
      newPreset.patchName = req.user.id + "_space_bass";
      newPreset.isPublic = false;
      //newUser.googleProfile = req.user;
      //function saveDocument(){};
      //refactor to be
      newUser.save(function(err, user){
        if (err){
          console.log(err);
        }
        newPreset.save(function(err, preset){
          if (err){
            console.log(err);
          }
          console.log("new user account stuff is go")
          res.location("/");
        });
      })
    };
  });
}
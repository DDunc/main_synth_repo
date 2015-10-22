var express = require("express");
var presetRouter = module.exports = exports = express.Router();
var jsonParser = require("body-parser").json;
var Preset = require(__dirname + "/../../models/preset");
var User = require(__dirname + "/../../models/user");
var mongoose = require("mongoose");
var ensureAuthenticated = require(__dirname + "/../lib/ensureAuth");


presetRouter.get("/get_preset", ensureAuthenticated, function(req, res) {
  console.log("THIS IS REQ.USER", req);
  Preset.find({ownerId: req.user.dbId}, function(err, presetData){
    if (err){
      console.log(err);
    }
    console.log("THIS IS PRESET DATA", presetData);
    res.send(presetData);  //sent as an array!
  });
});

presetRouter.get("/get_all", ensureAuthenticated, function(req, res) {
  Preset.find({}).exec(function (err, allPresetData){
    if (err) {
      console.log(err);
    }
    res.send(allPresetData); //sent as an array!
  });
});


//query parameter

presetRouter.post("/save_preset", ensureAuthenticated, function(req, res){
  Preset.create({ isPublic: true, ownerId: req.user.dbId, freqRange: req.body.freqRange, src: req.body.src, processing: req.body.processing, dst: req.body.processing, patchName: req.body.patchName}, function(err){
    if(err){
      console.log(err);
    }
    console.log("success! preset saved!");
    res.end();
  });
});

presetRouter.delete("/remove_preset", ensureAuthenticated, jsonParser, function(req, res){
  Preset.remove({patchName: req.body.patchName,
                 ownerId: req.body.userIdUrl}, function(err){
                  if(err){
                    console.log(err);
                  }
                  console.log("you removed a preset!");
                  res.end();
                  });
});


var presetRouter = module.exports = exports = express.Router();
var jsonParser = require("bodyParser").json;
var Preset = require(__dirname + "../../models/preset");
var User = require(__dirname + "../../models/user");
var mongoose = require("mongoose");


presetRouter.get("/get_preset", ensureAuthenticated, jsonParser, function(req, res){
  Preset.find({ownerId: req.userIdUrl || req.body.userIdUrl}, function(err, presetData){
    res.json(presetData);
  });
});

presetRouter.post("/save_preset", ensureAuthenticated, jsonParser, function(req, res){
  Preset.create({patchName: req.body.patchName}, function(err){
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


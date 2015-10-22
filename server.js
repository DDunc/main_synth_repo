var util = require('util');
var http = require('http');
var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
//requiring in what was in express 3 natively
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
var addToDb = require(__dirname + '/backend/lib/add_to_db');
var handleError = require(__dirname + '/backend/lib/handle_error');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/synth_dev');
var User = require(__dirname + "/models/user");
var Preset = require(__dirname + "/models/preset");
var presetRouter = require(__dirname + "/backend/routes/preset_routes");
var ensureAuthenticated = require(__dirname + "/backend/lib/ensureAuth");


var FacebookStrategy = require("passport-facebook");
<<<<<<< HEAD
=======
//var eventEmitter = require("events").EventEmitter;
//var ee = new EventEmitter();

//ee.emit('newUser', req, res){

//}
//var presetRouter = require(__dirname + '/backend/routes/users_routes');
>>>>>>> 29cdd6ccbebd524212a86d163bd74059c5475d43

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
// Get your codes here, put them in the .env file.
var port = process.env.PORT || 3000;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//FB strategy, verify function
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:" + port + "/auth/facebook/callback",
    enableProof: true
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //console.log(user);
      process.nextTick(function() {
        console.log(profile);
        return done(null, profile);
      });
  }
));

// Use the GoogleStrategy within Passport
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:" + port + "/auth/google/return"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, will need to be refactored
    //this next tick is allegedly uneccessary, will test without
    //TODO: seperate passport auth and usercreation, then use req.user info to make
    //the db
    process.nextTick(function () {
    //second argument gets added to req.user
      return done(null, profile);
  }
  )}));

var app = express();
app.use('/api', presetRouter);

/* app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */

// configure Express
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: 'helloNSA',
  resave: true,
  saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/build'));



app.get('/auth/facebook', passport.authenticate('facebook'),function(req, res){
  // The request will be redirected to Facebook for authentication, so
  // this function will not be called.
});

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
  process.nextTick(function() {
    findOrCreateUser(req, res, "facebookId");
  });
});

  //app.use(express.static(__dirname + '/src/html/login.html'));
//app.use('/api', usersRouter);
/* app.get('/', function(req, res){
  res.send({ user: req.user }); //with no user, sends empty object;
}); */

app.get('/account', ensureAuthenticated, function(req, res){
  res.send({ user: req.user });
});

/* app.get('/login', function(req, res){
  res.send({ user: req.user });
}); */

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
 app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.
app.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("res", res);
    process.nextTick(function() {
      findOrCreateUser(req, res, "googleId");
    });
  });

//helper function, can be moved to lib
function findOrCreateUser(req, res, stratId) {
  User.findOne({strat: req.user.id}, function(err, user) {
    if (err){
      return handleError(err, res);
    }
    if(user){
      req.dbId = user._id.toString();
      console.log(req.dbId);
      res.body.user = req.user;
      req.login();
      res.location("/");
      res.send({user: user})
      //res.send(user);
      //res.redirect("/")
    }
    if(!user) {
      var newUser = new User();
      req.dbId = newUser._id.toString();
      console.log("this is new user id " + newUser._id);
      newUser[stratId] = req.user.id;
      newUser.displayName = req.user.displayName;
      console.log(req.dbId);

      var newPreset = new Preset();
      newPreset.ownerId = req.dbId;
      newPreset.presetName = req.user.id + " space bass";
      newPreset.isPublic = true;
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
          //res.send(newUser);
          res.redirect("/");
        });
      });
    }
  });
}

//there i also a req.login request per https://github.com/jaredhanson/passport/blob/master/lib/http/request.js
app.get('/logout', function(req, res){
  console.log("logout successful");
  req.logout();
  console.log(req.user);
  res.redirect('/');
});

app.listen(port, function(){
  console.log("server is up on port " + port);
});

// Simple route middleware to ensure user is authenticated.
//  Use this function as middleware on any resource that needs to be protected.

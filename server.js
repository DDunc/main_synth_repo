var util = require('util');
var http = require('http');
var express = require('express');
var passport = require('passport');
var  GoogleStrategy = require('passport-google-oauth2').Strategy;
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
var Preset = require(__dirname + "/models.preset");
var presetRouter = require("backend/routes/preset_routes");


// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
// Get your codes here, put them in the .env file.
var port = process.env.PORT || 3000;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport
//   Strategies in Passport require a `verify` function, which accept
//   credentials and invoke a callback with a user object.
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
      console.log(profile);
     User.findOne({'googleId': profile.id}, function(err, user) {
      if (err){
        return handleError(err, res);
      }

      if(!user) {
        var newUser = new User();
        newUser.googleId = profile.id;
        newUser.displayName = profile.displayName;
        newUser.googleProfile = profile;
        newUser.save(function(err, user){
          if (err)
            console.log(err);
        });
      }
      //second argument gets added to req.user
      return done(null, profile);
    });
  }
  )};
));

var app = express();
app.use('/api', presetRouter);

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
  //app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send({ user: req.user }); //with no user, sends empty object;
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.send({ user: req.user });
});

app.get('/login', function(req, res){
  res.send({ user: req.user });
});

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
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this case, will redirect the user to the home page but display
//   the google profile object.
app.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(port, function(){
  console.log("server is up on port " + port);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
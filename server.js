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
var handleError = require(__dirname + '/backend/lib/handle_error');
//production mongoose
//mongoose.connect(process.env.MONGOLAB_URI );
//dev mongoose
mongoose.connect('mongodb://localhost/synth_dev');
var User = require(__dirname + "/models/user");
var Preset = require(__dirname + "/models/preset");
var presetRouter = require(__dirname + "/backend/routes/preset_routes");
var userRouter = require(__dirname + "/backend/routes/user_routes");
var ensureAuthenticated = require(__dirname + "/backend/lib/ensureAuth");
var findOrCreateUser = require(__dirname + "/backend/lib/find_or_create");
var FacebookStrategy = require("passport-facebook");
var baseURL = process.env.HEROKU_URL || "http://localhost:";

//var eventEmitter = require("events").EventEmitter;
//var ee = new EventEmitter();
//ee.emit('newUser', req, res){
//}

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
// Get your codes here, put them in the .env file.
var port = process.env.PORT || 3000;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

var passStrats = require("./backend/lib/pass_strats")
passStrats();

var app = express();
// configure Express
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
//for development only, use mongo-connect for actual solution
app.use(session({
  secret: 'helloNSA',
  resave: true,
  saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/build'));
app.use('/api', presetRouter);
app.use('/auth', userRouter);


app.listen(port, function(){
  console.log("I am staying awhile and listening on " + port);
});

// app.get('/auth/facebook', passport.authenticate('facebook'),function(req, res){
//   // The request will be redirected to Facebook for authentication, so
//   // this function will not be called.
// });

// app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
// function(req, res) {
//   process.nextTick(function() {
//     findOrCreateUser(req, res, "facebookId");
//   });
// });

//   //app.use(express.static(__dirname + '/src/html/login.html'));
// //app.use('/api', usersRouter);
// /* app.get('/', function(req, res){
//   res.send({ user: req.user }); //with no user, sends empty object;
// }); */

// app.get('/account', ensureAuthenticated, function(req, res){
//   console.log("account in, authenticated");
//   res.send({ user: req.user });
// });

// /* app.get('/login', function(req, res){
//   res.send({ user: req.user });
// }); */

// // GET /auth/google
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  The first step in Google authentication will involve
// //   redirecting the user to google.com.  After authorization, Google
// //   will redirect the user back to this application at /auth/google/callback
//  app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
//   function(req, res){
//     // The request will be redirected to Google for authentication, so this
//     // function will not be called.
//   });

// // GET /auth/google/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.
// app.get('/auth/google/return',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     console.log("res", res);
//     process.nextTick(function() {
//       findOrCreateUser(req, res, "googleId");
//     });
//   });

// //helper function, can be moved to lib

// //there i also a req.login request per https://github.com/jaredhanson/passport/blob/master/lib/http/request.js
// app.get('/logout', function(req, res){
//   console.log("logout successful");
//   req.logout();
//   //console.log(req.user);
//   res.redirect('/');
// });

// Simple route middleware to ensure user is authenticated.
//  Use this function as middleware on any resource that needs to be protected.

/* app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */

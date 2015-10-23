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
mongoose.connect(process.env.MONGOLAB_URI);
//dev mongoose
//mongoose.connect('mongodb://localhost/synth_dev');
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

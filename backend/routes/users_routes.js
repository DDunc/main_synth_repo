var express = require('express');
var User = require(__dirname + '/../../models/user');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var app = express();
var path = require('path');
var usersRouter = module.exports = exports = express.Router();
var passport = require('passport');

usersRouter.post('/login', jsonParser, function(req, res) {
  console.log(req);
  User.findOne({'googleId': req.user.id}, function(err, user) {
    if (err){
      return handleError(err, res);
    }

    if(!user) {
      var newUser = new User();
      newUser.googleId = req.user.id;
      newUser.displayName = req.user.displayName;
      newUser.googleProfile = req.user;
      newUser.save(function(err, user){
        if (err)
          console.log(err);
      });
    }
  });
});

usersRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

usersRouter.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("auth/google/return success!");
    res.redirect('/');
  });

usersRouter.get('/login',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });
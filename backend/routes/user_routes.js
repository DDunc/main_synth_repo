var express = require('express');
var User = require(__dirname + '/../../models/user');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var path = require('path');
var userRouter = module.exports = exports = express.Router();
var passport = require('passport');
var ensureAuthenticated = require(__dirname + '/../lib/ensureAuth');
var findOrCreateUser = require(__dirname + '/../lib/find_or_create');

userRouter.get('/facebook', passport.authenticate('facebook'),function(req, res){
  // The request will be redirected to Facebook for authentication, so
  // this function will not be called.
});

userRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
  process.nextTick(function() {
    findOrCreateUser(req, res, "facebookId");
  });
});

  //userRouter.use(express.static(__dirname + '/src/html/login.html'));
//userRouter.use('/api', userRoutersRouter);
/* userRouter.get('/', function(req, res){
  res.send({ userRouter: req.userRouter }); //with no userRouter, sends empty object;
}); */

userRouter.get('/account', ensureAuthenticated, function(req, res){
  console.log("account in, authenticated");
  res.send({ userRouter: req.userRouter });
});

/* userRouter.get('/login', function(req, res){
  res.send({ userRouter: req.userRouter });
}); */

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the userRouter to google.com.  After authorization, Google
//   will redirect the userRouter back to this userRouterlication at /auth/google/callback
 userRouter.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the userRouter will be redirected back to the
//   login page.
userRouter.get('/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("res", res);
    process.nextTick(function() {
      findOrCreateUser(req, res, "googleId");
    });
  });

//helper function, can be moved to lib

//there i also a req.login request per https://github.com/jaredhanson/passport/blob/master/lib/http/request.js
userRouter.get('/logout', function(req, res){
  console.log("logout successful");
  req.logout();
  //console.log(req.userRouter);
  res.redirect('/');
});
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
var port = process.env.PORT || 3000;
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var FacebookStrategy = require("passport-facebook");
var baseURL = process.env.HEROKU_URL || "http://localhost:";

module.exports = function(){
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
    callbackURL: baseURL + "/auth/facebook/callback",
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
    callbackURL: baseURL + "/auth/google/return"
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
  )}
));
}
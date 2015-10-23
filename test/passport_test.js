var chai = require("chai");
var expect = chai.expect;
var mongoose = require("mongoose");
process.env.MONGO_URL = 'mongodb://localhost/synth_dev';
var url = "localhost:3000/api";
require(__dirname + "../../server");
var User = require(__dirname + "../../models/user");
var Preset = require(__dirname + "../../models/preset");

var chai = require('chai');
chai.use(require('chai-passport-strategy'))
var FacebookStrategy = require("passport-facebook");

describe('fb strategy', function() {

  var strategy = new Strategy(function(token, done) {
    if (token == 'vF9dft4qmT') { 
      return done(null, { id: '1234' }, { scope: 'read' });
    }
    return done(null, false);
  });

  describe('handling a request with valid credential in header', function() {
    var user
      , info;

    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.headers.authorization = 'Bearer vF9dft4qmT';
        })
        .authenticate();
    });

    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal('1234');
    });

    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info.scope).to.equal('read');
    });
  });
});
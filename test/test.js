var chai = require("chai");
var expect = chai.expect;
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
var mongoose = require("mongoose");
process.env.MONGO_URL = 'mongodb://localhost/synth_dev';
var url = "localhost:3000/api";
require(__dirname + "../../server");
var User = require(__dirname + "../../models/user");
var Preset = require(__dirname + "../../models/preset");

describe('google auth', function() {
  after(function(done){
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to get google profile', function(done) {
    chai.request('localhost:3000')
      .get('/auth/google')
      .end(function(err, res) {
        expect(typeof(res.body)).to.eql("object");   
      });
      done();
  });
});

describe('facebook auth', function() {
  after(function(done){
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to get facebook profile', function(done) {
    chai.request('localhost:3000')
      .get('/auth/facebook')
      .end(function(err, res) {
        expect(typeof(res.body)).to.eql("object");   
      });
      done();
  });
});

describe('preset crud', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) throw err;
      done();
    });
  });

  before(function(done) {
    var preset = new Preset();
    preset.ownerId = '123';
    preset.presetName = 'test';
    preset.settings = {};
    preset.isPublic = true; 
    done();
  });

  it('should be able to get preset', function(done) {
    chai.request(url)
      .get('/api/get_preset')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(typeof(res.body)).to.eql("object");
        done();
      });
  });

  it('should be able to save preset', function(done) {
    chai.request(url)
      .post('/api/save_preset')
      .send({patchName: 'test'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.eql('test');
        done();
      });
  });

 // it('should be able to delete a preset', function(done) {
 //    chai.request(url)
 //      .delete('/api/remove_preset' + )
 //      .end(function(err, res) {
 //        expect(err).to.eql(null);
 //        expect(res.body.msg).to.eql('success');
 //        done();
 //      });
 // });

});
var chai = require("chai");
var expect = chai.expect;
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
var mongoose = require("mongoose");
process.env.MONGO_URL = 'mongodb://localhost/synth_dev';
var url = "localhost:3000/api";
require(__dirname + "../../server");
var User = require(__dirname + "../../models/user");

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
        expect(err).to.eql(null);
        expect(typeOf(res.body)).to.eql("object");   //passing dummy data?
        done();
      });
  });
});
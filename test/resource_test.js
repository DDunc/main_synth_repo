"use strict";

//testing for post save delete
var chai = require("chai");
var expect = chai.expect;
var chaihttp = require("chai-http");
var url = "localhost:3000/api";
process.env.MONGO_URL = "mongodb://localhost/synth_test";
var mongoose = require("mongoose");
var Preset = require("./../../models/preset");

chai.use(chaihttp);

require(__dirname + "./../server.js");

describe("preset resource get/post", function(){
  it("should return preset on get", function(done){
    chai.request(url)
      .get("/get_preset")
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
    });
  });

  it("should prevent unauthorized post requests", function(done){
    chai.request(url)
    .post("/save_preset")
    .send({ownerId: '12', patchName: 'unauthorized_person'})
    .end(function(err, res) {
      expect(!!err).to.eql(true);
      done();
    })
  })
  it("should save preset", function(done){
    chai.request(url)
      .post("/save_preset")
      .send({ownerId: '123', patchName: 'Czar Guitar'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.ownerId).to.eql('123');
        expect(res.body.patchName).to.eql('Czar Guitar');
        done();
    });
  });
  after(function(done){
    Preset.findOneAndRemove({patchName: 'Czar Guitar'}, function (err){
      if (err) throw err;
      done();
    });
  });

  describe('preset deletion', function(){
    before(function(done){
      var recId;
      var newPreset = new Preset({patchName:'deletetest'});
      recId = newPreset._id;
      newPreset.save(function(err,data){
        if (err) throw err;
        console.log(data)
        });
      });
    });
    it('should delete preset', function(done){
      chai.request(url)
        .delete('/preset/' + recId)
        .end(function(err, res){
            expect(err).to.eql(null);
            Preset.find({patchName:"deletetest"}, function(err, data){
              if (err) throw err;
              expect(data).to.deep.eql([]);
              done();
            });
        });
    });
  });

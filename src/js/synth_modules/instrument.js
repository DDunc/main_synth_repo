var keyArr = [];

//while (keyArr.length < 14)
var Key = function(el, soundSource) {

  // Web Audio Context, the Dom El and the soundSource
  this.el = el;
  this.soundSource = soundSource;
  this.noteName = soundSource.noteName;
  this.patchName = soundSource.patchName;
  this.freq = soundSource.osc.frequency.value;
  keyArr.push(this);
}

Key.prototype.touchStart = function (){
    this.el.addEventListener('touchstart', function(e){
    var keyId;
    if (e.target.className === 'key') {
      keyId = e.target.id.split('-')[1];
    }
    // start the sound (increase gain from 0 to 1)
    this.soundSource.start();
    console.log('gain: ', this.soundSource.gainNode.gain.value);
    // append new values to object
    sharedState.keys[keyId].active = true;
    sharedState.keys[keyId].startTime = new Date().getTime();
    sharedState.keys[keyId].endTime = null;
    sharedState.keys[keyId].duration = null;
  }.bind(this));
}
  // add event handlers
  //var self = this;

  // touch starts, set note to active, and calc start time

Key.prototype.touchEnd = function () {
    this.el.addEventListener('touchend', function(e){
    // turn sound off
    this.soundSource.stop();
    var keyId;
    if (e.target.className === 'key') {
      keyId = e.target.id.split('-')[1];
    }
    // when the keyboard key is released, push remaining data to sharedState object
    // get e.target.id and map to model index.
    sharedState.keys[keyId].active = false;
    sharedState.keys[keyId].endTime = new Date().getTime();
    sharedState.keys[keyId].duration = 
    sharedState.keys[keyId].endTime - 
    sharedState.keys[keyId].startTime;

  }.bind(this));
};


var Instrument = function(ctx) {

  // some Dom els
  // a keys model container
  // and a reference to shared sharedState object, 'sharedState'

  this.el = document.getElementById('instrument');
  this.keyElements = this.el.querySelectorAll('div');

  // model for Instrument - an array of key objects
  this.keys = window.sharedState.keys;
  var soundSource;
  for (var i=0; i<this.keyElements.length; i++) {
    soundSource = new Generator(ctx,scale[i]);
    this.keys['' + i] = new Key(this.keyElements[i], soundSource, sharedState);
  }
<<<<<<< HEAD


=======
  keyArr.forEach(function(key){
    key.touchStart();
    key.touchEnd();
  })
>>>>>>> 86436d177b84f1dc8dbf3028e791aea646aca49e
};



var Sequencer = function() {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');
  this.tempo = 500;
  this.bars = 8;
  this.play_handler;

  // model initialization
  this.pads = sharedState.pads;
  for (var i=0; i < this.pad_elements.length; i++) {
    // this new pad should have a ref to a dom element
    this.pads[''+i] = new Pad(this.pad_elements[i]);
  }
  // play function on start click
  var self = this;
  self.playButton.addEventListener('touchstart', function(e) {
    var i = 0;
    self.play_handler = setInterval(function() {
      console.log('beat %s', i);
      if (sharedState.pads[i].sounds.length) {
        console.log(sharedState.pads[i].sounds[0].soundSource);
        sharedState.pads[i].sounds[0].soundSource.playFor(self.duration);
        // loop through sounds and start them all
      }
      i = (i + 1)%8;
    }.bind(self), 500);
  });

  // stop function on stop button click/touch
  this.stopButton.addEventListener('touchstart', function(e) {
    clearInterval(self.play_handler);
  });

};

var Pad = function(el) {

  this.el = el;
  this.sounds = [];
  this.writeMode = false;

  // event Handlers
  var self = this;
  this.el.addEventListener('touchstart', function(e) {

    var padId;
    if (e.target.className.split(' ')[0] === 'pad') {
      padId = e.target.id.split('-')[1];

      // if pad write mode is on, but going to off
      if (window.sharedState.pads[padId].writeMode) {

        // get active keys
        var active_keys = [];
        for (var key in sharedState.keys) {
          if (window.sharedState.keys[key].duration) sharedState.pads[padId].sounds.push({
            duration: sharedState.keys[key].duration,
            patchName: sharedState.keys[key].patchName,
            freq: sharedState.keys[key].patchName,
            soundSource: sharedState.keys[key].soundSource,

          });
        }
        // push active keys
        //if (key.active) window.sharedState.pads[padId].sounds.push(window.sharedState.keys['A0']);
      }
     sharedState.pads[padId].writeMode = !sharedState.pads[padId].writeMode;
      console.log("write mode for pad # %s is %s", padId, (window.sharedState.pads[padId].writeMode) ? 'on.' : 'off.');
    }
  });

};


// main initialization code
// requires instrumentModule import first!!!

var ctx = ctx || new AudioContext();
var scale = generateScale(440);

sharedState = {

  keys: {}, // keys currently held down
  pads: {}, // pads in write mode

};

var instrument = new Instrument(ctx);
var sequencer = new Sequencer();

var Key = function(el, soundSource) {

  // Web Audio Context, the Dom El and the soundSource 
  this.el = el;
  this.soundSource = soundSource; 
  this.noteName = soundSource.noteName;

  // add event handlers
  var self = this; 

  // touch starts, set note to active, and calc start time
  self.el.addEventListener('touchstart', function(e){

    // start the sound (increase gain from 0 to 1)
    self.soundSource.start();
    console.log('gain: ', self.soundSource.gainNode.gain.value);
    // append new values to object
    window.sharedState.keys[self.noteName].active = true;
    window.sharedState.keys[self.noteName].startTime = new Date().getTime();
    window.sharedState.keys[self.noteName].endTime = null;
    window.sharedState.keys[self.noteName].duration = null;

  });

  self.el.addEventListener('touchend', function(e){

    // turn sound off 
    self.soundSource.stop();
    console.log('gain: ', self.soundSource.gainNode.gain.value);

    // when the keyboard key is released, push remaining data to sharedState object
    // get e.target.id and map to model index.
    window.sharedState.keys[self.noteName].active = false;
    window.sharedState.keys[self.noteName].endTime = new Date().getTime();
    window.sharedState.keys[self.noteName].duration = 
      window.sharedState.keys[self.noteName].endTime - 
      window.sharedState.keys[self.noteName].startTime;
    console.log(window.sharedState.keys[self.noteName]);

    // and stop the sound
    self.soundSource.stop();

  });
};

var Instrument = function(ctx) {

  // some Dom els
  // a keys model container 
  // and a reference to shared sharedState object, 'sharedState' 

  this.el = document.getElementById('instrument');
  this.keyElements = this.el.querySelectorAll('div');

  // model for Instrument - an array of key objects
  this.keys = [];
  var soundSource;
  for (var i=0; i<this.keyElements.length; i++) {
    soundSource = new Generator(ctx,scale[i]); 
    this.keys[soundSource.noteName] = new Key(this.keyElements[i], soundSource, window.sharedState);
  }
  // bind soundSource to shared state on window
  window.sharedState.keys = this.keys;

};


var Sequencer = function() {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');

  // model initialization
  this.pads = [];
  for (var i = 0; i < this.pad_elements.length; i++) {
    // this new pad should have a ref to a dom element
    this.pads.push(new Pad(window.sharedState, this.pad_elements[i]));
  }

  // event Handlers
  var self = this;
  this.toggleWrite = function(e) {

    var padId;
    if (e.target.className.split(' ')[0] === 'pad') {
      padId = e.target.id.split('-')[1];

      // if pad write mode is on, but going to off
      if (self.pads[padId].writeMode) {

        // push active keys
        window.sharedState.keys.forEach(function(key){
          //console.log(key);
          if (key.active) self.pads[padId].sounds.push('abc');
        }.bind(self));
        // wipe old keys
       // sharedState.keys = [];
        
      }
      self.pads[padId].writeMode = !self.pads[padId].writeMode;
      console.log("write mode for pad # %s is %s", padId, (self.pads[padId].writeMode) ? 'on.' : 'off.');
    }
  };

  self.el.addEventListener('touchstart', self.toggleWrite);

};

var Pad = function(sharedState, el) {
  this.el = el;
  this.sharedState = sharedState;
  this.sounds = [];
  this.writeMode = false;
};


// main initialization code
// requires instrumentModule import first!!!

var ctx = ctx || new AudioContext();
var scale = generateScale(440); 

window.sharedState = {

  keys: [], // keys currently held down
  pads: [], // pads in write mode

};

var instrument = new Instrument(ctx);
var sequencer = new Sequencer();

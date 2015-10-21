var Key = function(el, soundSource, sharedState) {

  // Web Audio Context, the Dom El and the soundSource 
  this.el = el;
  this.sharedState = sharedState;
  this.soundSource = soundSource; 
  this.noteName = this.soundSource.noteName;

  // add event handlers
  var self = this; 

  // touch starts, set note to active, and calc start time
  self.el.addEventListener('touchstart', function(e){

    // start the sound (increase gain from 0 to 1)
    self.soundSource.start();
    console.log('gain: ', self.soundSource.gainNode.gain.value);
    self.sharedState.keys[self.noteName] = {};
    self.sharedState.keys[self.noteName].active = true;
    self.sharedState.keys[self.noteName].startTime = new Date().getTime();
    self.sharedState.keys[self.noteName].endTime = null;
    self.sharedState.keys[self.noteName].duration = null;

  });

  self.el.addEventListener('touchend', function(e){

    // turn sound off 
    self.soundSource.stop();
    console.log('gain: ', self.soundSource.gainNode.gain.value);

    // when the keyboard key is released, push remaining data to sharedState object
    // get e.target.id and map to model index.
    self.sharedState.keys[self.noteName].active = false;
    self.sharedState.keys[self.noteName].endTime = new Date().getTime();
    self.sharedState.keys[self.noteName].duration = 
      self.sharedState.keys[self.noteName].endTime - 
      self.sharedState.keys[self.noteName].startTime;

    // and stop the sound
    self.soundSource.stop();

    console.log(self.sharedState.keys[self.noteName]);
  });
};


var Instrument = function(sharedState, ctx) {

  // some Dom els
  // a keys model container 
  // and a reference to shared sharedState object, 'sharedState' 

  this.el = document.getElementById('instrument');
  this.keyElements = this.el.querySelectorAll('div');

  // model for Instrument - an array of key objects
  this.keys = [];
  for (var i=0; i<this.keyElements.length; i++) {
    this.keys[i] = new Key(this.keyElements[i], new Generator(ctx,scale[i]),sharedState);
  }

  // put keys on shared state
  sharedState.keys = this.keys;

};


var Sequencer = function(sharedState) {

  this.sharedState = sharedState; 

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');

  // model initialization
  this.pads = [];
  for (var i = 0; i < this.pad_elements.length; i++) {
    // this new pad should have a ref to a dom element
    this.pads.push(new Pad(this.sharedState, this.pad_elements[i]));
  }
  this.sharedState.pads = this.pads;

  // event Handlers
  var self = this;
  this.toggleWrite = function(e) {

    var padId;
    if (e.target.className.split(' ')[0] === 'pad') {
      padId = e.target.id.split('-')[1];

      // if pad write mode is on, but going to off
      if (self.pads[padId].writeMode) {

        // push active keys
        self.sharedState.keys.forEach(function(key){
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

var sharedState = {

  keys: {}, // keys currently held down
  pads: [], // pads in write mode

};

var instrument = new Instrument(sharedState, ctx);
var sequencer = new Sequencer(sharedState);

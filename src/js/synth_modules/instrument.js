var Key = function(el, soundSource, sharedState) {

  // Web Audio Context, the Dom El and the soundSource 
  this.el = el;
  this.sharedState = sharedState;
  this.soundSource = soundSource; 
  this.noteName = this.soundSource.noteName;

  
  // add event handlers
  var self = this; // sorry [:

  self.el.addEventListener('touchstart', function(e){
    self.soundSource.start();
    console.log(self.soundSource.gainNode.gain.value);

    var idParts = e.target.id.split('-');
    if (idParts[0] !== 'pad' || !idParts[1]) return false; 

    var id = idParts[1]; 


    // 
    var key = {};
    self.sharedState.keys[self.noteName] = key;
    key.active = true;
    key.startTime = new Date().getTime();
    key.endTime = null;
    key.duration = null;

    // and start the sound (increase gain from 0 to 1)

  });

  self.el.addEventListener('touchend', function(e){
    self.soundSource.stop();
    console.log('gain: ', self.soundSource.gainNode.gain.value);

    var idParts = e.target.id.split('-');
    if (idParts[0] !== 'pad' || !idParts[1]) return false; 

    var id = idParts[1]; 

    // when the keyboard key is released, push remaining data to sharedState object
    var key = self.sharedState.keys[self.noteName] = {};
    key.active = false;
    key.endTime = new Date().getTime();
    key.duration = key.endTime - key.startTime;

    // and stop the sound
    self.soundSource.stop();

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

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');

  // model initialization
  this.pads = [];
  for (var i = 0; i < this.pad_elements.length; i++) {
    var padId = this.pad_elements[i].id.split('-')[1];
    this.pads[i] = new Pad(sharedState, padId);
  }
  sharedState.pads = this.pads;

  // event Handlers
  this.toggleWrite = function(e) {
    var padId;
    if (e.target.className.split(' ')[0] === 'pad') {
      padId = e.target.id.split('-')[1];

      // if pad write mode is on, but going to off
      if (this.pads[padId].writeMode) {

        // push active keys
        sharedState.keys.forEach(function(key){
          if (key.active) this.pads[padId].sounds.push('abc');
        }.bind(this));
        // wipe old keys
       // sharedState.keys = [];
        
      }
      this.pads[padId].writeMode = !this.pads[padId].writeMode;
      console.log(this.pads[padId].writeMode);
    }
  }.bind(this);

  this.el.addEventListener('touchstart', this.toggleWrite);

};

var Pad = function(sharedState,id) {
  this.sounds = [];
  this.id = id;
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

var keyArr = [];

var Key = function(el, note) {

  // Web Audio Context, the Dom El and the note
  this.el = el;
  this.note = note;
  this.noteName = note.noteName;
  this.patchName = note.patchName;
  this.freq = note.frequency.value;
  keyArr.push(this);

};

Key.prototype.touchStart = function (){
    this.el.addEventListener('touchstart', function(e){
    var keyId;
    if (e.target.className === 'key') {
      keyId = e.target.id.split('-')[1];
    }
    // start the sound (increase gain from 0 to 1)
    this.note.start();
    console.log('gain: ', this.note.volume);
    // append new values to object
    sharedState.keys[keyId].active = true;
    sharedState.keys[keyId].startTime = new Date().getTime();
    sharedState.keys[keyId].endTime = null;
    sharedState.keys[keyId].duration = null;
  }.bind(this));
};

Key.prototype.touchEnd = function () {
    this.el.addEventListener('touchend', function(e){
    this.note.stop();
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

  this.el = document.getElementById('instrument');
  this.exportButton = document.getElementById('exportButton');
  this.volumeSlider = document.getElementById('volumeSlider');
  this.keyElements = this.el.querySelectorAll('div');

  // a keys model container
  // and a reference to shared sharedState object, 'sharedState'
  // model for Instrument - an array of key objects
  this.keys = window.sharedState.keys;
  var note;
  for (var i=0; i<this.keyElements.length; i++) {
    note = new BaseSynth(ctx,scale[i], delayBetterAudioGraph); // no 3rd arg means default synth
    this.keys['' + i] = new Key(this.keyElements[i], note, sharedState);
  }
  keyArr.forEach(function(key){
    key.touchStart();
    key.touchEnd();
  });
};

Instrument.prototype.adjustVolume = function() {
  this.volumeSlider.addEventListener('change', function(e) {
    var newVolume = e.target.value/100;
    console.log(newVolume);
    for (var key in this.keys) {
      this.keys[key].note.volume = newVolume;
    }

  }.bind(this));
};

Instrument.prototype.exportInstrumentSettings = function() {

  var settings = this.keys[0]; 

  this.exportButton.addEventListener('touchstart', function(e) {
    window.instrumentExport = {
      patchName : settings.patchName,
      freqRange: {
        min : 440,
        max : 880,
      }, 
    };  
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
            note: sharedState.keys[key].note,

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
instrument.exportInstrumentSettings();
instrument.adjustVolume();

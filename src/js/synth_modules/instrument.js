// requires instrumentModule import first!!!

var ctx = ctx || new AudioContext();
var scale = generateScale(440); 

var state = {

  active_keys: {}, // keys currently held down
  active_pads: [{'1':true}], // pads in write mode
  writeToPad : function(pad, data){
  }


};

var Instrument = function(state) {

  this.el = document.getElementById('instrument');
  this.keys = [];
  this.keyElements = this.el.querySelectorAll('div');
  for (var i=0; i<this.keyElements.length; i++) {
    this.keys[i] = new Key(ctx, this.keyElements[i], 'A4', new Generator(ctx,scale[i]), state); 
  }

};

var Key = function(ctx, el, note, soundSource, state) {

  this.el = el;
  this.note = note;
  this.soundSource = soundSource; 

  this.checkPads = function() {
    // read active pads from state
  };

  this.el.addEventListener('touchstart', function(){

    state.active_keys[this.soundSource.noteName] = {
      startTime: new Date().getTime(),
      endTime: null,
    };

    this.soundSource.start();

  }.bind(this));

  this.el.addEventListener('touchend', function(){
    if (Object.keys(state.active_pads).length) {
    }
    state.active_keys[this.soundSource.noteName].endTime = new Date().getTime();
    this.soundSource.stop();

  }.bind(this));
   
};

var Sequencer = function(state) {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');
  this.writeEnabled = true;

  // model initialization
  this.pads = [];
  for (var i = 0; i < this.pads.length; i++) {
    this.pads[i] = new Pad(state);
  }

  // event Handlers
  var toggleWrite = function() {
    this.writeEnabled = !this.writeEnabled;
  };
  var getPlayedNotes = function() {
    //
  };

  this.el.addEventHandler('touchstart', toggleWrite);
  this.el.addEventHandler('touchend', getPlayedNotes);


};

Sequencer.prototype.play = function() {
};

Sequencer.prototype.stop = function() {
};

Sequencer.prototype.record = function() {
  // not implemented
};


var Pad = function(state) {
  this.sounds = [];
};

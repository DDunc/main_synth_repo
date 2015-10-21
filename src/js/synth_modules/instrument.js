// requires instrumentModule import first!!!

var ctx = ctx || new AudioContext();
var scale = generateScale(440); 

var state = {

  keys: {}, // keys currently held down
  pads: [], // pads in write mode

};

var Instrument = function(state) {

  this.el = document.getElementById('instrument');
  this.keys = [];
  this.keyElements = this.el.querySelectorAll('div');
  for (var i=0; i<this.keyElements.length; i++) {
    this.keys[i] = new Key(ctx, this.keyElements[i], 'A4', new Generator(ctx,scale[i]), state); 
  }
  state.keys = this.keys;

};

var Key = function(ctx, el, note, soundSource, state) {

  this.el = el;
  this.note = note;
  this.soundSource = soundSource; 
  this.el.addEventListener('touchstart', function(){
    state.keys[this.soundSource.noteName] = {
      id: this.el.id.split('-')[1],
      startTime: new Date().getTime(),
      duration: null,
    };
    this.soundSource.start();
  }.bind(this));

  this.el.addEventListener('touchend', function(){
    state.keys[this.soundSource.noteName].duration = new Date().getTime() - state.keys[this.soundSource.noteName].startTime;
    this.soundSource.stop();
    console.log(state.keys[this.soundSource.noteName]);
  }.bind(this));
};

var Sequencer = function(state) {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');

  // model initialization
  this.pads = [];
  for (var i = 0; i < this.pad_elements.length; i++) {
    var padId = this.pad_elements[i].id.split('-')[1];
    this.pads[i] = new Pad(state, padId);
  }
  state.pads = this.pads;

  // event Handlers
  var toggleWrite = function(e) {
    var padId;
    if (e.target.className.split(' ')[0] === 'pad') {
      padId = e.target.id.split('-')[1];
      this.pads[padId].writeMode = this.pads[padId].writeMode ? false : true;
      console.log(this.pads[padId].writeMode);
    }
  }.bind(this);

  var getPlayedNotes = function() {

  };

  this.el.addEventListener('touchstart', toggleWrite);

};

var Pad = function(state,id) {
  this.sounds = [];
  this.id = id;
  this.writeMode = false;
};

var instrument = new Instrument(state);
var sequencer = new Sequencer(state);

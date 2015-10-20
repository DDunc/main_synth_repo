// requires instrumentModule import first!!!

var ctx = ctx || new AudioContext();
var scale = generateScale(440); 

var Instrument = function(Sequencer) {

  this.el = document.getElementById('instrument');
  this.keys = [];
  this.keyElements = this.el.querySelectorAll('div');
  this.depressed_keys = {'A4':true}; // holds key name frequency and time start

  for (var i = 0; i < this.keyElements.length ; i++) {
    this.keys[i] = new Key(ctx, this.keyElements[i], 'A4', new Generator(ctx,scale[i]), this.depressed_keys, this);  
  }
  this.sequencer = new Sequencer(this.depressed_keys);

};

var Key = function(ctx, el, note, soundSource, depressed_keys, parent) {

  this.parent = parent;
  this.el = el;
  this.note = note;
  this.depressed_keys = depressed_keys;
  this.soundSource = soundSource; 

  this.checkPads = function() {
    var activePads = this.sequencer.pads.filter(function(pad){
      return pad.writeMode;
    });
    console.log('there are %d pads in writeMode', activePads.length);
    return activePads;

  };

  this.el.addEventListener('touchstart', function(){
    if (this.parent.sequencer.checkPads().length) {
      
    }

    this.depressed_keys[soundSource.noteName] = {noteStart: new Date().getTime()};
    this.soundSource.start();
  }.bind(this));

  this.el.addEventListener('touchend', function(){
    this.soundSource.stop();
  }.bind(this));
   
};

var Sequencer = function(depressed_keys) {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');
  this.depressed_keys = depressed_keys;

  // data model 
  this.pads = [];
  
  // EVENT HANDLERS
  // keeping tabs on sequencer pads to know when to write

  // event listeners, delegation
  
  var toggleWriteMode = function(e) {
    // when we touch a pad, write mode is set on that pad only
    // a synth sound is written to all active pads
    if (e.target.className.split(' ')[0] === 'pad') {
      var padIndex = e.target.innerHTML;
      this.pads[padIndex].writeMode = !this.pads[padIndex].writeMode; 
      e.target.className = (this.pads[padIndex].writeMode) ? 'pad active' : 'pad inactive';

    }
  };


  // each pad is an array of sounds
  for (var i = 0; i < this.pad_elements.length ; i++) {
    this.pads[i] = {
      writeMode: false,
      el:     this.pad_elements[i],
      soundObjects:  [],
    };  
  }

  // events
  // delegation to each pad
  this.el.addEventListener('touchstart', toggleWriteMode.bind(this));
  // play and stop
  this.playButton.addEventListener(this.play);
  this.stopButton.addEventListener(this.stop);

  this.beats = [,,,,,,,,]; 
  this.tempo = 500;
  this.playing = false;

};

Sequencer.prototype.writeNote = function() {
  // when we write a note, we copy the instrument value metadata to the array
  this.synth.depressed_keys;
};

Sequencer.prototype.stop = function() {

};

Sequencer.prototype.play = function() {
  this.playing = true;
  this.currentBeat = 0;

  var play = setInterval(function(){
    this.currentBeat = (this.currentBeat + 1) % this.beats.length;
    console.log('beat %s', (this.currentBeat || 8));
  }.bind(this), this.tempo);

  this.stopButton.addEventListener('click', function(){
    play.cancelTimeout();
  }.bind(this));

};


var instrument = new Instrument(Sequencer);

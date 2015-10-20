// requires instrumentModule import first!!!

var ctx = ctx || new AudioContext();
var scale = generateScale(440); 

var Instrument = function() {
  this.el = document.getElementById('instrument');
  this.key_elements = this.el.querySelectorAll('div');
  this.depressed_keys = {}; // holds key name and time start
  this.keys = [];
  for (var i = 0, step = 440; i < this.key_elements.length ; i++) {
    this.keys[i] = new Key(ctx, this.key_elements[i], 'A4', new Generator(ctx,scale[i]));  
  }
};

var Key = function(ctx, el, note, generator) {

  this.el = el;
  this.note = note;

  this.generator = generator; 
  this.manualTrigger = function(timeInterval) {
    var f = setTimeOut(function(){
      this.gainNode.gain.value = 1;
    }.bind(this),timeInterval);
    f.clearTimeout();

  };

  this.el.addEventListener('touchstart', function(){
    this.generator.start();
  }.bind(this));

  this.el.addEventListener('touchend', function(){
    this.generator.stop();
  }.bind(this));
   
};

var Sequencer = function() {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');
  this.writeMode = false;

  // sequencer model 
  this.pads = [];

  // event listeners, delegation
  // when we touch a pad 
  this.el.addEventListener('touchstart', function(e) {
    if (e.target.className === 'pad') {
      this.writeMode = true;
      console.log('pad write mode is ', (this.writeMode) ? 'on' : 'off');
      console.log(e.target.innerHTML);
    }
  }.bind(this));
  // when we let go of a pad 
  this.el.addEventListener('touchend', function(e) {
    if (e.target.className === 'pad') {
      this.writeMode = false;
      console.log('pad write mode is ', (this.writeMode) ? 'on' : 'off');
      console.log(e.target.innerHTML);
    }
  }.bind(this));

  // each pad is an array of sounds
  for (var i = 0; i < this.pad_elements.length ; i++) {
    this.pads[i] = {
      el:     this.pad_elements[i],
      notes:  [],
    };  
  }

  // set event listeners on each pad
  //

  // events
  this.playButton.addEventListener(this.play);
  this.stopButton.addEventListener(this.stop);

  this.beats = [,,,,,,,,]; 
  this.tempo = 500;
  this.playing = false;

};

Sequencer.prototype.writeNote = function() {
  // when we write a note, we copy the instrument value metadata to the array
  this.pads.push(this.instrument.depressed_keys);
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



var sequencer = new Sequencer();
var instrument = new Instrument(ctx, sequencer);

// requires instrumentModule import first!!!

var ctx = ctx || new AudioContext();
var scale = generateScale(440); 

var Instrument = function(Sequencer) {

  this.el = document.getElementById('instrument');
  this.keys = [];
  this.key_elements = this.el.querySelectorAll('div');
  this.depressed_keys = {'A4':true}; // holds key name frequency and time start

  for (var i = 0; i < this.key_elements.length ; i++) {
    this.keys[i] = new Key(ctx, this.key_elements[i], 'A4', new Generator(ctx,scale[i]), this.depressed_keys);  
  }
  this.sequencer = new Sequencer(this.depressed_keys);

};

var Key = function(ctx, el, note, generator, depressed_keys) {

  this.el = el;
  this.note = note;

  this.depressed_keys = depressed_keys;
  this.generator = generator; 
  this.manualTrigger = function(timeInterval) {
    var f = setTimeOut(function(){
      this.gainNode.gain.value = 1;
    }.bind(this),timeInterval);
    f.clearTimeout();

  };

  this.el.addEventListener('touchstart', function(){
    // PICK UP HERE
    this.depressed_keys['A4'] = generator.noteName;
    this.generator.start();
  }.bind(this));

  this.el.addEventListener('touchend', function(){
    this.generator.stop();
  }.bind(this));
   
};

var Sequencer = function(depressed_keys) {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');
  this.depressed_keys = depressed_keys;

  // sequencer model 
  this.pads = [];
  
  // keeping tabs on sequencer pads to know when to write
  this.checkPads = function() {
    var active_pads = this.pads.filter(function(pad){
      return pad.writeMode;
    });
    console.log('there are %d pads in writeMode', active_pads.length);
  };


  // event listeners, delegation
  
  var toggleWriteMode = function(e) {
    // when we touch a pad, write mode is set on that pad only
    // a synth sound is written to all active pads
    if (e.target.className === 'pad') {
      var padIndex = e.target.innerHTML;
      this.pads[padIndex].writeMode = !this.pads[padIndex].writeMode; 
      console.log('pad %s write mode is %s ', padIndex, (this.pads[padIndex].writeMode) ? 'on' : 'off');
    }
  };


  this.el.addEventListener('touchstart', toggleWriteMode.bind(this));
  // each pad is an array of sounds
  for (var i = 0; i < this.pad_elements.length ; i++) {
    this.pads[i] = {
      writeMode: false,
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

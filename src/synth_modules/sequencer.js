var basicSynth = new Synth(ctx);

var Sequencer = function(synth) {

  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');

  this.synth = synth;
  this.playButton.addEventListener(this.play);
  this.beats = [,,,,,,,,]; 
  this.tempo = 500;
  this.playing = false;

};

Sequencer.prototype.writeNote = function(note, beat) {

};

Sequencer.prototype.play = function() {
  this.playing = true;
  this.currentBeat = 0;

  var play = setInterval(function(){
    this.currentBeat = (this.currentBeat + 1) % this.beats.length;
    console.log('beat %s', (this.currentBeat || 8));
  }.bind(this), this.tempo);

  this.stopButton.addEventListener('click', function(){
    cancel(play);
  }.bind(this));

};

var sequencer = new Sequencer(basicSynth);

// one note per beat for now
sequencer.beats[0] = {
  patch    : 'spaceBass', 
  gain     :  1,
  duration : 100,
};

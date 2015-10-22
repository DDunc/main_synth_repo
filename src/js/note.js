var Note = function(ctx, frequency) {

  this.ctx = ctx;
  this.patchName = 'spaceBass';
  this.noteName = 'A0';
  this.frequency = frequency;
  this.volume = 0.3;

};

Note.prototype.start = function(time) {

  this.osc = this.ctx.createOscillator();
  this.osc.frequency.value = this.frequency;
  this.gainNode = this.ctx.createGain();
  this.osc.connect(this.gainNode);
  this.gainNode.connect(this.ctx.destination);
  this.gainNode.gain.value = this.volume;
  this.osc.start(time | this.ctx.currentTime);

};

Note.prototype.stop = function(time) {
  this.osc.stop(time | this.ctx.currentTime);
};

Note.prototype.export = function() {
  window.synthExport = {
    patchName : this.patchName, 
    freqRange: {
        min: 440,
        max: 880
    },
    src: 'oscillator',
    processing: ['gain'], 

  };
};

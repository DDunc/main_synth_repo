
// for each key, a new generator is created with a frequency that is generated
// by the equally tempered scale generator

// the oscillator starts when the sound is created, but the gain is initially 0

var Generator = function(ctx, frequency) {
  this.patchName = 'spaceBass';
  this.noteName = 'A0';
  this.osc = ctx.createOscillator();
  this.osc.frequency.value = frequency;
  this.gainNode = ctx.createGain();
  this.osc.connect(this.gainNode);
  this.gainNode.connect(ctx.destination);
  this.gainNode.gain.value = 0;
  this.osc.start(0);
};

Generator.prototype.start = function() {
  this.gainNode.gain.value = 1;
};

Generator.prototype.stop = function() {
  this.gainNode.gain.value = 0;
};

Generator.prototype.export = function() {
  return JSON.stringify({
    username: 'al_420_jesusBlunt',
    patchName : this.patchName, 
    freqRange: {
        min: 440,
        max: 880
    },
    src: 'oscillator',
    processing: ['gain'], 

  });
};


/*
 * 
 *
 *
 */

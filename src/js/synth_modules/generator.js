
// for each key, a new generator is created with a frequency that is generated
// by the frequency generator

var Generator = function(ctx, frequency) {
  this.name = 'default';
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

Generator.prototype.getTone = function() {

};

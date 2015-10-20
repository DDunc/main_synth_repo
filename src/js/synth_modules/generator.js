
// for each key, a new generator is created with a frequency that is generated
// by the frequency generator


var Generator = function(ctx, frequency) {
  this.name = 'default';
  this.osc = ctx.createOscillator();
  this.osc.frequency.value = frequency;
  this.gainNode = ctx.createGain();
  this.osc.connect(this.gainNode);
  this.gainNode.connect(ctx.destination);
  this.gainNode.gain.value = 0;
};

Generator.prototype.start = function() {
  this.osc.start(0);
};

Generator.prototype.play = function() {
  this.start();
  this.gainNode.gain.value = 1;
};

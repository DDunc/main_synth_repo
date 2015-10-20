var synthesis = function(ctx, frequency) {
  this.osc = ctx.createOscillator();
  this.osc.frequency.value = frequency;
  this.gainNode = ctx.createGain();
  this.osc.start(0);
  this.osc.connect(this.gainNode);
  this.gainNode.connect(ctx.destination);
  this.gainNode.gain.value = 0;
};



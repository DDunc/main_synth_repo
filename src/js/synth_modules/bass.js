var bassAudioGraph = function() {

  // create nodes and set values
  console.log('Loaded delayAudioGraph Patch', this.name);

  this.osc = this.ctx.createOscillator();
  this.osc.frequency.value = this.frequency/4;

  this.gainNode = this.ctx.createGain();
  this.gainNode.gain.value = this.volume;

  // connect osc to gain node
  this.osc.connect(this.gainNode);
  this.gainNode.connect(this.ctx.destination);

};


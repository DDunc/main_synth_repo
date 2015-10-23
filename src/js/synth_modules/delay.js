var delayAudioGraph = function() {

  // create nodes and set values
  console.log('Loaded delayAudioGraph Patch', this.name);

  this.osc = this.ctx.createOscillator();
  this.osc.frequency.value = this.frequency;

  this.gainNode = this.ctx.createGain();
  this.gainNode.gain.value = this.volume;

  this.delay1 = this.ctx.createDelay();
  this.delay1.delayTime.value = 0.05; 


  // connect osc to gain node
  this.osc.connect(this.gainNode);
  this.osc.connect(this.ctx.destination);

  // connect gain node to the delay 
  this.gainNode.connect(this.delay1);

  // connect delay to the destination
  this.delay1.connect(this.ctx.destination);
};


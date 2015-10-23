var ctx = ctx || new AudioContext();

var BaseSynth = function(ctx, frequency, audioGraphConstructor) {

  this.ctx = ctx;
  this.patchName = 'spaceBass';
  this.frequency = frequency;
  this.volume = 0.3;

  // instantiater passes in function that builds the audio graph/pipeline
  this.defaultAudioGraph = function() {

    console.log('Loaded Default Synth Patch');
    this.osc = this.ctx.createOscillator(); 
    this.osc.type = 'square';
    this.osc.frequency.value = this.frequency;

    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.3;

    this.osc.connect(this.gain);
    this.gain.connect(this.ctx.destination);
  };

  this.audioGraph = audioGraphConstructor || defaultAudioGraph;

};

BaseSynth.prototype.start = function(time) {

  this.audioGraph();
  this.osc.start(time | this.ctx.currentTime);

};

BaseSynth.prototype.stop = function(time) {
  this.osc.stop(time | this.ctx.currentTime);
};

BaseSynth.prototype.export = function() {
  window.synthExport = {
    src: 'oscillator',
    volume: this.volume,
  };
};

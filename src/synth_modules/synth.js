var ctx = new AudioContext();

var soundConfig = function(ctx, frequency) {
  this.osc = ctx.createOscillator();
  this.osc.frequency.value = frequency;
  this.gainNode = ctx.createGain();
  this.osc.start(0);
  this.osc.connect(this.gainNode);
  this.gainNode.connect(ctx.destination);
  this.gainNode.gain.value = 0;
};

var Key = function(ctx, el, note, frequency, soundConfig) {

  this.el = el;
  this.note = note;

  this.soundConfig = soundConfig;
  this.soundConfig(ctx, frequency);
  this.manualTrigger = function(timeInterval) {
    var f = setTimeOut(function(){
      this.gainNode.gain.value = 1;
    }.bind(this),timeInterval);
    f.clearTimeout();

  };

  this.el.addEventListener('touchstart', function(){
    this.gainNode.gain.value = 1;
  }.bind(this));

  this.el.addEventListener('touchend', function(){
    this.gainNode.gain.value = 0;
  }.bind(this));
   
};

var Synth = function(ctx) {
  this.el = document.getElementById('synth');
  this.key_elements = this.el.querySelectorAll('div');
  this.depressed_keys = {};
  this.keys = [];
  for (var i = 0, step = 440; i < this.key_elements.length ; i++) {
    this.keys[i] = new Key(ctx, this.key_elements[i], 'A4', step + (120*i), soundConfig);  
  }
};

var synth = new Synth(ctx);

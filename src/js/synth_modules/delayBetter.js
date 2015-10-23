var delayBetterAudioGraph = function() {

    this.osc = this.ctx.createOscillator();
    this.osc.frequency.value = this.frequency/2;

    this.delay = this.ctx.createDelay();
    this.delay.delayTime.value = 0.5;

    this.feedback = this.ctx.createGain();
    this.feedback.gain.value = 0.8;

    this.filter = this.ctx.createBiquadFilter();
    this.filter.frequency.value = 1000;

    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.filter.connect(this.delay);

    this.osc.connect(this.delay);
    this.osc.connect(this.ctx.destination);
    this.delay.connect(this.ctx.destination);
};


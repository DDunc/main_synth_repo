this.BitCrusher = this.BitCrusher || {};

(function() {

	var AudioEngine = function(context) {this.$init(context);};

	var p = AudioEngine.prototype;

	p.$init = function(context) {

		this.osc1 = new BitCrusher.SineWaveOscillator();

		this.octave = 0;

		var targ = this;
		this.x = 0;
		this.context = context;
		this.node = context.createScriptProcessor(1024, 1, 1);
		this.node.onaudioprocess = function(e) {
			targ.process(e);
		};


		this.source_node = context.createBufferSource();


		this.analyzer = context.createAnalyser();
		this.analyzer.fftSize = 2048; // 2048-point FFT
		this.node.connect(this.analyzer);
		this.analyzer.connect(context.destination);

		this.frequency = 440;

		this.noteIsOn = false;
		this.keys = [];

	};

	p.process = function(e) {


		var data = e.outputBuffer.getChannelData(0);


		for (var i = 0; i < data.length; ++i) {

			if (this.keys.length == 0) {
				data[i] = 0;
			} else {
				data[i] = this.osc1.process(this.x++, this.keys[this.keys.length-1].f + (this.keys[this.keys.length-1].f*this.octave), this.context);
			}

		}

	};

	p.play = function() {
		this.node.connect(this.context.destination);
	};

	p.pause = function() {
		this.node.disconnect();
	};


	p.frequencyTable = {
		c:261.63,
		c1:277.18,
		d:293.66,
		d1:311.13,
		e:329.63,
		f:349.23,
		f1:369.99,
		g:392.00,
		g1:415.30,
		a:440.00,
		a1:466.16,
		b:493.88
	};

	BitCrusher.AudioEngine = AudioEngine;

}());




(function() {
	var SineWaveOscillator = function () {};
	var p = SineWaveOscillator.prototype;

	p.process = function (block, frequency, context) {

		var d = Math.sin(block / (context.sampleRate / (frequency * 2 * Math.PI))) ;

		return d;

	};

	BitCrusher.SineWaveOscillator = SineWaveOscillator;

}());


(function() {
	var NoiseWaveOscillator = function () {};
	var p = NoiseWaveOscillator.prototype;

	p.process = function (block, frequency, context) {

		var d = Math.random();

		return d;

	};

	BitCrusher.NoiseWaveOscillator = NoiseWaveOscillator;

}());








(function () {

	var audioContext = new (window.AudioContext || window.webkitAudioContext)();

	audioEngine = new BitCrusher.AudioEngine(audioContext);

	// Key Down Listeners
	$(window).keydown(function(event) {

		NoteOn(event.which);      

	});

	$(window).keyup(function(event) {
		NoteOff(event.which);
	});

	$('.key').mousedown(function (e) {
		NoteOn($(e.target).attr('id'));
	})
		.mouseup(function (e) {
		NoteOff($(e.target).attr('id'));
	})


	function NoteOff(num) {
		var index;
		for (var i in audioEngine.keys) {
			if (audioEngine.keys[i].k == num) index = i;
		}
		if (index) {
			$('#'+num).removeClass('down');
			audioEngine.keys.splice(index, 1);
		} else {
			$('.keys').removeClass('down');
			audioEngine.keys = [];
		}
	}


	function NoteOn(num) {

		if (num == 90) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.c
			});

		} else if (num == 83) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.c1
			});

		} else if (num == 88) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.d
			});

		} else if (num == 68) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.d1
			});

		} else if (num == 67) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.e
			});

		} else if (num == 86) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.f
			});

		} else if (num == 71) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.f1
			});

		} else if (num == 66) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.g
			});

		} else if (num == 72) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.g1
			});

		} else if (num == 78) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.a
			});

		} else if (num == 74) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.a1
			});

		} else if (num == 77) {
			audioEngine.keys.push({
				k: num,
				f: audioEngine.frequencyTable.b
			});

		} else {
			console.log(num);
			return;
		}

		$('#'+num).addClass('down');

	}


	$(window).blur(function () {
		audioEngine.keys = [];
	});


	$('.osc').click(function (e) {
		switch ($(e.target).attr('id')) {

			case 'sine':
				audioEngine.osc1 = new BitCrusher.SineWaveOscillator();
				break;

			case 'noise':
				audioEngine.osc1 = new BitCrusher.NoiseWaveOscillator();
				break;

			case 'saw':
				audioEngine.osc1 = new BitCrusher.SawWaveOscillator();
				break;

		}
	});


	$('.octave').click(function (e) {
		switch ($(e.target).attr('id')) {

			case 'up':
				audioEngine.octave += 1;
				break;

			case 'down':
				audioEngine.octave -= 1;
				break;

		}
	});

})();
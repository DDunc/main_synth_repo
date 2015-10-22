var Sequencer = function() {

  // cache dom
  this.el = document.getElementById('sequencer');
  this.stopButton = document.getElementById('stop');
  this.playButton = document.getElementById('play');
  this.pad_elements = this.el.querySelectorAll('div');
  this.tempo = 500;
  this.bars = 8;
  this.play_handler = null;

  // model initialization
  this.pads = sharedState.pads;
  for (var i=0; i < this.pad_elements.length; i++) {
    // this new pad should have a ref to a dom element
    this.pads[''+i] = new Pad(this.pad_elements[i]);
  }
  // play function on start click
  var self = this;
  self.playButton.addEventListener('touchstart', function(e) {
    var i = 0;
    self.play_handler = setInterval(function() {
      console.log('beat %s', i);
      if (sharedState.pads[i].sounds.length) {
        console.log(sharedState.pads[i].sounds[0].note);
        sharedState.pads[i].sounds[0].note.playFor(self.duration);
        // loop through sounds and start them all
      }
      i = (i + 1)%8;
    }.bind(self), 500);
  });

  // stop function on stop button click/touch
  this.stopButton.addEventListener('touchstart', function(e) {
    clearInterval(self.play_handler);
  });


};

// SEQUENCER

var Sequencer = function(ctx, sequence, tempo) {

  this.ctx = ctx;
  this.sequence = sequence;
  this.tempo = tempo;

};

Sequencer.prototype.playSound = function(note, startTime, duration) {

  note.start(startTime);

};

Sequencer.prototype.playSequence = function() {

  var startTime = 0; 
  var tempo = 120; // BPM (beats per minute)
  var quarterNoteTime = 60 / tempo;

  // this sets up the timing in advance, not on fly
  //
  this.playSound(sequence[0], 0.0, 0.4);
  this.playSound(sequence[2], 0.5, 0.9);
  this.playSound(sequence[4], 1.0, 1.4);
  this.playSound(sequence[6], 1.5, 1.9);

};

var ctx = new AudioContext();

var note1 = new Note(ctx, 440, 0.5);
var note2 = new Note(ctx, 550, 0.0);
var note3 = new Note(ctx, 660, 0.5);
var note4 = new Note(ctx, 770, 0.0);
var note5 = new Note(ctx, 440, 0.5);
var note6 = new Note(ctx, 550, 0.0);
var note7 = new Note(ctx, 660, 0.5);
var note8 = new Note(ctx, 770, 0.0);

var sequence = [note1, null, note3, null, note5, null, note7, null];
var sequencer = new Sequencer(ctx, sequence, 120);

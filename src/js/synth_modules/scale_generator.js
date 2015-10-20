var generator = function(frequency, name){

  var min, max;
  var scale = [];

  while (frequency > 20) {
   frequency /= 2;
  }
  min = frequency * 2;

  while (frequency < 20000) {
   frequency*= 2;
  }
  max = frequency / 2;


  while (min <= max) {
    var _min = min;
    note_range = min / 12;

    while (_min < min * 2) {
      scale.push(_min);
      _min += note_range;
    }
    min *= 2;
  }

  console.log(min,max);
  scale.name = name;
  return scale;
};

var s = generator(440,'A');
console.dir(s);

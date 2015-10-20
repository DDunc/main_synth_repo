var generateScale = function(frequency, name){

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

      // fix next if check ... ugh
      if (min*2 - _min > 1) {
        scale.push(_min);
      }
      _min += note_range;
    }
    min *= 2;
  }

  scale.name = name;
  var start = scale.indexOf(440);
  var end = scale.indexOf(880);
  return scale.slice(start,end + 1);
};

var s = generateScale(440,'A');
console.log(s);

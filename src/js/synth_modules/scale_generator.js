var generateScale = function(frequency, name){

  var _frequency = frequency
  var min, max;
  var scale = [];

  while (_frequency > 20) {
   _frequency /= 2;
  }
  min = _frequency * 2;

  while (_frequency < 20000) {
   _frequency*= 2;
  }
  max = _frequency / 2;


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
  var start = scale.indexOf(frequency);
  var end = scale.indexOf(frequency * 2);
  return scale.slice(start,end + 1);
};

//var s = generateScale(220,'A');
//console.log(s);

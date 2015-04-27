(function () {
  
  // HELPERS 
  var generateRandomNote = function() {
    var key = Math.floor(Math.random() * 88);
    return teoria.note.fromKey(key);
  };

  var generateInterval = function() {
    // generate two random notes 
    var note1 = generateRandomNote();
    var note2 = generateRandomNote();

    // make sure the interval is no greater than an octave apart 
    if ( Math.abs(note1.key() - note2.key()) > 12 ) {
      var randomSign = Math.random() >= .5 ? 1 : -1;
      var newKey = (note2.key() % 12 + note1.key()) * randomSign;
      note2 = teoria.note.fromKey(newKey);
    }

    return [ ];
  };

  var playFreq = function(freq) {
    var sine = T("sin", {freq: freq, mul:0.5});
    T("perc", {r:500}, sine).on("ended", function() {
      this.pause();
    }).bang().play();
  };
  
  var playInterval = function(intervalArr) {
    playFreq(intervalArr[0]);
    setTimeout(function() {
      playFreq(intervalArr[1]);
    }, 600);
  };

  var freqToNote = function(freq) {
    
  };

  var noteToFreq = function(freq) {
    return 
  };

  var parseInterval = function(interval) {

  };

  // APP 
  playInterval([830.609, 830.609]);

}());
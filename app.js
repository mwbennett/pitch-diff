$(document).ready(function () {

  
  // HELPERS 
  var generateRandomNote = function() {
    var key = Math.floor(Math.random() * 76);
    return teoria.note.fromKey(key + 6);
  };

  var generateInterval = function() {
    // generate two random notes 
    var note1 = generateRandomNote();
    var note2 = generateRandomNote();

    // make sure the interval is no greater than an octave apart 
    if ( Math.abs(note1.key() - note2.key()) > 12 ) {
      var randomSign = Math.random() >= .5 ? 1 : -1;
      var newKey = (note2.key() % 12 + note1.key()) * randomSign;

      // ensure note stays within limits 
      if (newKey > 82 || newKey < 7){
        newKey = (note2.key() % 12 + note1.key()) * -randomSign;
      }

      note2 = teoria.note.fromKey(newKey);
    }

    return [note1, note2];
  };

  var playFreq = function(freq) {
    var sine = T("sin", {freq: freq, mul:0.5});
    T("perc", {r:500}, sine).on("ended", function() {
      this.pause();
    }).bang().play();
  };
  
  var playInterval = function(intervalArr) {
    playFreq(intervalArr[0].fq());
    setTimeout(function() {
      playFreq(intervalArr[1].fq());
    }, 600);
  };

  // APP

  var currentInterval = null;

  // click handlers 
  $('.interval-menu').on('click', '.interval-button', function(e) {
    e.preventDefault();
    console.log($(this).text());
  });

  $('.playing-options').on('click', '.new-interval', function(e) {
    e.preventDefault();
    currentInterval = generateInterval;
    playInterval(currentInterval);
  });

  $('.playing-options').on('click', '.play-again', function(e) {
    e.preventDefault();
    playInterval(currentInterval);
  });

});
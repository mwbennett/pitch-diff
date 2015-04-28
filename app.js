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
    return [teoria.interval(note1, note2), note1, note2];
  };

  var playFreq = function(freq) {
    var sine = T("sin", {freq: freq, mul:0.5});
    T("perc", {r:500}, sine).on("ended", function() {
      this.pause();
    }).bang().play();
  };
  
  var playInterval = function(interval) {
    playFreq(interval[1].fq());
    setTimeout(function() {
      playFreq(interval[2].fq());
    }, 600);
  };

  var parseIntervalString = function(interval) {
    return interval.split("").reduce(function(accumulator, val){
      if (val !== '-') {
        accumulator += val;
      }
      return accumulator;
    }, "");
  };

  var checkResponse = function(intName) {
    return intName === parseIntervalString(currentInterval[0].toString()) ? true : false;
  };

  var setNewInterval = function() {
    currentInterval = generateInterval();
    var intervalString = parseIntervalString(currentInterval[0].toString());
    if (intervalString.length > 2) {
      setNewInterval();
    }
  }

  // click handlers 
  $('.interval-menu').on('click', '.interval-button', function(e) {
    e.preventDefault();
    console.log("Check response: ", checkResponse($(this).text()));
    if (checkResponse($(this).text())) {
      $(this).addClass('correct');
      setNewInterval();
      $('.new-interval').text('Play next');
    } else {
      $(this).addClass('incorrect');
    }
  });

  $('.playing-options').on('click', '.new-interval', function(e) {
    e.preventDefault();
    $(this).text('New interval');
    $('.interval-button').removeClass('correct incorrect');
    $('.play-again').text('Play again');
    setNewInterval();
    playInterval(currentInterval);
    console.log("Current interval: ", currentInterval[0].toString());
  });

  $('.playing-options').on('click', '.play-again', function(e) {
    e.preventDefault();
    $(this).text('Play again');
    playInterval(currentInterval);
  });

});
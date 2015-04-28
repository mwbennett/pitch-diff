$(document).ready(function () {

  
  //===============================//
  // HELPERS                       //
  //===============================//
  var generateRandomNote = function() {
    var key = Math.floor(Math.random() * 64);
    return teoria.note.fromKey(key + 12);
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

  var renderInterval = function(interval) {
    var canvas = $("canvas")[0];
    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(10, 0, 200);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var note1 = interval[1];
    var note2 = interval[2];

    var noteClef = note1.octave() > 3 || note2.octave() > 3 ? 'treble' : 'bass';

    var arr = [note1.toString(), note2.toString()];
    var noteKeys = [];

    arr.forEach(function(elem){
      var len = elem.length;
      elem = elem.slice(0, len - 1) + '/' + elem.slice(len - 1);
      noteKeys.push(elem);
    });

    console.log(noteKeys);

    stave.addClef(noteClef).setContext(ctx).draw();

    // Create the notes
    var notes = [
      new Vex.Flow.StaveNote({ clef: noteClef, keys: noteKeys, duration: "w" })
        // addAccidental(1, new Vex.Flow.Accidental("b")).
        // addAccidental(2, new Vex.Flow.Accidental("#"))
    ];

    // Create a voice in 4/4
    var voice = new Vex.Flow.Voice({
      num_beats: 4,
      beat_value: 4,
      resolution: Vex.Flow.RESOLUTION
    });

    // Add notes to voice
    voice.addTickables(notes);

    // Format and justify the notes to 500 pixels
    var formatter = new Vex.Flow.Formatter().
      joinVoices([voice]).format([voice], 500);

    // Render voice
    voice.draw(ctx, stave);
          
  };

  var setNewInterval = function() {
    currentInterval = generateInterval();
    var intervalString = parseIntervalString(currentInterval[0].toString());
    if (intervalString.length > 2) {
      setNewInterval();
    }
    renderInterval(currentInterval);
  }

  setNewInterval();

//===============================//
// CLICK HANDLERS                //
//===============================// 

  $('.interval-menu').on('click', '.interval-button', function(e) {
    e.preventDefault();
    console.log("Check response: ", checkResponse($(this).text()));
    if (checkResponse($(this).text())) {
      $(this).addClass('btn-success');
      $('.new-interval').addClass('btn-info');
      $('.new-interval').text('Play next');
    } else {
      $(this).addClass('btn-danger');
    }
  });

  $('.playing-options').on('click', '.new-interval', function(e) {
    e.preventDefault();
    $(this).text('New interval');
    $(this).removeClass('btn-info');
    $('.interval-button').removeClass('btn-danger btn-success');
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
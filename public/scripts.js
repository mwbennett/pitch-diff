$(document).ready(function () {

  
  //===============================//
  // HELPERS                       //
  //===============================//
  var generateRandomNote = function() {
    var key = Math.floor(Math.random() * 58);
    return teoria.note.fromKey(key + 15);
  };

  var generateInterval = function() {
    // generate two random notes 
    var note1 = generateRandomNote();
    while (note1.octave() > 5 || note1.octave() < 3){
      note1 = generateRandomNote();
    }
    var note2 = generateRandomNote();

    // make sure the interval is no greater than an octave apart 
    if ( Math.abs(note1.key() - note2.key()) > 12 ) {
      var sign = note1.octave() >= 4 ? -1 : 1;

      var newKey = (note2.key() % 12 * sign) + note1.key();

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

  var setNoteClef = function(interval) {
    var note1 = interval[1];
    var note2 = interval[2];

    return note1.octave() > 3 || note2.octave() > 3 ? 'treble' : 'bass';
  }

  var createStaveNotes = function(interval, noteClef) {
    var note1 = interval[1];
    var note2 = interval[2];

    // Create note keys 
    var noteStrings = [note1.toString(), note2.toString()];
    var noteKeys = [];

    noteStrings.forEach(function(elem){
      var len = elem.length;
      elem = elem.slice(0, len - 1) + '/' + elem.slice(len - 1);
      noteKeys.push(elem);
    });

    // store accidentals for note rendering
    var accidentals = [];
    noteStrings.forEach(function(str, index) {
      if (str[1] === '#' || str[1] === 'b') {
        accidentals[index] = (str[1]);
      }
    })

    var staveNote1, staveNote2; 
    // create first staveNote in interval
    if (accidentals[0] !== undefined) {
      staveNote1 = new Vex.Flow.StaveNote({ clef: noteClef, keys: [noteKeys[0]], duration: "h" })
        .addAccidental(0, new Vex.Flow.Accidental(accidentals[0]));
    } else {
      staveNote1 = new Vex.Flow.StaveNote({ clef: noteClef, keys: [noteKeys[0]], duration: "h" });
    } 
    // create second staveNote in interval 
    if (accidentals[1] !== undefined) {
      staveNote2 = new Vex.Flow.StaveNote({ clef: noteClef, keys: [noteKeys[1]], duration: "h" })
        .addAccidental(0, new Vex.Flow.Accidental(accidentals[1]));
    } else {
      staveNote2 = new Vex.Flow.StaveNote({ clef: noteClef, keys: [noteKeys[1]], duration: "h" });
    }
    return [staveNote1, staveNote2];
  }

  var renderInterval = function(staveNotes, intervalClef) {
    var canvas = $("canvas")[0];
    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(120, 10, 200);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stave.addClef(intervalClef).setContext(ctx).draw();

    // Create a voice in 4/4
    var voice = new Vex.Flow.Voice({
      num_beats: 4,
      beat_value: 4,
      resolution: Vex.Flow.RESOLUTION
    });

    // Add notes to voice
    voice.addTickables(staveNotes);

    // Format and justify the notes to 500 pixels
    var formatter = new Vex.Flow.Formatter().
      joinVoices([voice]).format([voice], 200);

    // Render voice
    voice.draw(ctx, stave);
          
  };

  var renderNewStaff = function(interval) {
    var noteClef = setNoteClef(interval);
    var staveNotes = createStaveNotes(interval, noteClef);
    renderInterval(staveNotes, noteClef);
  }

  var setNewInterval = function() {
    currentInterval = generateInterval();
    var intervalString = parseIntervalString(currentInterval[0].toString());
    if (intervalString.length > 2) {
      setNewInterval();
    }
    renderNewStaff(currentInterval);
  }

  var checkLongestStreak = function() {
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }

//===============================//
// CLICK HANDLERS                //
//===============================// 

  $('.interval-menu').on('click', '.interval-button', function(e) {
    e.preventDefault();
    console.log("Check response: ", checkResponse($(this).text()));

    if (checkResponse($(this).text())) {
      $(this).addClass('btn-success');
      $('.total-score').text(++correctResponses + '/' + ++totalResponses);
      $('.current-streak').text(++currentStreak);
      checkLongestStreak();
      $('.longest-streak').text(longestStreak);
      $('.new-interval').addClass('btn-info');
      $('.new-interval').text('Play next');
    } else {
      $(this).addClass('btn-danger');
      $('.total-score').text(correctResponses + '/' + ++totalResponses);
      currentStreak = 0;
      $('.current-streak').text(currentStreak);
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

  $('.scoreboard').on('click', '.clear-score', function(e) {
    console.log('HELLOS');
    e.preventDefault();
    correctResponses = totalResponses = longestStreak = currentStreak = 0;
    $('.total-score').text(correctResponses + '/' + totalResponses);
    $('.current-streak').text(currentStreak);
    checkLongestStreak();
    $('.longest-streak').text(longestStreak);
  });

//===============================//
// INITIATE APP                  //
//===============================// 
  
  var correctResponses = 0;
  var totalResponses = 0;
  var longestStreak = 0;
  var currentStreak = 0;
  setNewInterval();

});
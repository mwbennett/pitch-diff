(function () {
  
  // HELPERS 
  var generateRandomFrequency = function() {

  };

  var generateInterval = function() {

  };

  var playFrequency = function(freq) {
    var sine = T("sin", {freq: freq, mul:0.5});
    T("perc", {r:500}, sine).on("ended", function() {
      this.pause();
    }).bang().play();
  };
  
  var playInterval = function(arr) {
    playFrequency(arr[0]);
    setTimeout(playFrequency(arr[1]), 300);
  };

  var getNameFromKey = function(keyNum) {
    return 
  };

  // APP 

}());
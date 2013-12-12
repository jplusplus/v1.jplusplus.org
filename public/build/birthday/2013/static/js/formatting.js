// Generated by CoffeeScript 1.6.3
window.serious.format = {};

serious.format.StringFormat = (function() {
  function StringFormat() {}

  StringFormat.Capitalize = function(str) {
    if ((str != null) && str !== "") {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } else {
      return null;
    }
  };

  return StringFormat;

})();

serious.format.NumberFormat = (function() {
  function NumberFormat() {}

  NumberFormat.SecondToString = function(seconds) {
    var hours, minutes;
    hours = parseInt(seconds / 3600) % 24;
    minutes = parseInt(seconds / 60) % 60;
    seconds = parseInt(seconds % 60, 10);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (hours === "00") {
      return minutes + ":" + seconds;
    } else {
      return hours + ":" + minutes + ":" + seconds;
    }
  };

  return NumberFormat;

})();

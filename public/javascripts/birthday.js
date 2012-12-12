$(document).ready(function() {

  var $carousel = $(".carousel");

  (window.initRoundabout = function() {

    var wWidth =  $(window).width();
    // Remove the existing roundabout holder
    if( wWidth <= 767 && $carousel.is(".roundabout-holder") ) {     
      $carousel.roundabout("destroy");

    // Create the roundabout holder
    } else if( wWidth > 767 && $carousel.is(":not(.roundabout-holder)") ) {

      $carousel.roundabout({ responsive: true });          
    }

  })();

  $(window).resize(function() {
    window.initRoundabout();
  });
});
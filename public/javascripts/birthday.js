$(document).ready(function() {

  var $carousel = $(".carousel");

  window.keyboardSlide = function(event) {

    if( $carousel.is(":not(.roundabout-holder)") ) return;

    switch(event.keyCode) {
      
      case 37: // left
        $carousel.roundabout("animateToPreviousChild");
        break;

      case 39: // right
        $carousel.roundabout("animateToNextChild");
        break;
    }

  };
  

  (window.initRoundabout = function() {

    var wWidth =  $(window).width();
    // Remove the existing roundabout holder
    if( wWidth <= 767 && $carousel.is(".roundabout-holder") ) {     
      $carousel.roundabout("destroy");

    // Create the roundabout holder
    } else if( wWidth > 767 && $carousel.is(":not(.roundabout-holder)") ) {

      $carousel.roundabout({ responsive: true, minOpacity:0 });
    }

  })();


  // Naviguation with the keyboard
  $(document).keydown(window.keyboardSlide);


  $(window).resize(function() {
    window.initRoundabout();
  });
});
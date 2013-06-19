
// shim layer with setTimeout fallback
// (Paul Irish method http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var animationEndEvents  = "webkitAnimationEnd oAnimationEnd animationend MSAnimationEnd";
var transitionEndEvents = "webkitTransitionEnd oTransitionEnd transitionend MSTransitionEnd";
/**
 * Hide an element with the animation class in parameter and append an "hidden" class after the animation.     
 * 
 * @function
 * @public
 */
$.fn.disappear = function(animateClass) {
    // element to hide
    var $this = $(this); 

    $this.each(function(i, element) {

        var $element = $(element);   

        // if animation available
        if( Modernizr.cssanimations ) {    

            // unbind other animationEnd events
            $element.unbind(animationEndEvents);

            $element.one(animationEndEvents, function() {            
                $element.addClass("hidden").removeClass(animateClass);
            });

            $element.addClass("animated "+animateClass);  

        // animations not available
        } else {
            $element.addClass("hidden");
        }

    });

    return this;
};


/**
 * Show an element with the animation class in parameter and remove the "hidden" class after the animation.     
 * 
 * @function
 * @public
 */
$.fn.appear = function(animateClass) {

    // element to hide
    var $this = $(this); 

    $this.each(function(i, element) {

        var $element = $(element);

        // if animation available
        if( Modernizr.cssanimations ) {
            
            // unbind other animationEnd events
            $element.unbind(animationEndEvents);

            $element.one(animationEndEvents, function() {            
                $element.removeClass("hidden "+animateClass);
            });

            $element.removeClass("hidden").addClass("animated "+animateClass);

        // animations not available
        } else {
            $element.removeClass("hidden");
        }

    });

    return this;
};



/**
 * Animate an element with the animation class and remove it after the animation.     
 * 
 * @function
 * @public
 */
$.fn.animation = function(animateClass) {

    // element to animate
    var $this = $(this);

    $this.each(function(i, element) {

        var $element = $(element);

        // if animation available
        if( Modernizr.cssanimations ) {
            
            // unbind other animationEnd events
            $element.unbind(animationEndEvents);

            $element.one(animationEndEvents, function() {            
                $element.removeClass(animateClass);
            });

            // Animate the element     
            $this.addClass("animated "+animateClass);
        }

    });

    return this;

};


/**
 *  Adds a loading overlay on the element
 * 
 * @function
 * @public
 */
$.fn.loading = function(state, addClass) {

    // element to animate
    var $this = $(this);
    // hide or show the overlay
    state = state === undefined ? true : state;

    $this.each(function(i, element) {

        var $element = $(element);

        // if we want to create and overlay and any one exists
        if( state === true && $element.find(".js-loader-overlay").length === 0 ) {

            // creates the overlay
            var $overlay = $(".js-loader-overlay.js-template").clone;
            // add a class
            if(addClass !== undefined) {
                $overlay.addClass(addClass);
            }
            // appends it to the current element
            $element.append( $overlay );
            // animates the entrance
            $overlay.stop().hide().fadeIn(500);

        } else if(typeof state == "number") {

            var $bar = $element.find(".js-loader-overlay .progress .bar");
            // update the bar
            $bar.css("width", state+"%");

            // we reach the end
            if(state >= 100) {
                // if there is css animations
                if(Modernizr.csstransitions) {                             
                    // unbind other animationEnd events
                    $bar.unbind(transitionEndEvents);
                    // hide the overlay
                    $bar.one(transitionEndEvents, function() {            
                        $this.loading(false);
                    });
                // do not wait before hide the overlay
                } else $this.loading(false)
            }

        // if we want to destroy this overlay
        } else {                        
            // just destroys it
            $element.find(".js-loader-overlay").stop().hide(0); 
        }

    });

    return this;

};

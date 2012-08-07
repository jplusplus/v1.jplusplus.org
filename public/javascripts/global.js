(function(window, undefined) {

	var that = this;

	/**
	 * @function
	 *
	 */
	that.initElements = function() {
		that.el = {
			$portfolio 		: $("#portfolio"),
			$portfolioNav : $("#portfolio-nav")
		};
	};



	/**
	 * @function
	 *
	 */
	that.initPortfolioBlur = function() {

		// No webgl support
		if( ! Modernizr.webgl ) return;

		// For each card
		that.el.$portfolio.find(".js-card.js-active").each(function(i, card) {

 			var $card = $(card);
			// If there already is canvas or no image
			if( $card.find("canvas").length || !$card.find("img").length ) return;

      // creates a Canvas with the size of the preview
  	  try {
          var canvas = fx.canvas();
      } catch(e) {      		
          // Just stops if it failled
          return console && console.log(e.message);
      }

      canvas.width = $card.width();
      canvas.height = $card.height();

      var img     = $card.find("img:first")[0],
          texture = canvas.texture(img);

      canvas.draw(texture).lensBlur(5, 1, 0).update();            

      // append the canvas to the current preview
      $card.find(".wrapper").append(canvas);

		});

	};

	/**
	 * @function
	 *
	 */
	that.changePortfolioNav = function(slide, i) {
		that.el.$portfolioNav.find("li").removeClass("active").eq(i).addClass("active");
	};

	/**
	 * @function
	 *
	 */
	that.initPortfolio = function() {
	
		var option = {                
	      child_class: ".js-card"
    	, startSlide:0
    	, overflow: "visible"
		};

		that.el.$portfolio
			// define a slide
			.µSlide(option)
			.on("after-slide", that.changePortfolioNav);		


		$("#portfolio").delegate(".legend .btn, .about .back", "click", function() {
			$(this).parents(".js-card").toggleClass("fliped");
		});


		$("#portfolio-nav").delegate("li", "click", function(el) {
			that.el.$portfolio.data("µSlide").slideTo( $(this).index() );
		});

	};


	/**
	 * @function
	 *
	 */
	that.slabTextHeadlines = function() {
		
		$(".slabtexted").slabText();
	};

	/**
	 * @function
	 *
	 */
	$(that.init = function() {	
		
		that.initElements();
		that.initPortfolio();
		$(window).on("resize", that.initPortfolio);
		$(".lettering").lettering();
		$(".lettering-lines").lettering('lines');
		$(".lettering-words").lettering('words');
		setTimeout(that.slabTextHeadlines, 1000);


	});

})(window);



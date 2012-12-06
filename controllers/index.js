var async = require('async')
  , cache = require('memory-cache')
  ,  i18n = require("i18n")
  ,   api = require("./api");

/**
 * @author Pirhoo
 * @description Home route binder
 *
 */
module.exports =  function(app, db, controllers) {

	/*
	 * GET home page.
	 */
	app.get('/', function(req, res){

    /*return res.render('500.jade',
      {title: 'Journalism++'}
    ); */

		// Refresh the cache
		if(typeof req.query["refresh-cache"] != "undefined") {
			console.log("Cache refresfed.");
			cache.clear();
		}

		// Get and set the language in (or from) session
		req.session.language = module.exports.getUserLang(req);

		async.parallel({
		    getPosts: function(callback){
	        api.getPosts(req.session.language, function(posts) {
	          callback(null, posts);
	        });
		    },
		    getAbout: function(callback){
	        api.getPage("a-propos-de-journalism", req.session.language, function(page) {
	          callback(null, page);
	        });
		    }
		},
		function(err, results){

			res.render('index.jade', 
				{ 
					title: 'Journalism++', 
					stylesheets: [
						,"http://fonts.googleapis.com/css?family=Share:400,700|Leckerli+One|Averia+Sans+Libre:400,700,300,300italic,400italic,700italic"
						,"/stylesheets/style.css"
						,"/stylesheets/vendor/slabtext.css"
					], 
					javascripts: [
						  "/javascripts/vendor/bootstrap/bootstrap.min.js"																
						, "/javascripts/vendor/iScroll.class.js"																
						, "/javascripts/vendor/jquery.scrollTo-min.js"																
						, "/javascripts/vendor/jquery.µSlide.js"																	
						, "/javascripts/vendor/jquery.lettering-0.6.1.min.js"											
						, "/javascripts/vendor/jquery.slabtext.min.js"																
						, "/javascripts/vendor/glfx.js"																	
						, "/javascripts/global.js"																	
					],
					posts: results.getPosts,
					about: results.getAbout
				}
			);

		});

	});

	/*
	 * Chnage the user language
	 */
	app.get('/lang/:ln', function(req, res){
		req.session.language = ["fr", "en", "de"].indexOf(req.params.ln) > -1 ? req.params.ln : "fr";		
		res.redirect("/");
	});

  app.use(function(req, res, next){
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
      res.redirect('/404');
      return;
    }
  });

};

/**
 * @author Pirhoo
 * @description Get the current user lang according to the given request
 */
module.exports.getUserLang = function(request) {	
	return request.session.language || i18n.getLocale(request) || "fr";
};


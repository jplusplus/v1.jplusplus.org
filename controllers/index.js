var rest = require('restler')
 , async = require('async')
 , cache = require('memory-cache')
 ,  i18n = require("i18n");

/**
 * @author Pirhoo
 * @description Home route binder
 *
 */
module.exports = function(app, db, controllers) {

	/*
	 * GET home page.
	 */
	app.get('/', function(req, res){

		// Refresh the cache
		if(typeof req.query["refresh-cache"] != "undefined") {
			console.log("Cache refresfed.");
			cache.clear();
		}

		// Get and set the language in (or from) session
		req.session.language = module.exports.getUserLang(req);

		module.exports.getPosts(req.session.language, function(posts) {

		  res.render('index.jade', 
				{ 
					title: 'Journalism++', 
					stylesheets: [
						 "/stylesheets/vendor/bootstrap-build/bootstrap.min.css"
						,"/stylesheets/vendor/bootstrap-build/bootstrap-responsive.min.css"
						,"/stylesheets/vendor/slabtext.css"
						,"http://fonts.googleapis.com/css?family=Share:400,700|Leckerli+One|Averia+Sans+Libre:400,700,300,300italic,400italic,700italic"
						,"/stylesheets/style.css"
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
					posts: posts
				}
			);
		});

	});

	/*
	 * Chnage the user language
	 */
	app.get('/lang/:ln', function(req, res){
		req.session.language = ["fr", "en"].indexOf(req.params.ln) > -1 ? req.params.ln : "fr";		
		res.redirect("/");
	});

};

/**
 * @author Pirhoo
 * @description Get the current user lang according to the given request
 */
module.exports.getUserLang = function(request) {	
	return request.session.language || i18n.getLocale(request) || "fr";
};


/**
 * @author Pirhoo
 * @description Get the posts from the API or from the cache
 */
module.exports.getPosts = function(lang, complete) {

  async.series([
    // Get data from cache first
    function getFromCache(fallback) {      
      // Get the course from the cache
      if( cache.get('posts-list-'+lang) ) complete( cache.get('posts-list-'+lang) );
      // Or get the colletion from the fallback function
      else fallback();
    },
    // Get data from the API 
    function getFromAPI() {

      // get_category_index request from the external "WordPress API"
      rest.get("http://jplusplus.oeildupirate.com/?count=100&json=1&custom_fields=siteurl&lang=" + lang).on("complete", function(data) {

      	// Filters custom fields
      	for(var index in data.posts) {
      		var post = data.posts[index];
      		post.siteurl = post.custom_fields.siteurl ? post.custom_fields.siteurl[0] : false;
      	}

        // Put the data in the cache 
        cache.put('posts-list-'+lang, data.posts);

        // Call the complete function
        complete( data.posts );

      });
    }        
  ]);

};
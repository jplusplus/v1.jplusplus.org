var async = require('async')
  , cache = require('memory-cache')
  ,  i18n = require("i18n")
  ,   api = require("./api")
 , config = require("config");


function getSubdomain(req) {
  var host = req.headers.host;
  var matches = host.split(".");
  if( matches.length > 2) {
  	if( matches[0] === "www") matches.shift();
  	return matches[0];
  } else return null;
}

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

		// Refresh the cache
		if(typeof req.query["refresh-cache"] != "undefined") {
			console.log("Cache refresfed.");
			cache.clear();
		}
		
		// Get and set the language in (or from) session
		req.session.language = module.exports.getUserLang(req);

		var subdomain = getSubdomain(req);
		switch( subdomain ) {

			case "paris":
				parisBerlinRoute(req, res, subdomain);
				break;

			case "berlin":
				parisBerlinRoute(req, res, subdomain);
				break;

			case "amsterdam":
				amsterdamRoute(req, res, subdomain);
				break;

			case "stockholm":
				res.redirect("http://jplusplus.se");
				break;

			default:
				rootRoute(req, res, subdomain);				
				break;

		}

	});

	/*
	 * Chnage the user language
	 */
	app.get('/lang/:ln', function(req, res){
		req.session.language = ["fr", "en", "de", "sv"].indexOf(req.params.ln) > -1 ? req.params.ln : "en";		
		res.redirect(req.query.path || "back" || "/");
	});

	/**
	 * Birthday page 
	 */
	app.get('/birthday/2012', function(req, res) {
		res.render("birthday", {});
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

var parisBerlinRoute = function(req, res, subdomain) {

	async.parallel({
	    getPosts: function(callback){
	        api.getPosts(req.session.language, subdomain, function(posts) {
	        	var defaultLanguage = "en";
	        	// If no posts, load the english ones
	        	if(posts && posts.length === 0 && req.session.language != defaultLanguage) {
			        api.getPosts(defaultLanguage, subdomain, function(posts) {
	          			callback(null, posts);
			        });
	        	} else {
	          		callback(null, posts);
	        	}
	        });
	    },
	    getAbout: function(callback){
	        api.getPage("a-propos-de-journalism", req.session.language, function(page) {
	          callback(null, page);
	        });
	    }
	},
	function(err, results){

		res.render('parisBerlin.jade', 
			{ 				
				posts: results.getPosts,
				about: results.getAbout,
				city: subdomain ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1) : undefined
			}
		);

	});
};


var amsterdamRoute = function(req, res, subdomain) {

	async.parallel({
	    getPosts: function(callback){
	        api.getPosts(req.session.language, subdomain, function(posts) {
	        	var defaultLanguage = "en";
	        	// If no posts, load the english ones
	        	if(posts && posts.length === 0 && req.session.language != defaultLanguage) {
			        api.getPosts(defaultLanguage, subdomain,  function(posts) {
	          			callback(null, posts);
			        });
	        	} else {
	          		callback(null, posts);
	        	}
	        });
	    },
	    getAbout: function(callback){
	        api.getPage("about-amsterdam", req.session.language, function(page) {
	          callback(null, page);
	        });
	    }
	},
	function(err, results){

		res.render('amsterdam.jade', 
			{ 				
				posts: results.getPosts,
				about: results.getAbout,
				city: subdomain ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1) : undefined
			}
		);

	});
}

var rootRoute = function(req, res, subdomain) {

	async.parallel({
	    getManifest: function(callback){
	        api.getPage("manifest-journalism", req.session.language, function(page) {
	          callback(null, page);
	        });
	    }
	},
	function(err, results){
		res.render('index.jade', { manifest: results.getManifest });
	});
}

/**
 * @author Pirhoo
 * @description Get the current user lang according to the given request
 */
module.exports.getUserLang = function(request) {	
	return request.session.language || i18n.getLocale(request) || "en";
};


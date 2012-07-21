var express = require('express')
	, phantom = require('phantom')
			, app = null;


/**
* @author Pirhoo
*
* @function
* @description
*/
exports.boot = function(){

  // Environement configuration
  process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://pirhoo:pirhoo@localhost:5432/jquest_orm";
  process.env.PORT = process.env.PORT || 3000;

  // Creates Express server
  app = module.exports = express.createServer();

  // Configuration
  app.configure(function(){
    
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');   
    
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use( express.errorHandler() );
  });


	app.get('/', function(req, res){

		console.log('Loading a web page');

		phantom.create( function(ph) {
		  
		  ph.createPage( function(page) {

		    var output = "./public/temp.png"
		    	, url		 = req.query.url ? req.query.url : "about:blank";

		    page.set('viewportSize', { width: 1400, height:400} );
		    page.open(url, function(status) {

		      
		      console.log("Opened %s as %s", url, output);

		      if(status == "success") {

		      	setTimeout(function() {

			      	page.render(output, function() {
			      		res.sendfile(output);
						  	page.release();    	      		
			      	});

		      	}, 2000);

		      }

		    });
		  });
		});

	});

  return app;
};




exports.boot().listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
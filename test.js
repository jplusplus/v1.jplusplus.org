var express = require('express')
//	, phantom = require('phantom')
			, app = null
  	, exec = require('child_process').exec;


exec("phantomjs  --version", function (error, stdout, stderr) {
  console.log("error : " +  error);
  console.log("stdout : " +  stdout);
  console.log("stderr : " +  stderr);
});

/**
* @author Pirhoo
*
* @function
* @description
*/
exports.boot = function(){

  // Environement configuration
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

		/*
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
		*/
	});

  return app;
};


exports.boot().listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

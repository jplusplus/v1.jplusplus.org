var express = require('express')
	, phantom = require('phantom')
			, app = module.exports = express.createServer();

app.get('/', function(req, res){

	console.log('Loading a web page');

	phantom.create( function(ph) {
	  
	  ph.createPage( function(page) {

	    var output = "temp.png"
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


app.listen(3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
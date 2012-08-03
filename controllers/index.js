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

	  res.render('index.jade', 
			{ 
				title: 'Journalism++', 
				stylesheets: [
					 "/stylesheets/vendor/bootstrap-build/bootstrap.min.css"
					,"/stylesheets/vendor/bootstrap-build/bootstrap-responsive.min.css"
					,"/stylesheets/vendor/slabtext.css"
					,"http://fonts.googleapis.com/css?family=Share:400,700|Leckerli+One"
					,"/stylesheets/style.less"
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
				]
			}
		);
	});

};
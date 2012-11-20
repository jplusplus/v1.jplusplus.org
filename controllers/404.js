/**
 * @author Pirhoo
 * @description Home route binder
 *
 */
module.exports =  function(app, db, controllers) {

  /*
   * GET home page.
   */
  app.get('/404', function(req, res){
    res.render('404.jade', 
      { 
        title: '404 - Journalism++', 
        stylesheets: [
           "/stylesheets/vendor/bootstrap-build/bootstrap.min.css"
          ,"/stylesheets/vendor/bootstrap-build/bootstrap-responsive.min.css"
          ,"/stylesheets/vendor/slabtext.css"
          ,"http://fonts.googleapis.com/css?family=Share:400,700|Leckerli+One|Averia+Sans+Libre:400,700,300,300italic,400italic,700italic"
          ,"/stylesheets/style.css"
        ], 
        javascripts: [
            "/javascripts/vendor/bootstrap/bootstrap.min.js"                 
        ]
      }
    );
  });

};
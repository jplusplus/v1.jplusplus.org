var rest = require('restler')
 , async = require('async')
 , cache = require('memory-cache')
 ,  i18n = require("i18n")
 ,   api = require("./api")
 , index = require("./index");

/**
 * @author Pirhoo
 * @description Home route binder
 *
 */
module.exports =  function(app, db, controllers) {

  /*
   * GET home page.
   */
  app.get('/p/:page', function(req, res){

    // Get and set the language in (or from) session
    req.session.language = index.getUserLang(req);

    async.parallel({
      page: function(callback){
        api.getPage(req.params.page, req.session.language, function(page) {
          callback(null, page);
        });
      }
    },
    function(err, results){

      if(!results.page) return res.redirect("/404");

      res.render('page.jade', 
        { 
          title: results.page.title + ' - Journalism++', 
          stylesheets: [
             "/stylesheets/vendor/bootstrap-build/bootstrap.min.css"
            ,"/stylesheets/vendor/bootstrap-build/bootstrap-responsive.min.css"
            ,"/stylesheets/vendor/slabtext.css"
            ,"http://fonts.googleapis.com/css?family=Share:400,700|Leckerli+One|Averia+Sans+Libre:400,700,300,300italic,400italic,700italic"
            ,"/stylesheets/style.css"
          ], 
          javascripts: [
              "/javascripts/vendor/bootstrap/bootstrap.min.js"                 
          ],
          page: results.page,
        }
      );

    });
  });

};
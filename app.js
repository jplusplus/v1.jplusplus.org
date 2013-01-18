/**
 * Module dependencies.
 */
var express         = require('express')
  , fs              = require('fs')
  , i18n            = require("i18n")
  , lessMiddleware  = require("less-middleware")
  , config          = require('config');

/**
 * Global objects
 */
var app = sequelize = null;


/**
 * @author Pirhoo
 *
 * @function
 * @description Loads all requires automaticly from a directory
 */
function loadAllRequires(dirname, where) {  
  // Change the root of the directory to analyse following the given parameter
  var dir = dirname || __dirname;
  // Var to record the require
  where = typeof(where) === "object" ? where : {};    
  
  // Grab a list of our route files/directories
  fs.readdirSync(dir).forEach(function(name){
    
    // Find the file path
    var path = dir + '/' + name
    // Query the entry
     , stats = fs.lstatSync(path)
    // Name simplitfy
     , slug  = name.replace(/(\.js)/, "");

    // If it's a directory...
    if( stats.isDirectory() ) {
      // Recursive calling
      loadAllRequires(path);      
    // If it's a regular file...
    }else {      
      // Require the route file with app and sequelize variables
      where[slug] = require(path)(app, sequelize);    
    }
  });
}


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
    
    // using 'accept-language' header to guess language settings
    app.use(i18n.init);

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'L7mdcS4K5JZI097PQWTaVdTGp4uZi4ifgF0ht2bkET' }));

    app.use(lessMiddleware({
        src: __dirname + '/public',
        compress: true
    }));

    app.use(express.static(__dirname + '/public'));

  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use( express.errorHandler() );
  });
  
  i18n.configure({
    // setup some locales
    locales:['fr', 'en', 'de', 'se']
  });

  // Register helpers for use in templates
  app.helpers({
    _: function(msg) {
      i18n.setLocale(this.session.language || "fr");
      return i18n.__(msg);
    },
    _n: function(singular, plural, count) {
      i18n.setLocale(this.session.language || "fr");
      return i18n.__n(singular, plural, count);
    },
  });

  // Dynamic view's helpers
  app.dynamicHelpers({
    currentUser: function (req, res) {
      return req.session.currentUser;
    },
    currentRoute: function(req, res) {
      return req.route;
    },
    session: function(req, res){
      return req.session;
    },
    path: function(req) {
      return req.path;
    }
  });


  // all models and controller on this scope
  app.controllers = app.models = {};

  // Load all controllers from the /controllers directory
  loadAllRequires(__dirname + "/controllers", app.controllers);

  return app;
};

exports.boot().listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

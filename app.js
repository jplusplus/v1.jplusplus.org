/**
 * Module dependencies.
 */
var express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , i18n    = require("i18n")
  , path    = require("path")
  , config  = require('config');

/**
 * Global objects
 */
var app = express();

// Configuration
app.configure(function(){
  
  // Environement configuration
  app.set("port", process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  
  // using 'accept-language' header to guess language settings
  app.use(i18n.init);

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'L7mdcS4K5JZI097PQWTaVdTGp4uZi4ifgF0ht2bkET' }));

  // Assets managers
  var pubDir = path.join(__dirname, "public");
  app.use( require("connect-assets")({src: pubDir}) )
  app.use( express.static(pubDir) )


  i18n.configure({
    // setup some locales
    locales:['fr', 'en', 'de', 'sv']
  });

  // Register helpers for use in templates
  app.use(function(req, res, next) {

    res.locals._ = function(msg) {
      if(req.session)
        i18n.setLocale(req.session.language || "en");
      return i18n.__(msg);
    };

    res.locals._n = function(singular, plural, count) {
      if(req.session)
        i18n.setLocale(req.session.language || "en");
      return i18n.__n(singular, plural, count);
    };

    res.locals.currentUser = function () {
      return req.session.currentUser;
    };

    res.locals.currentRoute = function() {
      return req.route;
    };

    res.locals.session = function(res){
      return req.session;
    };

    res.locals.path = function() {
      return req.path;
    };

    next();
  });

  // Load every controllers
  require("./controllers/404.js")(app)
  require("./controllers/api.js")(app)
  require("./controllers/index.js")(app)
  require("./controllers/page.js")(app)

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use( express.errorHandler() );
});
  
// Then create the express server
http.createServer(app).listen( app.get("port"), function() {    
  console.log("Express server listening on port " + app.get("port"))
});

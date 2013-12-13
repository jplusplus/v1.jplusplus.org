###
Module dependencies.
###
express = require("express")
fs      = require("fs")
http    = require("http")
i18n    = require("i18n")
path    = require("path")
config  = require("config")

###
Global objects
###
app = express()

# Configuration
app.configure ->
  # Environement configuration
  app.set "port", process.env.PORT or 3000
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"

  # using 'accept-language' header to guess language settings
  app.use i18n.init
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.session(secret: process.env.SESSION_SECRET || "<SET A DEFAULT VALUE>")

  # Assets managers
  pubDir = path.join(__dirname, "public")
  plainFilenamer = (filename, code)-> filename
  app.use require("connect-assets")(src: pubDir, buildFilenamer: plainFilenamer)
  app.use express.static(pubDir)

  # Static build public access
  buildDir = path.join(__dirname, "build")
  app.use express.static(buildDir)

  # setup some locales
  i18n.configure locales: ["fr", "en", "de", "sv"]

  # Register helpers for use in templates
  app.use (req, res, next) ->
    res.locals._ = (msg) ->
      i18n.setLocale req.session.language or "en"
      i18n.__ msg

    res.locals._n = (singular, plural, count) ->
      i18n.setLocale req.session.language or "en"
      i18n.__n singular, plural, count

    res.locals.currentRoute = req.route
    res.locals.session = req.session
    res.locals.path = req.path
    next()


  # Load every controllers
  require("./controllers/404") app
  require("./controllers/index") app
  require("./controllers/page") app

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", -> app.use express.errorHandler()

# Then create the express server
http.createServer(app).listen app.get("port"), ->
  console.log("Express server listening on port " + app.get("port"))

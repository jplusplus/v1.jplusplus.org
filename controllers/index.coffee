_       = require("underscore")
async   = require("async")
cache   = require("memory-cache")
i18n    = require("i18n")
config  = require("config")
content = require("./content")
fs      = require("fs")

getSubdomain = (req) ->
  host = req.headers.host
  matches = host.split(".")
  if matches.length > 2
    matches.shift()  if matches[0] is "www"
    matches[0]
  else
    null

###
@author Pirhoo
@description Home route binder
###
module.exports = (app, db, controllers) ->

  #
  #   * GET home page.
  #
  app.get "/", (req, res) ->
    # Get and set the language in (or from) session
    req.session.language = module.exports.getUserLang(req)
    subdomain = getSubdomain(req)
    switch subdomain
      when "paris"
        parisBerlinRouter.getRoute req, res, subdomain
      when "berlin"
        parisBerlinRouter.getRoute req, res, subdomain
      when "amsterdam"
        amsterdamRouter.getRoute req, res, subdomain
      when "cologne"
        cologneRouter.getRoute req, res, subdomain
      when "porto"
        portoRouter.getRoute req, res, subdomain
      when "stockholm"
        res.redirect "http://jplusplus.se"
      else
        rootRoute req, res, subdomain


  #
  #   * Chnage the user language
  #
  app.get "/lang/:ln", (req, res) ->
    req.session.language = (if ["fr", "en", "de", "sv"].indexOf(req.params.ln) > -1 then req.params.ln else "en")
    res.redirect req.query.path or "back" or "/"

  ###
  Birthday page
  ###
  app.get "/birthday/2012", (req, res) ->
    res.render "birthday-2012", {}

  app.use (req, res, next) ->
    res.status 404

    # respond with html page
    if req.accepts("html")
      res.redirect "/404"
      return

genericRouter =
  about_page: 'a-propos-de-journalism'
  render_template: 'parisBerlin.jade'

  getPostsForDomain: (lang, domain, callback) ->
    content.getPosts lang, domain, (posts) ->
      defaultLanguage = "en"

      # If no posts, load the english ones
      if posts and posts.length is 0 and lang isnt defaultLanguage
        content.getPosts defaultLanguage, domain, (posts) ->
          callback null, posts
      else
        callback null, posts

  getRoute: (req, res, subdomain) ->
    # method that will be called to handle user request
    me = this
    async.parallel
      getPosts: (callback) ->
        me.getPostsForDomain req.session.language, subdomain, (error, results) ->
          callback null, results

      getAbout: (callback) ->
        content.getPage me.about_page, req.session.language, (page) ->
          callback null, page

      , (err, results) ->
        res.render me.render_template,
          posts: results.getPosts
          about: results.getAbout
          city: (if subdomain? then subdomain.charAt(0).toUpperCase() + subdomain.slice(1) else undefined)

# routers declaration & extension if needed
parisBerlinRouter = _.extend {}, genericRouter

amsterdamRouter   = _.extend {}, genericRouter,
  about_page: 'about-amsterdam'
  render_template: 'amsterdam.jade'

cologneRouter     = _.extend {}, genericRouter,
  about_page: 'about-cologne'
  render_template: 'cologne.jade'

portoRouter       = _.extend {}, genericRouter,
  about_page: 'about-porto'
  render_template: 'porto.jade'

rootRoute = (req, res, subdomain) ->
  async.parallel
    getManifest: (callback) ->
      content.getPage "manifest-journalism", req.session.language, (page) ->
        callback null, page

  , (err, results) ->
    res.render "index.jade",
      manifest: results.getManifest


###
@author Pirhoo
@description Get the current user lang according to the given request
###
module.exports.getUserLang = (request) ->
  request.session.language or i18n.getLocale(request) or "en"
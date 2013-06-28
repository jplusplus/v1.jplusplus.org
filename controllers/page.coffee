rest    = require("restler")
async   = require("async")
cache   = require("memory-cache")
i18n    = require("i18n")
content = require("./content")
index   = require("./index")

###
@author Pirhoo
@description Home route binder
###
module.exports = (app, db, controllers) ->
  
  # GET home page.  
  app.get "/p/:page", (req, res) ->    
    # Get and set the language in (or from) session
    req.session.language = index.getUserLang(req)
    async.parallel
      page: (callback) ->
        content.getPage req.params.page, req.session.language, (page) ->
          callback null, page
    , (err, results) ->
      return res.redirect("/404")  unless results.page
      res.render "page.jade",
        title: results.page.title + " - Journalism++"
        page: results.page



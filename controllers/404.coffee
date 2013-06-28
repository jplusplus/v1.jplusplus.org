###
@author Pirhoo
@description Home route binder
###
module.exports = (app, db, controllers) ->  
  # GET home page.
  app.get "/404", (req, res) ->
    res.render "404.jade",
      title: "404 - Journalism++"


#app server js file

#declare app
express = require("express")

#required libraries
fs = require("fs")

# passport = require("passport")
# FacebookStrategy = require("passport-facebook").Strategy

# stylus = require("stylus")
# nib = require("nib")

#declare app variable
app = express()

#middleware stack
app.configure ->
  app.use express.bodyParser()
  app.use express.static(__dirname + "/public")
  app.use app.router
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  # app.use stylus.middleware(
  #   src: __dirname + "/public/styl"
  #   compile: (str, path) ->
  #     stylus(str).set("filename", path).use nib()
  # )

app.use express.logger()

#app.use(express.static(__dirname + '/public'));
port = process.env.PORT or 5000
app.listen port, ->
  console.log "Listening on " + port

app.get '/', (req, res) ->
  res.render 'index'

#expose app
exports = module.exports = app
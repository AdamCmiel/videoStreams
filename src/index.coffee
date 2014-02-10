fs = require("fs")
http = require("http")

coffee = require('coffee-script')
express = require("express")
app = express()

port = process.env.PORT or 5000
server = app.listen port, ->
  console.log "Listening on " + port

io = require("socket.io").listen(server)

#middleware stack
app.configure ->
  app.use express.bodyParser()
  app.use express.static(__dirname + "/public")
  app.use app.router
  app.use express.favicon()
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  # app.use stylus.middleware(
  #   src: __dirname + "/public/styl"
  #   compile: (str, path) ->
  #     stylus(str).set("filename", path).use nib()
  # )

app.use express.logger()

app.get '/', (req, res) ->
  res.render 'index'

io.sockets.on 'connection', (socket) ->
  io.sockets.emit('newChatter');
  socket.on 'messageText', (data) ->
    socket.emit('messageFromServer', data)
    socket.broadcast.emit('messageFromServer', data)
    console.log data

  socket.on 'picture', (data) ->
    socket.emit('pictureFromServer', data);
    socket.broadcast.emit('pictureFromServer', data)
    console.log data
#expose app
exports = module.exports = app
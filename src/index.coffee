fs = require("fs")
http = require("http")

coffee = require('coffee-script')
express = require("express")
app = express()

port = process.env.PORT or 5000
server = app.listen port, ->
  console.log "Listening on " + port

io = require("socket.io").listen(server)

app.configure ->
  app.use express.bodyParser()
  app.use express.static(__dirname + "/public")
  app.use app.router
  app.use express.favicon()
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"

app.use express.logger()

app.get '/', (req, res) ->
  res.render 'index'

io.sockets.on 'connection', (socket) ->
  io.sockets.emit('newChatter');
  socket.on 'setChatDescription', (data) ->
    console.log data
    socket.broadcast.emit('broadcastDescription', data)
  socket.on 'returnRemoteDescription', (data) ->
    console.log data
    socket.broadcast.emit('returnDescription', data)
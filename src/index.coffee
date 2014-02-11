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

app.get '/chat/:id', (req, res) ->
  res.redirect '/#chat/' + req.params.id

chatRoomId = 0
userMap = {};
usersInRoom = {};

io.sockets.on 'connection', (socket) ->
  io.sockets.emit('newChatter');

  socket.on 'new_room', ->
    socket.emit 'room_created', (chatRoomId++).toString()

  socket.on 'request_to_join', (data) ->
    usersInRoom[data] = 0 if usersInRoom[data] is undefined
    numSockets = usersInRoom[data]
    console.log 'There are ', numSockets, ' in the room ', data
    if numSockets < 2
      userMap[socket.id] = data;
      usersInRoom[data] = usersInRoom[data] + 1;
      socket.join data
      socket.emit 'joined_room', data
    else 
      socket.emit 'canot_join', data

  socket.on 'setChatDescription', (data) ->
    socket.broadcast.to(userMap[socket.id]).emit('broadcastDescription', data)
  socket.on 'returnRemoteDescription', (data) ->
    socket.broadcast.to(userMap[socket.id]).emit('returnDescription', data)
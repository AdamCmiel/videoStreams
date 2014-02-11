// Generated by CoffeeScript 1.6.3
var app, chatRoomId, coffee, express, fs, http, io, port, server, userMap;

fs = require("fs");

http = require("http");

coffee = require('coffee-script');

express = require("express");

app = express();

port = process.env.PORT || 5000;

server = app.listen(port, function() {
  return console.log("Listening on " + port);
});

io = require("socket.io").listen(server);

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express["static"](__dirname + "/public"));
  app.use(app.router);
  app.use(express.favicon());
  app.set("views", __dirname + "/views");
  return app.set("view engine", "jade");
});

app.use(express.logger());

app.get('/', function(req, res) {
  return res.render('index');
});

app.get('/chat/:id', function(req, res) {
  return res.redirect('/#chat/' + req.params.id);
});

chatRoomId = 0;

userMap = {};

io.sockets.on('connection', function(socket) {
  io.sockets.emit('newChatter');
  socket.on('new_room', function() {
    return socket.emit('room_created', (chatRoomId++).toString());
  });
  socket.on('request_to_join', function(data) {
    var numSockets;
    numSockets = Object.keys(io.sockets["in"](data).sockets).length;
    console.log('There are ', numSockets, ' in the room ', data);
    if (numSockets <= 2) {
      userMap[socket.id] = data;
      socket.join(data);
      return socket.emit('joined_room', data);
    } else {
      return socket.emit('canot_join');
    }
  });
  socket.on('setChatDescription', function(data) {
    return socket.broadcast.to(userMap[socket.id]).emit('broadcastDescription', data);
  });
  return socket.on('returnRemoteDescription', function(data) {
    return socket.broadcast.to(userMap[socket.id]).emit('returnDescription', data);
  });
});

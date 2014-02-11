// Generated by CoffeeScript 1.6.3
var app, coffee, express, fs, http, io, port, server;

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

io.sockets.on('connection', function(socket) {
  io.sockets.emit('newChatter');
  socket.on('setChatDescription', function(data) {
    console.log(data);
    return socket.broadcast.emit('broadcastDescription', data);
  });
  return socket.on('returnRemoteDescription', function(data) {
    console.log(data);
    return socket.broadcast.emit('returnDescription', data);
  });
});

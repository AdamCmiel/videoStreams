// ------------ Write and expose app ------------ //

var app = angular.module('VideoChat', ['ngRoute'])

// ------------- Create App Routes -------------- //

app.config(function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      controller: 'IndexController',
      templateUrl: "/templates/home.html"
    })
    .when('/chat/:id', {
      controller: 'VideoController',
      templateUrl: "/templates/video.html"
    })
    .otherwise({
      redirectTo: '/'
    });
});

// ----------Create Socket Connection ----------- //

app.service('socket', function ($rootScope) {
  var socket = io.connect(window.location.hostname);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

// ---------- Write Controller Logic ------------ //

app.controller('VideoController', function($scope, socket){

  var localPeerConnection, remotePeerConnection; 
  var STUN = {url: 'stun:stun.l.google.com:19302'};
  var TURN = {
    url: 'turn:homeo@turn.bistri.com:80',
    credential: 'homeo'
  };
  var servers = {
     iceServers: [STUN, TURN]
  };

  localPeerConnection = new webkitRTCPeerConnection(servers);
  localPeerConnection.onicecandidate = gotLocalIceCandidate;
  remotePeerConnection = new webkitRTCPeerConnection(servers);
  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.onaddstream = gotRemoteStream;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  navigator.getUserMedia({audio:true, video:true}, gotStream, function(error) {console.log(error);});
  
  //socket events

  socket.on('broadcastDescription', function(data){
    $scope.call();
    description = new RTCSessionDescription(JSON.parse(data));
    remotePeerConnection.setRemoteDescription(description);  
    remotePeerConnection.createAnswer(gotRemoteDescription);
  });

  socket.on('returnDescription', function(data){
    description = new RTCSessionDescription(JSON.parse(data));
    localPeerConnection.setRemoteDescription(description);
  });
    
  function gotStream(stream){
    console.log('got stream');
    $('#localVideo').attr('src', URL.createObjectURL(stream));
    localPeerConnection.addStream(stream);
    $scope.buttonDisabled = false;
  }

  function gotLocalDescription(description){
    localPeerConnection.setLocalDescription(description);
    socket.emit('setChatDescription', JSON.stringify(description));
  }

  function gotRemoteDescription(description){
    remotePeerConnection.setLocalDescription(description);
    socket.emit('returnRemoteDescription', JSON.stringify(description));
  }

  function gotRemoteStream(event){
    $('#remoteVideo').attr('src', URL.createObjectURL(event.stream));
  }

  function gotLocalIceCandidate(event){
    if (event.candidate) {
      remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
  }

  function gotRemoteIceCandidate(event){
    if (event.candidate) {
      localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
  }

  $scope.call = function(){
    localPeerConnection.createOffer(gotLocalDescription);
  }
});

app.controller('IndexController', function($scope, $location, socket){
  socket.on('room_created', function(roomNum){
    $location.path('/chat/'+roomNum);
  });
  $scope.openRoom = function(){
    socket.emit('new_room');
  }
})

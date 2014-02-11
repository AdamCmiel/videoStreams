var socket = io.connect(window.location.hostname);
var localStream, localPeerConnection, remotePeerConnection;

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var callButton = document.getElementById("callButton");

callButton.disabled = true;
callButton.onclick = call;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  navigator.getUserMedia({audio:true, video:true}, gotStream, 
    function(error) {
      console.log(error);
    });
  
function gotStream(stream){
  localVideo.src = URL.createObjectURL(stream);
  localStream = stream;
  callButton.disabled = false;
}

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

function call() {
  callButton.disabled = true;
  localPeerConnection.addStream(localStream);
  localPeerConnection.createOffer(gotLocalDescription);
}

function gotLocalDescription(description){
  localPeerConnection.setLocalDescription(description);
  socket.emit('setChatDescription', JSON.stringify(description));
}

socket.on('broadcastDescription', function(data){
  call();
  description = new RTCSessionDescription(JSON.parse(data));
  remotePeerConnection.setRemoteDescription(description);  //remotePeer was undefined
  remotePeerConnection.createAnswer(gotRemoteDescription);
});

function gotRemoteDescription(description){
  remotePeerConnection.setLocalDescription(description);
  socket.emit('returnRemoteDescription', JSON.stringify(description));
}

socket.on('returnDescription', function(data){
  description = new RTCSessionDescription(JSON.parse(data));
  localPeerConnection.setRemoteDescription(description);
});

function gotRemoteStream(event){
  remoteVideo.src = URL.createObjectURL(event.stream);
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
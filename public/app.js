var localStream, localPeerConnection, remotePeerConnection;

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var callButton = document.getElementById("callButton");

callButton.disabled = true;
callButton.onclick = call;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  navigator.getUserMedia({audio:true, video:true}, gotStream, //note that we are adding both audio and video
    function(error) {
      console.log(error);
    });
  
//Everything above this line should be familiar from the previous example
function gotStream(stream){
  localVideo.src = URL.createObjectURL(stream);
  localStream = stream;
  callButton.disabled = false;
}


function call() {
  callButton.disabled = true;

  if (localStream.getVideoTracks().length > 0) {
    console.log('Using video device: ' + localStream.getVideoTracks()[0].label);
  }
  if (localStream.getAudioTracks().length > 0) {
    console.log('Using audio device: ' + localStream.getAudioTracks()[0].label);
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
  console.log(localPeerConnection)
  console.log("Created local peer connection object localPeerConnection");
  localPeerConnection.onicecandidate = gotLocalIceCandidate;

  remotePeerConnection = new webkitRTCPeerConnection(servers);
  console.log("Created remote peer connection object remotePeerConnection");
  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.onaddstream = gotRemoteStream;

  localPeerConnection.addStream(localStream);
  console.log("Added localStream to localPeerConnection");
  localPeerConnection.createOffer(gotLocalDescription);
}

function gotLocalDescription(description){
  localPeerConnection.setLocalDescription(description);
  console.log("Offer from localPeerConnection: \n" + description.sdp);
  remotePeerConnection.setRemoteDescription(description);
  remotePeerConnection.createAnswer(gotRemoteDescription);
}

function gotRemoteDescription(description){
  remotePeerConnection.setLocalDescription(description);
  console.log("Answer from remotePeerConnection: \n" + description.sdp);
  localPeerConnection.setRemoteDescription(description);
}

function gotRemoteStream(event){
  remoteVideo.src = URL.createObjectURL(event.stream);
  console.log("Received remote stream");
}

function gotLocalIceCandidate(event){
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    console.log("Local ICE candidate: \n" + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event){
  if (event.candidate) {
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    console.log("Remote ICE candidate: \n " + event.candidate.candidate);
  }
}
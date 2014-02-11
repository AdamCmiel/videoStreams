# Video Streams with webRTC

This app builds video chat rooms with webRTC.  WebRTC is a neat technology that allows for browser-only peer-to-peer connections, that is, without intermediate servers.  Currently this is only feasible with an intermediate server that establishers the connection, through STUN, TURN, web sockets, or HTTP protocol, in decreasing fanciness and impressiveness.  

## To use:

Run index.js with nodejs (preferrably [nodemon](https://www.npmjs.org/package/nodemon))

```bash
node index.js
```

Navigate to `hostname:port/chat/:room`, where `:room` is any string, it could be `3`, `threeve`, `dogeroom` or `my_cat_is_a_liar`.

Once there, make a friend and invite them to the chatroom at the same URL.

Then, once you both see yourselves in the local viewport, one of you can make a call by pressing the `Make a Call` button.  Cross your fingers, and with any luck you'll have a webchat going!

## How it works:

This app is build on Express on Nodejs with Angularjs running on the client.  Chat rooms are created on the server through activity over connections with socket.io.  

Views are served by Angularjs and the connection is established through a low-level RTC connection API with Javascript.  webRTC gives Javascript code in the browser access to the user's webcam and microphone through the `navigator.getUserMedia()` API.  With some elbow grease and a little pixie dust, the data stream from these inputs is plugged into the right views with a handshake over socket.io.  

Theoretically, the socket connection could be closed once the p2p connection is established and the connection would persist. 

## Technologies Used:

- webRTC - HTML5
- Angular.js
- Express.js
- socket.io
- Node.js
- CoffeeScript
- Jade
- jQuery
- CSS

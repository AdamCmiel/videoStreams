$( window ).resize(resizeVideos);

function resizeVideos() {
  $('#remoteVideo').attr('height', window.innerHeight).attr('width', window.innerWidth)
                  .css('top', 0).css('left', 0);
  $('#localVideo').attr('height', window.innerHeight * 0.33).attr('windth', window.innerWidth * 0.33)
                  .css('top', window.innerHeight * 0.67).css('left', window.innerWidth * 0.67);
};

setInterval(resizeVideos, 100);
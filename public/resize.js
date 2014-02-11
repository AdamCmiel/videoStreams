$( window ).resize(function() {
  $('#remoteVideo').attr('height', window.innerHeight).attr('width', window.innerWidth);
  $('#localVideo').attr('height', window.innerHeight * 0.33).attr('windth', window.innerWidth * 0.33)
                  .css('top', window.innerHeight * 0.67).css('left', window.innerWidth * 0.67);
});

$('#callButton').click(function(){
  $('#callButton').hide();
});
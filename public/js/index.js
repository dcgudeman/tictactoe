
$(document).ready ( function(){

  var socket = io();
  //var socket2 = io('/game');

/*  $('.newgame').on('click',function(event){
    socket2.emit('choice', {roomid: socket2, index: index});
  });*/

/*  $('<li>').on('click', function(){

  });*/

  socket.on('opengame', function (data) {
    $('#opengames').append(
      $('<li>').append(
        $('<a>').attr('href','/game/'+data.id).append(data.id)
        )
      );
  });


 $(".client").on('click',function(event){
    event.preventDefault();
    //socket.emit('clients');
    //console.log(socket);
    var r = window.confirm("sometext");
    console.log(r);
  });


/*  socket.on('gotnewboard', function (data) {



    });*/


});

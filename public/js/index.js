
$(document).ready ( function(){

  var socket = io();

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
    console.log(socket);
    var r = window.confirm("sometext");
    console.log(r);
  });

});

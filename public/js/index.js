
$(document).ready ( function(){

  var socket = io();

  socket.on('opengame', function (data) {
    $('#opengames').append(
      $('<li>').attr('id', data.id).append(
        $('<a>').attr('href','/game/'+data.id).attr('class','btn btn-primary btn-lg opengame').append(data.id)
        )
      );
  });

  socket.on('closegame', function (data) {
    $( "#"+data.roomid ).remove();
  });

 // $(".client").on('click',function(event){
 //    event.preventDefault();
 //    //socket.emit('clients');
 //    console.log(socket);
 //    var r = window.confirm("sometext");
 //    console.log(r);
 //  });

});

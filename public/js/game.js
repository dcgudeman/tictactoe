

$(document).ready ( function(){

  var socket = io('/game');
  var urlArray = window.location.pathname.split("/");
  var roomid = "";

  if(urlArray.length > 2)
  {
    roomid = urlArray[2];
    socket.emit('joinroom',roomid);
  }


  var gamestate = "         ";
  var whosTurn = 1;

  var setBoard = function(){
    $('.cell').each(function(index, element){
      if(gamestate[index] !== " ")
        $(element).text(gamestate[index]);
    });
  };
  $('#myModal').on('hidden.bs.modal', function (e) {
    window.location.pathname = "/";
  });


  $('.cell').each(function(index, element){

    $(element).on('click',function(event){
      console.log("index is", index);
      console.log($(element).text());
      if($(element).text() === "")
      {
        socket.emit('choice', {gamestate: gamestate, index: index, whosTurn: whosTurn});
/*        $.ajax({
          type: "POST",
          url:"http://localhost:3000",
          dataType: "json",
          data: {
            index: index,
            gamestate: gamestate
          }
        }).then(
        function(data, textStatus, jqXHR){
          console.log(data);
          console.log("success");

          gamestate = data.gamestate;

          setBoard();

        },
        function(jqXHR, textStatus, errorThrown){
          console.log(errorThrown);
          console.log("error");
        });*/
      }

    });
  });

  socket.on('gotnewboard', function (data) {

    console.log(data);
    whosTurn = data.whosTurn;
    gamestate = data.gamestate;
    console.log(data.gameover);
    if(data.gameover !== -1)
      $('#myModal').modal('show');

    setBoard();

  });






});

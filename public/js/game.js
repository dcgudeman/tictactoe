

$(document).ready ( function(){

  var socket = io('/game');
  var urlArray = window.location.pathname.split("/");
  var roomid = "";
  var gamestate = "         ";
  var whosTurn = 0;

  if(urlArray.length > 2)
  {
    roomid = urlArray[2];
    socket.emit('joinroom',roomid);
    $("#status").text("It's your opponents turn");
  }
  else
  {
    $("#status").text("Waiting for another player to join your game....");
    socket.emit('newgame');
  }

  socket.on('start',function(){
    whosTurn = 1;
    $("#status").text("Your turn");

  });




  var setBoard = function(){
    $('.cell').each(function(index, element){
      if(gamestate[index] !== " ")
        $(element).text(gamestate[index]);
    });
  };
  $('#myModal').on('hidden.bs.modal', function (e) {
    window.location.replace("/");
  });

  socket.on("redirect",function(){
    window.location.replace("/");
  });


  $('.cell').each(function(index, element){

    $(element).on('click',function(event){
      if($(element).text() === "" && whosTurn !== 0)
      {
        socket.emit('choice', {gamestate: gamestate, index: index, whosTurn: whosTurn});
      }

    });
  });

  socket.on('gotnewboard', function (data) {

    //console.log(data);
    whosTurn = data.whosTurn;
    gamestate = data.gamestate;

    console.log(whosTurn);

    if(whosTurn !== 0 && whosTurn%2 === 0 && urlArray.length > 2)
      $("#status").text("Your turn");
    else if(whosTurn !== 0 && whosTurn%2 === 1 && urlArray.length === 2)
      $("#status").text("Your turn");
    else if(whosTurn !== 0)
      $("#status").text("It's your opponents turn");

    //console.log(data.gameover);
    if(data.gameover !== -1)
    {
      $('#myModal').modal('show');
      if(data.gameover === 0)
        $('.modal-body').text('You Tied');
      else if(data.gameover === "O" && urlArray.length > 2)
        $('.modal-body').text('You Won!!');
      else if(data.gameover === "X" && urlArray.length === 2)
        $('.modal-body').text('You Won!!');
      else
        $('.modal-body').text('You Lost...');
    }

    setBoard();

  });






});

$(document).ready ( function(){

  var socket = io();


  var gamestate = "         ";



  var setBoard = function(){
    $('.cell').each(function(index, element){
      //$(element).val(gamestate[index]);
      if(gamestate[index] !== " ")
        $(element).text(gamestate[index]);
    });
  };




  $('.cell').each(function(index, element){

    $(element).on('click',function(event){
      console.log("index is", index);
      console.log($(element).text());
      if($(element).text() === "")
      {
        socket.emit('choice', {gamestate: gamestate, index: index});
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
    gamestate = data.gamestate;
    setBoard();

    });






});


var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = io.of('/game');
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var usercount = 0;

var findClientsSocket = function (roomId, namespace) {
    var res = [];
    var ns = io.of(namespace || "/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
};

var gameStatus = function(gamestate) {

  for (var i = 0; i < 9; i+=3)
    if(gamestate[i] !== " " && gamestate[i] === gamestate[i+1] && gamestate[i] === gamestate[i+2])
    {
      if(gamestate[i] === "X")
        return "X";
      else
        return "O";
    }

  for (var i = 0; i < 3; i++)
    if(gamestate[i] !== " " && gamestate[i] === gamestate[i+3] && gamestate[i] === gamestate[i+6])
    {
      if(gamestate[i] === "X")
        return "X";
      else
        return "O";
    }


  if(gamestate[0] !== " " && gamestate[0] === gamestate[4] && gamestate[0] === gamestate[8])
  {
      if(gamestate[0] === "X")
        return "X";
      else
        return "O";
  }

  if(gamestate[2] !== " " && gamestate[2] === gamestate[4] && gamestate[2] === gamestate[6])
  {
      if(gamestate[2] === "X")
        return "X";
      else
        return "O";
  }

  var count = 0;

  for (var i = 0; i<gamestate.length; i++)
    if ( gamestate[i] !== " ")
      count++;

  if (count === gamestate.length)
    return 0;

  return -1;

};



game.on('connection',function(socket){


  var gameVar = "         ";
  var whosTurn = 1;



  io.emit('opengame', {id: socket.id});

  socket.on('joinroom',function(roomid){
    socket.join(roomid);
    console.log("success");
  });




  socket.on('choice', function (data) {
    var roomsArray = socket.rooms;
    var roomid = "";
    var gameover = -1;
    var index = parseInt(data.index);
    whosTurn = data.whosTurn;

    if(roomsArray.length>1)
      roomid = roomsArray[1];
    else
      roomid = roomsArray[0];


    if(whosTurn%2 === 1 && roomsArray.length === 1)
    {
      gameVar = data.gamestate.substring(0,index) + "X" + data.gamestate.substring(index+1);
      whosTurn++;
      console.log(whosTurn);
      gameover = gameStatus(gameVar);
      game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
    }
    else if(whosTurn%2 === 0 && roomsArray.length === 2)
    {
      gameVar = data.gamestate.substring(0,index) + "O" + data.gamestate.substring(index+1);
      whosTurn++;
      console.log(whosTurn);
      gameover = gameStatus(gameVar);
      game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
    }

  });



  socket.on('disconnect', function () {
    console.log("game user disconnected");
  });
});






io.on('connection', function(socket){


  socket.on('disconnect', function () {
    console.log("user disconnected");
  });

});

app.get("/", function(req,res){

  var clients = findClientsSocket(null, '/game');

  res.render('index',{clients: clients});
});


app.get("/newgame",function(req,res){

  res.render('game', {newgame: true});
});

app.get("/game/:roomid", function(req,res){

  var roomid = req.params.roomid;

  var clients = findClientsSocket(roomid, '/game');

  console.log(clients);

  res.render('game');
});



http.listen(3000, function(){
  console.log("get this party started on port 3000");
});

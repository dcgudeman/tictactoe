
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

var valueAssigner = function(gameVar,choiceIndex,depth){
  var newGameVar = "";
  //console.log(depth);
  if(depth%2 === 0)
  {
    console.log(gameVar);
    newGameVar = gameVar.substring(0,choiceIndex) + "O" + gameVar.substring(choiceIndex+1);
  }
  else
  {
    //console.log("player choice");
    newGameVar = gameVar.substring(0,choiceIndex) + "X" + gameVar.substring(choiceIndex+1);
  }

  var isGameOver = gameStatus(newGameVar);

  if(isGameOver === "O")
    return (1)*Math.pow(0.5, depth);
  else if(isGameOver === "X")
    return (-1)*Math.pow(0.5, depth);
  else if(isGameOver === 0)
    return 0;
  else
  {
    var newDepth = depth + 1;
    var sum = 0;
    for(var i = 0; i < newGameVar.length; i++)
    {
      if(newGameVar[i] === " ")
      {
        sum = sum + valueAssigner(newGameVar,i,newDepth);
      }
    }

    return sum;
  }
};

var computerChoiceMaker = function(gameVar){
  var bestChoice = -1;
  var valueOfCurrentChoice = 0;

  for(var i = 0; i < gameVar.length; i++)
  {
    if(gameVar[i] === " ")
    {
      if(bestChoice === -1)
      {
        bestChoice = i;
        valueOfCurrentChoice = valueAssigner(gameVar,i,0);
      }
      else
      {
        var temp = valueAssigner(gameVar,i,0);

        //console.log("value", temp);
        //console.log("gameVar", gameVar);

        if(temp > valueOfCurrentChoice)
        {
          bestChoice = i;
          valueOfCurrentChoice = temp;
        }
      }
    }
  }

  return bestChoice;
};



game.on('connection',function(socket){


  var gameVar = "         ";
  var whosTurn = 1;


  console.log(socket);

  socket.on('newgame',function(){
    io.emit('opengame', {id: socket.id});
  });




  socket.on('joinroom',function(roomid){
    socket.join(roomid);
    io.emit('closegame',{roomid:roomid});
    var firstPlayer = game.sockets.filter(function(element){
      return element.id === roomid;
    });
    firstPlayer = firstPlayer[0];


    console.log(firstPlayer);
    firstPlayer.emit('start');
    //game.sockets;
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

  socket.on('computerchoice', function (data) {
    var roomsArray = socket.rooms;
    var roomid = roomsArray[0];
    var gameover = -1;
    var index = parseInt(data.index);
    whosTurn = data.whosTurn;
    console.log(whosTurn%2);
    if(whosTurn%2 === 1)
    {
      gameVar = data.gamestate.substring(0,index) + "X" + data.gamestate.substring(index+1);
      whosTurn++;
      gameover = gameStatus(gameVar);

      if(gameover !== -1)
      {
        game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
      }
      else
      {
        var optChoice = computerChoiceMaker(gameVar);
        gameVar = gameVar.substring(0,optChoice) + "O" + gameVar.substring(optChoice+1);
        whosTurn++;
        gameover = gameStatus(gameVar);
        game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
      }
    }














    // if(whosTurn%2 === 1 && roomsArray.length === 1)
    // {
    //   gameVar = data.gamestate.substring(0,index) + "X" + data.gamestate.substring(index+1);
    //   whosTurn++;
    //   console.log(whosTurn);
    //   gameover = gameStatus(gameVar);
    //   game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
    // }
    // else if(whosTurn%2 === 0 && roomsArray.length === 2)
    // {
    //   gameVar = data.gamestate.substring(0,index) + "O" + data.gamestate.substring(index+1);
    //   whosTurn++;
    //   console.log(whosTurn);
    //   gameover = gameStatus(gameVar);
    //   game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
    // }

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

  var rooms = clients.map(function(client){
    return client.rooms;
  });

  var firstplayers = rooms.filter(function(element){
      return element.length === 1;
  });

  var secondplayers = rooms.filter(function(element){
      return element.length === 2;
  });

  var opengames = firstplayers.filter(function(element){
    var bool = true;
    secondplayers.forEach(function(e){
      if(element[0] === e[1])
        bool = false;
    });
    return bool;
  });

  opengames = opengames.map(function(element){return element[0];});


  console.log("opengames",opengames);




  res.render('index',{opengames: opengames});
});


app.get("/newgame",function(req,res){
  var computergame = false;
  if(req.query.player === "computer")
    computergame = true;


  res.render('game',{computergame: computergame});
});

app.get("/game/:roomid", function(req,res){
  //var roomid = req.params.roomid;
  //var clients = findClientsSocket(roomid, '/game');
  //console.log(clients);

  res.render('game',{computergame: false});
});



http.listen(3000, function(){
  console.log("get this party started on port 3000");
});

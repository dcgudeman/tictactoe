
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = io.of('/game');
var computerNs = io.of('/computer');
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var usercount = 0;

var printGame = function(gameVar,score){
  var readable = gameVar.replace(/ /gi,"*");
  console.log(readable.substring(0,3), score);
  console.log(readable.substring(3,6));
  console.log(readable.substring(6));
  console.log("\n");

};

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
  var getMaxOfArray = function (numArray) {
    return Math.max.apply(null, numArray);
  };
  var getMinOfArray = function (numArray) {
    return Math.min.apply(null, numArray);
  };
  //console.log(depth);
  if(depth%2 === 0)
  {
    //console.log(gameVar);
    newGameVar = gameVar.substring(0,choiceIndex) + "O" + gameVar.substring(choiceIndex+1);
  }
  else
  {
    //console.log("player choice");
    newGameVar = gameVar.substring(0,choiceIndex) + "X" + gameVar.substring(choiceIndex+1);
  }

  var isGameOver = gameStatus(newGameVar);

  if(isGameOver === "O")
    return (10);
  else if(isGameOver === "X")
    return (-10);
  else if(isGameOver === 0)
    return 0;
  else
  {

    var newDepth = depth + 1;
    var choices = [];
    for(var i = 0; i < newGameVar.length; i++)
    {
      if(newGameVar[i] === " ")
      {
        choices.push(valueAssigner(newGameVar,i,newDepth));
      }
    }

    if(newDepth%2 === 0)
      return getMaxOfArray(choices);
    else
      return getMinOfArray(choices);

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
        printGame(gameVar.substring(0,bestChoice) + "O" + gameVar.substring(bestChoice+1),valueOfCurrentChoice);
        //console.log(valueOfCurrentChoice);
      }
      else
      {
        var temp = valueAssigner(gameVar,i,0);

        //console.log("value", temp);
        //console.log("gameVar", gameVar);
        printGame(gameVar.substring(0,i) + "O" + gameVar.substring(i+1),temp);
        //console.log(temp);

        if(temp > valueOfCurrentChoice)
        {
          bestChoice = i;
          valueOfCurrentChoice = temp;
        }
      }
    }

  }

  console.log("----------------------------------------------------");

  return bestChoice;
};

computerNs.on('connection',function(socket){
  var gameVar = "         ";
  var whosTurn = 1;


  socket.on('computerchoice', function (data) {
    var roomsArray = socket.rooms;
    var roomid = roomsArray[0];
    var gameover = -1;
    var index = parseInt(data.index);
    whosTurn = data.whosTurn;
    //console.log(whosTurn%2);
    if(whosTurn%2 === 1)
    {
      gameVar = data.gamestate.substring(0,index) + "X" + data.gamestate.substring(index+1);
      whosTurn++;
      gameover = gameStatus(gameVar);

      if(gameover !== -1)
      {
        computerNs.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
      }
      else
      {
        var optChoice = computerChoiceMaker(gameVar);
        gameVar = gameVar.substring(0,optChoice) + "O" + gameVar.substring(optChoice+1);
        whosTurn++;
        gameover = gameStatus(gameVar);
        computerNs.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
      }
    }

  });







  socket.on('disconnect', function () {
    console.log("game user disconnected");
  });
});

game.on('connection',function(socket){

  socket.occupied = false;

  console.log(socket);


  var gameVar = "         ";
  var whosTurn = 1;


  socket.on('newgame',function(){
    io.emit('opengame', {id: socket.id});
  });




  socket.on('joinroom',function(roomid){

    var sockets = findClientsSocket(roomid,"/game");

    console.log(sockets.length);

    if(sockets.length === 1)
    {
     socket.join(roomid);
    }
    else
    {
      socket.emit("redirect");
    }
    io.emit('closegame',{roomid:roomid});
    var firstPlayer = game.sockets.filter(function(element){
      return element.id === roomid;
    });
    firstPlayer = firstPlayer[0];

    firstPlayer.occupied = true;
    firstPlayer.emit('start');

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
      //console.log(whosTurn);
      gameover = gameStatus(gameVar);
      game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
    }
    else if(whosTurn%2 === 0 && roomsArray.length === 2)
    {
      gameVar = data.gamestate.substring(0,index) + "O" + data.gamestate.substring(index+1);
      whosTurn++;
      //console.log(whosTurn);
      gameover = gameStatus(gameVar);
      game.to(roomid).emit('gotnewboard', {gamestate: gameVar, whosTurn: whosTurn, gameover: gameover});
    }

  });

/*  socket.on('computerchoice', function (data) {
    var roomsArray = socket.rooms;
    var roomid = roomsArray[0];
    var gameover = -1;
    var index = parseInt(data.index);
    whosTurn = data.whosTurn;
    //console.log(whosTurn%2);
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

  });*/


  socket.on('disconnect', function () {
    //io.emit('closegame',{roomid: socket.id});

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

  clients = clients.filter(function(element){
    console.log(element);
      return !element.occupied;
  });

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
      console.log(element[0].occupied);
      if(element[0] === e[1] && !element[0].occupied)
        bool = false;
    });
    return bool;
  });

  opengames = opengames.map(function(element){return element[0];});


  //console.log("opengames",opengames);




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

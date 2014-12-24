
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });
});


app.get("/",function(req,res){



  //console.log(req.body);
  var test = "David Gudeman";

  res.render('index',{variable: test});
});


app.post("/",function(req,res){



  console.log(req.body);

  var index = parseInt(req.body.index);
  var gamestate = req.body.gamestate.substring(0,index) + "X" +req.body.gamestate.substring(index+1);




  res.json({gamestate: gamestate, index: index});
  //res.render({variable: test});
});






http.listen(3000, function(){
  console.log("get this party started on port 3000");
});
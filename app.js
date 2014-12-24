
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));





app.get("/",function(req,res){



  //console.log(req.body);
  var test = "David Gudeman";





  res.render('index',{variable: test});
});

app.post("/",function(req,res){



  console.log(req.body);
  var test = req.body.gamestate;




  res.json({gamestate: req.body.gamestate, index: req.body.index});
  //res.render({variable: test});
});






app.listen(3000, function(){
  console.log("get this party started on port 3000");
});
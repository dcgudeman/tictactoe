/*var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('./public'));*/
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use( express.static(__dirname + '/public'));


app.get("/",function(req,res){



  //console.log(req.body);
  var test = "David Gudeman";





  res.render('index',{variable: test});
});

app.post("/",function(req,res){



  console.log(req.body);
  var test = req.body.name;





  res.render('index',{variable: test});
});






app.listen(3000, function(){
  console.log("get this party started on port 3000");
});
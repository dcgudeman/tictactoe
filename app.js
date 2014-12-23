var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('./public'));





app.get("/",function(req,res){



  var test = "David Gudeman";





  res.render('index',{variable: test});
});






app.listen(3000, function(){
  console.log("get this party started on port 3000");
});
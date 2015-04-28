var express = require('express');
// var bodyParser = require('body-parser');

var app = express();

// Parse forms (signup/login)

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

console.log('Shortly is listening on 4568');
app.listen(4568);
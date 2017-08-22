const express = require('express');
const getTweets = require('./twit.js');

var app = express();

// view engine setup
app.set('view engine', 'pug');


app.use(function(req,res,next){
  console.log(req.method, ' ',req.url); next();
});

app.use(express.static('public'));


app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/api', function(req, res, next) {
  // Function is a promise factory
  getTweets()
  .then(tweets => res.json(tweets))
  .catch(function(error){
    console.log(error);
    res.send("Error "+error);
  });
});


//404, app will fall back to this middleware if none of the others are used
app.use(function(req, res, next) {
  res.statusCode = 404;
  res.render('error');
});


//init server, will use PORT environment variable if available, for Heroku deployment
var server = app.listen(process.env.PORT || 3000, function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

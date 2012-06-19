
var express = require('express');
var app = express.createServer();
var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: 'Twitter',
  consumer_secret: 'API',
  access_token_key: 'keys',
  access_token_secret: 'go here'
});

app.get('/', function(req, res){
  res.send('Welcome to twitter motherfucker');
});

app.listen(3000);

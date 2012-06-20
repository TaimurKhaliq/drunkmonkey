
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var io = require('socket.io');
var app = module.exports = express.createServer();
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: 'pvEdFz2h31xU4SMH88VHQ',
  consumer_secret: 'xx2tBq0g2e8TLXV88AuBFiWurGldL22sRRrdZKItUr0',
  access_token_key: '519032317-OqeLHC4HCcKrUSKgPfzuykZSOuuH6t9CvshSViFi',
  access_token_secret: 'tRzdjC0CTJ8p7mJIbCdEosgGcIZTKP9375mrf5FPi4c'
});


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});
app.listen(3000);
var io = io.listen(app);

// Routes

app.get('/', routes.index);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

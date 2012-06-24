//
// requirements
//
var express = require('express'); 
var routes = require('./routes');
var connect = require('connect');
var io = require('socket.io');
var parseCookie = connect.utils.parseCookie;
var Session = connect.middleware.session.Session;
var twitter = require('ntwitter');

//
// instantiation
//
var twit = new twitter({
  consumer_key: 'pvEdFz2h31xU4SMH88VHQ',
  consumer_secret: 'xx2tBq0g2e8TLXV88AuBFiWurGldL22sRRrdZKItUr0',
  access_token_key: '519032317-OqeLHC4HCcKrUSKgPfzuykZSOuuH6t9CvshSViFi',
  access_token_secret: 'tRzdjC0CTJ8p7mJIbCdEosgGcIZTKP9375mrf5FPi4c'
});

var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

var app = module.exports = express.createServer();

//
// app configuration
// 
app.configure(function(){
  app.set("view options", {layout: false});
  app.register('html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });

  app.set('view engine', 'html'); 
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({store: sessionStore
        , secret: 'secret'
        , key: 'express.sid'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var io = io.listen(app);

var port = process.env.PORT || 5000;

app.listen(port);

io.configure('production', function(){
	io.set("transports", ["xhr-polling", "flashsocket", "json-polling"]);
});

//
// Websocket server configuration
//
io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];
        // save the session store to the data object 
        // (as required by the Session constructor)
        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                accept('Error', false);
            } else {
                // create a session object, passing data as request and our
                // just acquired session data
                data.session = new Session(data, session);
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});



//
// Server begins here
//
app.get('/', function (req, res) {
	res.render("index.html");
});

var clients = {};

io.sockets.on('connection', function (socket) 
{
	var hs = socket.handshake;
    console.log('A socket with sessionID ' + hs.sessionID 
        + ' connected!');

	clients[hs.sessionID] = socket.id;

    // setup an inteval that will keep our session fresh
    var intervalID = setInterval(function () {
        // reload the session (just in case something changed,
        // we don't want to override anything, but the age)
        // reloading will also ensure we keep an up2date copy
        // of the session with our connection.
        hs.session.reload( function () { 
            // "touch" it (resetting maxAge and lastAccess)
            // and save it back again.
            hs.session.touch().save();
        });
    }, 60 * 1000);

	socket.on('tweetSearch', function(data)
	{
		console.log('A socket with sessionID ' + socket.handshake.sessionID + ' connected!');
	
		var toSearch = data;
		
		twit.stream('user', {track: toSearch}, function(stream) 
		{
			stream.on('data', function (data) 
			{
				var sockId = clients[hs.sessionID];
				io.sockets.socket(sockId).emit('searchResult', data );
		    });
			
		    stream.on('end', function (response) 
			{
		        // Handle a disconnection
		    });

		    stream.on('destroy', function (response) 
			{
		        // Handle a 'silent' disconnection from Twitter, no end/error event fired
		    });
		});
	});
	
	socket.on('disconnect', function () 
	{
        console.log('A socket with sessionID ' + hs.sessionID + ' disconnected!');
        // clear the socket interval to stop refreshing the session
        clearInterval(intervalID);
	});
});

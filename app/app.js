
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
 
var io = require('socket.io').listen(server);


var five = require("johnny-five"),
    board, photoresistor, INTERVAL_ID;

var photovalue = 0;

board = new five.Board();
 
  /**
 * Server and socket started, below are all my listeners and emitters
 */






board.on("ready", function() {

  // Create a new `photoresistor` hardware instance.
  photoresistor = new five.Sensor({
    pin: "A2",
    freq: 250
  });

  // Inject the `sensor` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    pot: photoresistor
  });

  // "read" get the current reading from the photoresistor
  // and store the value in photovalue
  photoresistor.on("read", function( err, value ) {
    console.log( value, this.normalized );
    photovalue = value;
  });

    
});


//serve all host connections
io.sockets.on('connection', function(socket){
  console.log("Socket connected"); 
  socket.emit('connected', 123);

  INTERVAL_ID = setInterval(function(){
    socket.emit('sendData', photovalue );
  }, 500);

 
});


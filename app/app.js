
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
 
  /**
 * Server and socket started, below are all my listeners and emitters
 */
 
io.sockets.on('connection', function(socket){
  console.log("Socket connected"); 
  socket.emit('connected', 123);
 
  sp.on('close', function (err) {
    console.log('port closed');
  });
 
  sp.on('error', function (err) {
    console.error("error", err);
  });
 
  sp.on('open', function () {
    console.log('port opened...');
  });
});




var five = require("johnny-five"),
    board, photoresistor;

board = new five.Board();

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
  photoresistor.on("read", function( err, value ) {
    console.log( value, this.normalized );

    socket.emit('sendData', value );



  });
});


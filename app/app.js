
/**
 *  Module dependencies
 *
 *  Node.js uses the Common.js style of Asynchronous Module Definitions (AMD), which assigns a variable,
 *  such as "express" below, to the exported objects of a module (another javascript file) through the
 *  require() function.
 */
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

/**
*
* app is the main export of the express module, it exposes the setup and server objects and functions
* that we need to setup and run an Express.js web server.
*
**/

var app = express();

/**
*
* app.set() will set any necessary environment variables for this Express.js app, such as which port
* to listen on, which directory the views are stored in that need to be rendered, and which render
* engine (ejs is used here) is used to convert the views to HTML that can be served to web browsers.
*
**/
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/**
*
* app.use() sets up the middleware, additional functions that we can take advantage of to make building
* and serving the app easier, such as the Express.js bodyParser, which presents the elements of a POST
* request form as objects that we can easily pull from the request (req) object. It also sets up the
* static directories, which are those that serve static files that don't need to be rendered (eg. anything
* in the public directory).
*
**/
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

/**
*
* Here, we set any additional Express.js app environment variables or middleware that we want to use
* exclusively in our development site, as opposed to the production site. For this tutorial, we will
* only concern ourselves with development, rather than adding special features to improve performance,
* limit logging, etc, that we would want on a production web app.
*
**/
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/**
*
* Here we set up the routes: which functions should be called when a user goes to different pages in the app.
* The app.get(param1, param2) function will catch any get request and compare it to param1. If the URL pathname
* matches param1, it will execute param2, which should be a function. In this case, we are routing to a function
* called index that is declared in the index.js file stored in the routes/ directory (the variable routes was set 
* to this file in the module declarations in the top of this file)
*
**/
app.get('/', routes.index);

/**
*
* Set up the Express.js server using the HTTP module provided by Node.js by passing the app variable that you 
* have previously set up (using the set, use and get functions) to the createServer() function of the HTTP module
* and have it listen to the given port, in this case 3000. This will log out a message to the console once the server 
* is live (the second parameter of the listen() function is a callback, so this function will be called once the 
* listen() function is complete).
*
**/
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/**
*
* Set up the web socket server by loading the module using require() and have it listen to the http server you just
* set up above.
*
**/
var io = require('socket.io').listen(server);

/**
*
* Set up the Johnny-Five module
*
**/

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
    freq: 60000//originally 250, assuming this is in millisec
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
    io.emit('sendIt', this.normalized );

  });

    
});


//serve all host connections
io.sockets.on('connection', function(socket){
  console.log("Socket connected"); 
  socket.emit('connected', 123); 

  io.on('sendIt', function(val){
    console.log('');
    console.log('***data to send is '+ val);
    socket.emit('sendData', val);
  });
});






/*
 * =====================================================================================
 *
 *		@title: app.js
 *		@authors: JabbaTheGimp (anthdel.developer@gmail.com)
 *
 *    	@Description: 
 *
 *		@version: 
 *     	@date:	2014-04-30 15:18:58
 *
 * =====================================================================================
 */

var PORT_NO = 8080;

var appName = 'Tweet-Matrix',
	express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

// handle uncaught exception
process.on('uncaughtException', function(err)
{
	console.error(err.stack);
});

app.get('/tunein', function(request, response)
{
	response.send(require('./server/tunein').getChannel());
});

// configure the server
app.configure(function() 
{
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler(
	{
		dumpExceptions: true,
		showStack: true
	}));
});

// start the server
try 
{
	server.listen(PORT_NO);
	console.log('server is listening on port: ' + PORT_NO);
} catch (err) 
{
	console.error('Server didn\'t start: ' + err);
}

// manage sockets
var action = { doing: 'doing', to: 'nothing' };
io.set('log level', 2);
io.sockets.on('connection', function(socket) 
{
	console.log('New user connected: ' + socket.id);
	socket.emit('connected', { hello: 'Welcome!', currently: action });

	// define socket events
	socket.on('stream.sample', function() 
	{
		require('./server/stream').sample(io);
		action = { doing: 'Sample' };
	});

	socket.on('disconnect', function() 
	{
		console.log('User disconnected!');
	});
});
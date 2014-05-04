/*
 * =====================================================================================
 *
 *		@title: stream.js
 *		@authors: JabbaTheGimp (anthdel.developer@gmail.com)
 *
 *    	@Description: 
 *
 *		@version: 
 *     	@date:	2014-04-30 15:27:08
 *
 * =====================================================================================
 */
var request = require('request'),
	util = require('util'),
    twitter = require('twit'),
    backoff = require('backoff'),
	appCreds = require('./app_credentials'),
	oauth = appCreds.getOAuthSettings(),
	accessTokens = appCreds.getAccessToken();

// create backoff strategy object
var expoBackoff = backoff.exponential(
{
	randomisationFactor: 0,
    initialDelay: 1000,
    maxDelay: 10000
});

// create a twitter object using twit
console.log('Creating twitter object....');
var twit = new twitter( 
{
	consumer_key: oauth.consumer_key,
	consumer_secret: oauth.consumer_secret,
	access_token: accessTokens.access_token_key,
	access_token_secret: accessTokens.access_token_secret
});

exports.sample = function(socket) 
{
	startStream(socket);
}

function startStream(io) 
{
	var broadcastChannel = require('./tunein').getChannel(),
		stream = twit.stream('statuses/sample', { lang: 'en' } );

	stream.on('tweet', function(tweet) 
	{
		if (tweet.user.lang == 'undefined' || tweet.user.lang != 'en')
		{
			return;
		}
		io.sockets.emit(broadcastChannel, { 'tweet': tweet });
	});

	stream.on('disconnect', function(message)
	{
		console.log(message);
	});

	stream.on('error', function(error)
	{
		console.log(error);
		stream.stop();
	});

	expoBackoff.on('backoff', function(number, delay)
	{
		console.log(number + ' ' + delay + 'ms');
		stream.start();
	});

	expoBackoff.on('ready', function(number, delay)
	{
		expoBackoff.backoff();
	});
}


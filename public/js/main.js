/*
 * =====================================================================================
 *
 *		@title: main.js
 *		@authors: JabbaTheGimp (anthdel.developer@gmail.com)
 *
 *    	@Description: creates our twitter matrix and sets their content with tweets
 *		from the stream.
 *
 *		@version: 
 *     	@date:	2014-04-30 15:51:16
 *
 * =====================================================================================
 */
'use strict';

$(function()
{
	var tweetMatrix,
		lastTweetId = 0;

	// a quickie fucking IE fix
	if (!window.location.origin)
	{
		window.location.origin = window.location.protocol + "//" + window.location.host;
	}

	// make initial connection and begin socket io
	$.ajax(
	{
		url: window.location.origin + "/tunein",
		async: false,	
		error: function(error) 
		{
			console.log("Couldn't work out which channel to tune in to...");
		},
		success: function(channel) 
		{
			tweetMatrix = new TweetMatrix();
			startSockets(channel);
		}
	});

	function startSockets(channel)
	{
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = window.location.origin + "/socket.io/socket.io.js";

		script.onload = function()
		{
			var socket = io.connect(window.location.origin);
			socket.on('connected', function(message)
			{
				// begin streaming tweets 
				socket.emit('stream.sample');
				socket.on(channel, function(response)
				{
					// get any available or non busy cells
					var cell = tweetMatrix.getAvailableCell();
					if (cell !== null && response.tweet.id !== lastTweetId)
					{
						// set the cell content if its not busy, we also need to check whether this tweet is equal to the one that was previously set
						// as we don't want duplicates in the matrix. using the tweet numeric ID for comparison.
						var screenName = response.tweet.user.screen_name;
						cell.setContent(response.tweet.text, screenName, "https://twitter.com/" + screenName);
						lastTweetId = response.tweet.id;
					} 
				});
			});
		};

		// append the script to our html head
		head.appendChild(script);
	}
});
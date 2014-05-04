/*
 * =====================================================================================
 *
 *		@title: utils.js
 *		@authors: JabbaTheGimp (anthdel.developer@gmail.com)
 *
 *    	@Description: various utility functions.
 *
 *		@version: 
 *     	@date:	2014-04-28 18:18:07
 *
 * =====================================================================================
 */
'use strict';

var Utils = {

	getRandomArbitary: function(min, max)
	{
    	return Math.random() * (max - min) + min;
	},

	getRandomInt: function(min, max)
	{
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	formatPost: function(raw)
	{
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		raw = raw.replace(exp, "<a href='$1' rel='external'>$1</a>");
		var exp = /[\@]+([A-Za-z0-9-_]+)/ig;
		raw = raw.replace(exp, "<a href='search.php?q=from%3A$1' rel='external'>@$1</a>");
		var exp = /[\#]+([A-Za-z0-9-_]+)/ig;
		raw = raw.replace(exp, "<a href='search.php?q=%23$1' rel='external'>#$1</a>");

		return raw;
	}
}
/*
 * =====================================================================================
 *
 *		@title: trend-cell.js
 *		@authors: JabbaTheGimp (anthdel.developer@gmail.com)
 *
 *    	@Description: a class to encapsulate a single cell in the matrix.
 *
 *		@version: 
 *     	@date:	2014-04-27 01:40:49
 *
 * =====================================================================================
 */
var TweetCell = (function()
{
	var TweetCell = function(x, y)
	{
		this.id = y + '-' + x;
		this.position = { x: x, y: y };
		this.isBusy = false;
		this._colors = ['#55acee', '#66757f', '#8899a6'];
		this._rotationAnimations = ['rotateX', 'rotateY', 'rotateNegX', 'rotateNegY'];
		this._currentRotationAnimation = "rotateY";
		this._lastBackgroundColor;

		// create our cell div
		this._matrixContainer = $('#matrix-container').append("<div id=\"" + this.id + "\" class=\"trend-cell\"></div>");

		// create our content divs
		this._cell = $('#' + this.id).append("<div class=\"front\"></div>");
		this._frontPanel = $('.front', '#' + this.id).append("<div class=\"trend-typing\"></div>");
		this._frontPanel.append("<div class=\"author\"></div>");
		this._author = $('.author', '#' + this.id);
		this._typedText = $('.trend-typing', '#' + this.id);

		// initially set our content
		this._lastBackgroundColor = this._colors[Math.floor(Math.random() * this._colors.length)];
		$('#' + this.id).css('background-color', this._lastBackgroundColor);
	}

	TweetCell.prototype.constructor = TweetCell;

	TweetCell.prototype.resize = function(screenSize, numCols, numRows)
	{
		// calculate our new width and height
		var newWidth = screenSize.w / (numCols);
		var newHeight = screenSize.h / (numRows);
		var gap = screenSize.h / newHeight + 3; // this just mudda farkin works ok!
		newHeight -= gap / 2; // ...yep mate

		// set the cells new style properties
		this._cell.css('width', newWidth + 'px');
		this._cell.css('height', newHeight + gap + 'px');
		this._cell.css('margin-bottom', -gap + 'px');
		this._cell.css('font-size', Math.round(Math.min(newWidth, newHeight) / 12.5) * 1 +'px'); // magic numbers yeeeeee
		this._author.css('font-size', Math.round(Math.min(newWidth, newHeight) / 16.5) * 1 +'px');
		this._typedText.css('top', '35%');

		// quick hack to fix author text being too low in bottom row
		var cssProperties = { 'bottom': '5%'};
		if (this.position.y == 4)
		{
			cssProperties = { 'bottom': '15%'};
		}
		else if (this.position.y == 3)
		{
			cssProperties = { 'bottom': '8%' };
		}

		this._author.css(cssProperties);
	}

	TweetCell.prototype.setContent = function(text, author, profileLink)
	{
		this.isBusy = true;

		this._cell.css('background-color', this._lastBackgroundColor);

		// set our author div text
		this._author.show();
		this._author.html("<a href=\"" + profileLink + "\" target=\"_blank\">" + "@" + author + "</a>");

		// create our temp span
		this._typedText.append("<span class=\"typed\"></span>");

		// begin typing animation
		$('.typed', '#' + this.id).typed(
		{
			strings: [text, ' '],
			typeSpeed: Utils.getRandomInt(100, 200),
			startDelay: 0,
			backSpeed: 0,
			backDelay: Utils.getRandomInt(2000, 4000),
			loop: false,
			loopCount: false,
			callback: flip.bind(this)
		});
	}

	TweetCell.prototype.unsetContent = function()
	{
		this._author.hide();
		this._cell.find('span').remove();
		this.isBusy = false;
	}

	var flip = function()
	{
		// remove the author div
		this._author.hide();

		// remove the typed text and its blinking cursor
		this._typedText.find('span').remove();

		// randomly set our new front panel color 
		this._lastBackgroundColor = this._colors[Math.floor(Math.random() * this._colors.length)];
		this._frontPanel.css('background-color', this._colors[Math.floor(Math.random() * this._colors.length)]);

		// begin rotation animation
		this._currentRotationAnimation = this._rotationAnimations[Math.floor(Math.random() * this._rotationAnimations.length)];
		this._frontPanel.addClass(this._currentRotationAnimation);

		// bind our transition to a callback
		$('.front.' + this._currentRotationAnimation, '#' + this.id).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', onFlipEnd.bind(this));
	}

	var onFlipEnd = function()
	{
		// remove our rotation class
		this._frontPanel.removeClass(this._currentRotationAnimation);

		this.isBusy = false;
	}

	return TweetCell;
})();
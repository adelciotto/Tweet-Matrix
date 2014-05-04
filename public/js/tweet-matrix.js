/*
 * =====================================================================================
 *
 *		@title: trend-matrix.js
 *		@authors: JabbaTheGimp (anthdel.developer@gmail.com)
 *
 *    	@Description: 
 *
 *		@version: 
 *     	@date:	2014-04-26 22:10:49
 *
 * =====================================================================================
 */
'use strict';

var TweetMatrix = (function()
{
	var TweetMatrix = function()
	{
		this._MAX_ROWS = 5;
		this._MAX_COLS = 5;

		this._numRows = 5;
		this._numCols = 5;
		this._cells = new Array2D(this._numRows, this._numCols);
		this._screenSize = { w: window.innerWidth, h: window.innerHeight };

		window.onresize = resize.bind(this);

		initMatrixButton.call(this);
		initCells.call(this);
	}

	TweetMatrix.prototype.constructor = TweetMatrix;

	TweetMatrix.prototype.getAvailableCell = function()
	{
		for (var y = 0; y < this._numRows; y++)
		{
			for (var x = 0; x < this._numCols; x++)
			{
				// check if the cell exists
				var cell = this._cells.getAt(x, y);
				if (cell !== null && !cell.isBusy)
				{
					// return first available available cell
					return cell;
				}
			}
		}

		return null;
	}

	var initMatrixButton = function()
	{
		// add a table to add buttons to
		$('#matrix-select-container').append("<table id=\"matrix-select\"></table>");

		for (var y = 0; y < this._MAX_ROWS; y++)
		{
			$('#matrix-select').append("<tr id=\"row-" + y + "\"></tr>");
			for (var x = 0; x < this._MAX_COLS; x++)
			{
				$('#row-' + y).append("<td></td>");
			}
		}

		// add hover event to button
		$('#matrix-button').click(onMatrixButtonEnter.bind(this));

		// add mouseout event to button container
		$('#matrix-select-container').mouseleave(onMatrixContainerLeave.bind(this));

		// add highlight and select events for the cells in the matrix button
		addMatrixButtonCellEvents.call(this);
	}

	var addMatrixButtonCellEvents = function()
	{
		var self = this;

		$('#matrix-select').find('td').each(function(k, v)
		{
			var col = Math.floor(k / self._MAX_COLS);
			var row = k % self._MAX_COLS;

			$(this).bind('mousemove', function(e)
			{
				e.preventDefault();
				highlightRows.call(self, col, row, "highlight");
				return false;
			});

			$(this).bind('click', function(e)
			{
				e.preventDefault();
				setMatrix.call(self, row + 1, col + 1);

				onMatrixContainerLeave.call(self);
				return false;
			});
		});
	}

	var highlightRows = function(cols, rows, className)
	{
		var self = this;

		$('#matrix-select').find('td').each(function(k, v)
		{
			var col = Math.floor(k / self._MAX_COLS);
			var row = k % self._MAX_COLS;

			if (col <= cols && row <= rows)
			{
				$(this).addClass(className);
			}
			else
			{
				$(this).removeClass(className);
			}
		});
	}

	var onMatrixButtonEnter = function()
	{
		$('#matrix-button').hide();
		$('#matrix-select-container').addClass("showing");
		highlightRows.call(self, 0, 0, "highlight");
	}

	var onMatrixContainerLeave = function()
	{
		$('#matrix-button').show();
		$('#matrix-select-container').removeClass("showing");
	}

	var setMatrix = function(c, r)
	{
		var newRows = Math.max(Math.min(r, this._MAX_ROWS), 0);
  		var newCols = Math.max(Math.min(c, this._MAX_COLS), 0);

  		if (newRows < this._numRows || newCols < this._numCols)
  		{
  			for (var y = this._numRows - 1; y >= 0; y--)
			{	
				for (var x = this._numCols - 1; x >= 0; x--)
				{
					if (x >= newCols || y >= newRows)
					{
						var cell = this._cells.getAt(x, y);
						$('#' + cell.id).hide();
						cell.unsetContent();
					}
				}
			}
  		}

  		if (newRows > this._numRows || newCols > this._numCols)
  		{
  			for (var y = 0; y < newRows; y++)
			{	
				for (var x = 0; x < newCols; x++)
				{
					var cell = this._cells.getAt(x, y);
					$('#' + cell.id).show();
					cell.resize(this._screenSize, this._numCols, this._numRows)
				}
			}
  		} 

		// update our row and col count and resize the cells to fit screen
		this._numRows = newRows;
		this._numCols = newCols;
		highlightRows.call(self, this._numRows, this._numCols, "select");
		resize.call(this);
	}

	var initCells = function()
	{
		for (var y = 0; y < this._numRows; y++)
		{
			for (var x = 0; x < this._numCols; x++)
			{
				var cell = new TweetCell(x, y);
				cell.resize(this._screenSize, this._numCols, this._numRows)
				this._cells.data[y][x] = (cell);
			}
		}

		// initially set matrix to 1 x 1
		setMatrix.call(this, 1, 1);
	}

	var resize = function()
	{
		this._screenSize.w = $(window).width();
		this._screenSize.h = $(window).height();

		for (var y = 0; y < this._numRows; y++)
		{
			for (var x = 0; x < this._numCols; x++)
			{
				var cell = this._cells.getAt(x, y);
				cell.resize(this._screenSize, this._numCols, this._numRows);
			}
		}
	}

	return TweetMatrix;
})();
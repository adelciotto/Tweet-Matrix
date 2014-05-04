/*
 * =====================================================================================
 *
 *		@title: array2D.js
 *		@authors: JabbaTheGimp (anthdel.developer@gmail.com)
 *
 *    	@Description: 
 *
 *		@version: 
 *     	@date:	2014-04-26 23:13:01
 *
 * =====================================================================================
 */
'use strict';

var Array2D = function(rows, cols)
{
	this.data = [];
	this._rows = rows || 0;
	this._cols = cols || 0;
	this.setSize(rows, cols);
}

Array2D.prototype.constructor = Array2D;

Array2D.prototype.setSize = function(rows, cols)
{	
	this._rows = rows;
	this._cols = cols;

	// allocate memory for rows
	for (var y = 0; y < this._rows; y++)
	{
		// allocate memory for columns
		this.data[y] = [];
	}
}

Array2D.prototype.getAt = function(x, y)
{
	return this.data[y][x];
}

Array2D.prototype.empty = function()
{
	// sets to new empty array
	this.data = [];
}

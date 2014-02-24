/* 
	Irritatingly the way the hexes stack up mens that they are not symetrical so you can't just overlay a bigger grid on top. 
	Will ahve to walk the grid to get the points 
*/

window.tileGridFactory = function (canvasContext, hexMathsHelper, grid) {
	return /* new tileGrid */ {
		context: canvasContext,
		hexMaths: hexMathsHelper,
		grid: grid,

		drawGrid: function() {
			var topLeft = {x:3, y:0};
			var topRight = grid.followPathForGridIndex(topLeft, [ grid.directions.southEast, grid.directions.southEast, grid.directions.northEast, grid.directions.northEast ]);
			//console.log(topRight);
			// HOWTO:
			/*
				Get a hex to start from. Suggested is one where it all fits on the grid
				
				for that hex get it's points. 
				select the top left point
				move SE twice then NE twice
				for that hex get it's points. 
				select the top right point
				.... repeat the above to come full circle
				
			*/
			
			// TODO: make a way to do the walking hex thing.
		},
	};
};
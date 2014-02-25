/* 
	After all the work it turns out I'm just a ditz and the hexes do fit correctly when placed in grids.
	So assuming you have a grid of hexes with hexes of 25 along an edge, the tiles will be 175 along an edge but require an offset of {x:36,y:22}
*/

/*window.tileGridFactory = function (canvasContext, hexMathsHelper, grid) {
	return {
		context: canvasContext,
		hexMaths: hexMathsHelper,
		grid: grid,

		drawGrid: function() {
			var context = this.context;
			
			var topLeft = {x:3, y:0};
			var topRight = grid.followPathForGridIndex(topLeft, [ grid.directions.southEast, grid.directions.southEast, grid.directions.northEast, grid.directions.northEast ]);
			var right = grid.followPathForGridIndex(topRight, [ grid.directions.south, grid.directions.south, grid.directions.southEast, grid.directions.southEast ]);
			var bottomRight = grid.followPathForGridIndex(right, [ grid.directions.southWest, grid.directions.southWest, grid.directions.south, grid.directions.south ]);
			var bottomLeft = grid.followPathForGridIndex(bottomRight, [ grid.directions.northWest, grid.directions.northWest, grid.directions.southWest, grid.directions.southWest ]);
			var left = grid.followPathForGridIndex(bottomLeft, [ grid.directions.north, grid.directions.north, grid.directions.northWest, grid.directions.northWest ]);

			var cornerHexes = [topLeft, topRight, right, bottomRight, bottomLeft, left];
			
			context.beginPath();
			
			for (var ii = 0; ii < cornerHexes.length; ii++) {
				var offset = this.grid.getCoordinatesFromGridPosition(cornerHexes[ii].x, cornerHexes[ii].y);
				var point = this.hexMaths.hexPointsAtOffset(offset.x, offset.y, this.grid.sideLength)[ii];

				console.log(point.x);
				
				if (ii == 0) {
					context.moveTo(point.x, point.y);
					continue;
				}
				
				context.lineTo(point.x, point.y);
			}
			
			context.closePath();
			
			context.lineWidth = 5;
			context.strokeStyle = "black";
			context.stroke();
		},
	};
};*/
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
};
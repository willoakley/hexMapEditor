/*
	FUTURE:
	- Tiles should acept an array of {x, y, howToRenderThisHex} objects
	- when drawing it should loop through this collection and render them assuming the co-ordiantes are within the bounds of hexesAcross and hexesDown values
*/

window.tile = function (context, hexMaths, options, featurePaths) {
	var defaultOptions = {
		hexSideLength: 30.0,
		gridLeftOffset: 0.0,
		gridTopOffset: 0.0,
	};

	options = $.extend(defaultOptions, options);
	
	if (featurePaths === undefined || featurePaths.length == undefined) {
		featurePaths = [];
	}
	
	return {
		context: context,
		hexMaths: hexMaths,
		hexSideLength: options.hexSideLength,
		tileSize: 7,
		gridLeftOffset: options.gridLeftOffset,
		gridTopOffset: options.gridTopOffset,
		featurePaths: featurePaths,
		
		_drawInnerHexeMarkings: function(innerHexes) {
			var innerHexStyleOptions = { stroke: true, strokeWidth: 2, strokeColour: "white" };

			// I'm sure there's a sensible way to draw these
			for (var xx = 2; xx < innerHexes.hexesAcross - 2; xx++) {
				innerHexes.drawHexAtGridIndex(xx, 0, innerHexStyleOptions);
			}

			for (var xx = 1; xx < innerHexes.hexesAcross - 1; xx++) {
				innerHexes.drawHexAtGridIndex(xx, 1, innerHexStyleOptions);
			}

			for (var xx = 1; xx < innerHexes.hexesAcross - 1; xx++) {
				innerHexes.drawHexAtGridIndex(xx, 2, innerHexStyleOptions);
			}

			for (var xx = 0; xx < innerHexes.hexesAcross - 0; xx++) {
				innerHexes.drawHexAtGridIndex(xx, 3, innerHexStyleOptions);
			}

			for (var xx = 1; xx < innerHexes.hexesAcross - 1; xx++) {
				innerHexes.drawHexAtGridIndex(xx, 4, innerHexStyleOptions);
			}

			for (var xx = 2; xx < innerHexes.hexesAcross - 2; xx++) {
				innerHexes.drawHexAtGridIndex(xx, 5, innerHexStyleOptions);
			}

			for (var xx = 2; xx < innerHexes.hexesAcross - 2; xx++) {
				if (xx % 2 == 1) {
					continue;
				}
				innerHexes.drawHexAtGridIndex(xx, 6, innerHexStyleOptions);
			}
		},
		
		drawTile: function () {
			var surroundingHex = window.hexGridFactory.createHexGrid(this.context, this.hexMaths, {
				hexesAcross: 1,
				hexesDown: 1,
				hexSideLength: this.hexSideLength * this.tileSize,
				gridLeftOffset: this.gridLeftOffset,
				gridTopOffset: this.gridTopOffset,
			});
			
			surroundingHex.drawGrid({ fill: true, fillColour: "grey" });
			
			var innerHexes = window.hexGridFactory.createHexGrid(this.context, this.hexMaths, {
				hexSideLength: this.hexSideLength,
				hexesAcross: this.tileSize + 2,
				hexesDown: this.tileSize,
				gridLeftOffset: this.gridLeftOffset,
				gridTopOffset: this.gridTopOffset,
			});
			
			var topLeftHexGridIndex = { x: 2, y: 0 };

			var currentPosition = topLeftHexGridIndex;
			for (var ii = 0; ii < this.featurePaths.length; ii++) {
				var hexWithPath = this.featurePaths[ii];
				if (hexWithPath.moveDirection != null) {
					currentPosition = window.hexGridFactory.getNeghbouringGridIndex(currentPosition, hexWithPath.moveDirection);
				}
				
				if (hexWithPath.hexFormatOptions == undefined || hexWithPath.hexFormatOptions == null) {
					continue;
				}
				
				innerHexes.drawHexAtGridIndex(currentPosition.x, currentPosition.y, hexWithPath.hexFormatOptions);
			}

			this._drawInnerHexeMarkings(innerHexes);

			surroundingHex.drawGrid({ stroke: true, strokeColour: "black", strokeWidth: 2 });   
		},
	};
}
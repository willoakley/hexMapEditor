/*
	FUTURE:
	- Tiles should acept an array of {x, y, howToRenderThisHex} objects
	- when drawing it should loop through this collection and render them assuming the co-ordiantes are within the bounds of hexesAcross and hexesDown values
*/

window.tile = function (context, hexMaths, options) {
	var defaultOptions = {
		hexSideLength: 30.0,
		gridLeftOffset: 0.0,
		gridTopOffset: 0.0,
	};
	
	options = $.extend(defaultOptions, options);
	
	return {
		context: context,
		hexMaths: hexMaths,
		hexSideLength: options.hexSideLength,
		tileSize: 7,
		gridLeftOffset: options.gridLeftOffset,
		gridTopOffset: options.gridTopOffset,
		
		_drawInnerHexeMarkings: function() {
			var innerHexes = window.hexGridFactory(this.context, this.hexMaths, {
				hexSideLength: this.hexSideLength,
				hexesAcross: this.tileSize + 2,
				hexesDown: this.tileSize,
				gridLeftOffset: this.gridLeftOffset,
				gridTopOffset: this.gridTopOffset,
			})
			
			var innerHexStyleOptions = { strokeWidth: 2, strokeColour: "white", fill: false };

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
			var surroundingHex = window.hexGridFactory(this.context, this.hexMaths, {
				hexesAcross: 1,
				hexesDown: 1,
				hexSideLength: this.hexSideLength * this.tileSize,
				gridLeftOffset: this.gridLeftOffset,
				gridTopOffset: this.gridTopOffset,
			});
			
			surroundingHex.drawGrid({ stroke: false, fillColour: "grey" });
			
			this._drawInnerHexeMarkings();

			surroundingHex.drawGrid({ fill: false, strokeColour: "black", strokeWidth: 2 });   
		},
	};
}
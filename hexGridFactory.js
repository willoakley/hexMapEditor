window.hexGridFactory = function (canvasContext, hexMathsHelper, hexSideLength, gridLeftOffset, gridTopOffset) {
	if (hexSideLength === undefined) {
		hexSideLength = 30.0;
	}
	
	if (gridLeftOffset === undefined) {
		gridLeftOffset = 0.0;
	}
	
	if (gridTopOffset === undefined) {
		gridTopOffset = 0.0;
	}

	return /* new grid */ {
		context: canvasContext,
		hexMaths: hexMathsHelper,
		sideLength: hexSideLength,
		gridLeftOffset: gridLeftOffset,
		gridTopOffset: gridTopOffset,

		_defaultOptions: function (options) {
			var defaultDrawOptions = {
				offsetLeft: 0.0,
				offsetTop: 0.0,

				fill: true,
				fillColour: "yellow",

				stroke: true,
				strokeColour: 'black',
				strokeWidth: 1,
				
				text: "",
				textColour: "black",
				textSize: 15,
				textFont: "Arial",
			};
		
			if (options === undefined) {
				options = defaultDrawOptions;
			} else {
				options = $.extend(defaultDrawOptions, options);
			}
			
			return options;
		},
		
		_drawHex: function(options) {
			options = this._defaultOptions(options);

			var context = this.context;
			var points = this.hexMaths.hexPointsAtOffset(options.offsetLeft, options.offsetTop, this.sideLength);

			context.beginPath();		
			context.moveTo(points[0].x, points[0].y);
			
			for (var ii = 1; ii < points.length; ii++) {
				context.lineTo(points[ii].x, points[ii].y);
			}
			
			context.closePath();
			
			if (options.fill) {
				context.fillStyle = options.fillColour;
				context.fill();
			}
			
			if (options.stroke) {
				context.lineWidth = options.strokeWidth;
				context.strokeStyle = options.strokeColour;
				context.stroke();
			}
			
			if (options.text != null && options.text.length) {
				var maxWidth = this.hexMaths.getOffsetWidth(this.sideLength);
				var textLeft = options.offsetLeft + (this.hexMaths.getWidth(this.sideLength) / 2.0);
				var textTop = options.offsetTop + (this.hexMaths.getHeight(this.sideLength) / 2.0);
				
				context.fillStyle = options.textColour;
				context.textAlign = 'center';
				context.font = "bold " + options.textSize + "px " + options.textFont;
				context.fillText(options.text, textLeft, textTop, maxWidth);
			}
		},
		
		_gridIndex: function (xIn, yIn) {
			return { x: Math.floor(xIn), y: Math.floor(yIn) };
		},

		_oddNegbouringHexIndexMap: Object.freeze({
			north:     { x: 0,  y: -1 },
			south:     { x: 0,  y: 1 },
			northEast: { x: 1,  y: -1 },
			northWest: { x: -1, y: -1 },
			southEast: { x: 1,  y: 0 },
			southWest: { x: -1, y: 0 },
		}),
		
		_evenNegbouringHexIndexMap: Object.freeze({
			north:     { x: 0,  y: -1 },
			south:     { x: 0,  y: 1 },
			northEast: { x: 1,  y: 0 },
			northWest: { x: -1,  y: 0 },
			southEast: { x: 1, y: 1 },
			southWest: { x: -1, y: 1 },
		}),
		
		directions: Object.freeze({
			north: "north",
			south: "south",
			northEast: "northEast",
			southEast: "southEast",
			southWest: "southWest",
			northWest: "northWest",
		}),
		
		getNeghbouringGridIndex: function (index, direction) {
			var map = this._evenNegbouringHexIndexMap;
			
			if (index.x % 2 == 1) {
				map = this._oddNegbouringHexIndexMap;
			}
		
			return { x: index.x + map[direction].x, y: index.y + map[direction].y, };
		},
		
		followPathForGridIndex: function (index, pathArray) {
			var currentIndex = index;
			for (var ii = 0; ii < pathArray.length; ii++) {
				currentIndex = this.getNeghbouringGridIndex(currentIndex, pathArray[ii]);
			}

			return currentIndex;
		},
		
		drawGrid: function (hexesAcross, hexesDown, options) {
			options = this._defaultOptions(options);
			
			for (var x = 0; x < hexesAcross; x++) {
				for (var y = 0; y < hexesDown; y++) {
					var offset = this.getCoordinatesFromGridPosition(x, y)
				
					options.offsetLeft = offset.x;
					options.offsetTop = offset.y;
					options.text = "[" + x + "," + y + "]";
					
					this._drawHex(options);
				}
			}
		},
		
		drawHexAtGridIndex: function (x, y, options) {
			options = this._defaultOptions(options);
			
			var offset = this.getCoordinatesFromGridPosition(x, y);
			
			options.offsetLeft = offset.x;
			options.offsetTop = offset.y;
			
			this._drawHex(options);
		},
		
		getCoordinatesFromGridPosition: function (xIn, yIn) {
			var width = this.hexMaths.getOffsetWidth(this.sideLength);
			var height = this.hexMaths.getHeight(this.sideLength);
			
			var leftOffset = xIn * width;
			var topOffset = yIn * height;
			if (Math.abs(xIn) % 2 == 1) {
				topOffset = topOffset + (height / 2.0);
			}
			
			return { x: gridLeftOffset + leftOffset, y: gridTopOffset + topOffset };
		},
		
		getGridPositionFromCoordinates: function (x, y) {
			x = x - gridLeftOffset;
			y = y - gridTopOffset;

			var sectionWidth = this.hexMaths.getSectionWidth(this.sideLength);
			var sectionHeight = this.hexMaths.getSectionHeight(this.sideLength);
			var radiansToDegrees = 180.00 / Math.PI;
			
			/*
			 *  Attempt to show a section of a hex. Each hex is split vertically and horisontally.
			 *  The left horisontal section contains the lefthand sloped section and a side length's worth.
			 *  The upper and lower sections are split evenly across the middle of the hex.
			 *  As show in the terrible diagram below, there are two types of section (A and B). When 
			 *    the segment row and column are even or both are odd, you see a section A, otherwise a section B
			 *  E represents the start of an even section row or column, O an odd one.
			 *  
				   E \      O/       E \
				 .E:........:........:........
				   : /      :\       : /
				   :/   A   . \  B   :/       
				 .O:........:........:........
				   :\   B   : /  A   :\
				 .E:.\......:/.......:.\.......
				   : /      :\       : /
			   
			 */

			var sectionX = Math.floor(x / sectionWidth);
			var sectionY = Math.floor(y / sectionHeight);

			var columnIsEven = sectionX % 2 == 0;
			var columnIsOdd = !columnIsEven;

			var rowIsEven = sectionY % 2 == 0;

			// Half the lower bound of the Y section as you get two per hex. 
			// Also the odd columns are shifted down by one row so take that off to get the index right on odd columns
			var yGridPosition = (sectionY / 2);
			if (columnIsOdd && rowIsEven) {
				yGridPosition = yGridPosition - 1;
			}
			
			var differenceBetweenStartOfXSectionAndXPosition = x - (sectionX * sectionWidth);
			if (differenceBetweenStartOfXSectionAndXPosition >= this.hexMaths.getH(this.sideLength))
			{
				//...then we're in the unsloped/rectangular section of the hex section (unique across both halves and section types A and B.
				// No more work is needed to find the x position. 
				return this._gridIndex(sectionX, yGridPosition);
			}

			var isSegmentTypeA = sectionX % 2 == sectionY % 2;
			var differenceBetweenStartOfYSectionAndYPosition = null;
			if (isSegmentTypeA) {
				differenceBetweenStartOfYSectionAndYPosition = ((sectionY + 1) * sectionHeight) - y;
			} else {
				differenceBetweenStartOfYSectionAndYPosition = y - (sectionY * sectionHeight);
			}		
			
			// Sneakily we can work out side which side of the hex edge  the point is with some trig'. 
			// The angle between the hex edge and straight up vertical is 30 degrees. More 30 degrees and we're to the right of the line.
			// Tan^-1 (Opposite [xdiff] / Adjacent [ydiff]) = the angle
			var angleInRadians = Math.atan(differenceBetweenStartOfXSectionAndXPosition / differenceBetweenStartOfYSectionAndYPosition);
			var rightOfLine = Math.abs(angleInRadians * radiansToDegrees) >= 30.00;

			if (rightOfLine)
			{
				//inside the hex at the current position
				return this._gridIndex(sectionX, yGridPosition);
			}

			// Left of line so will be in a hex to the left
			var xGridPosition = sectionX - 1;

			if (columnIsEven && isSegmentTypeA)
			{
				return this._gridIndex(xGridPosition, yGridPosition - 1);
			}

			if ((!columnIsEven) && (!isSegmentTypeA))
			{
				return this._gridIndex(xGridPosition, yGridPosition + 1);
			}

			//((!columnIsEven) && isSegmentTypeA) OR (columnIsEven && (!isSegmentTypeA))
			return this._gridIndex(xGridPosition, yGridPosition);
		},
	};
};
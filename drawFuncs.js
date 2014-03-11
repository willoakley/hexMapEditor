window.drawFuncs = {
	_drawHex: function (context, sideLength, offsetLeft, offsetTop, fillColour, strokeColour, text) {
		var points = window.hexMaths.hexPointsAtOffset(offsetLeft, offsetTop, sideLength);

		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		for (var ii = 1; ii < points.length; ii++) {
			context.lineTo(points[ii].x, points[ii].y);
		}

		context.closePath();

		if (fillColour !== undefined && fillColour !== null) {
			context.fillStyle = fillColour;
			context.fill();
		}

		if (strokeColour !== undefined && strokeColour !== null) {
			context.lineWidth = 2;
			context.strokeStyle = strokeColour;
			context.stroke();
		}

		if (text !== undefined && text !== null && text.length > 0) {
			var maxWidth = window.hexMaths.getOffsetWidth(sideLength);
			var textLeft = offsetLeft + (window.hexMaths.getWidth(sideLength) / 2.0);
			var textTop = offsetTop + (window.hexMaths.getHeight(sideLength) / 2.0);

			context.fillStyle = strokeColour;
			context.textAlign = 'center';
			context.font = "bold " + (sideLength / 2) + "px Arial";
			context.fillText(text, textLeft, textTop, maxWidth);
		}
	},

	hilightHex: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		window.drawFuncs._drawHex(context, scale, pixelLocation.px, pixelLocation.py, undefined, "orange");
	},

	dummyDraw: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var colour = "green";
		if (state == window.gridItemState.selected) {
			colour = "orange";
		}

		window.drawFuncs._drawHex(context, scale, pixelLocation.px, pixelLocation.py, colour, "black", "F:"+rotation);
	},

	dummyDrawTileRiverHex: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		window.drawFuncs._drawHex(context, scale, pixelLocation.px, pixelLocation.py, "blue", undefined, "D1");
	},

	dummyDrawTile: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var colour = "grey";
		if (state == window.gridItemState.selected) {
			colour = "orange";
		}

		window.drawFuncs._drawHex(context, scale, pixelLocation.px, pixelLocation.py, colour, "white", "tile!");

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple(
			"tempRiver",
			[
				//probably want to draw a series of plain hexes in here and just substitute in the river ones
				{ draw: window.drawFuncs.dummyDrawTileRiverHex },
				{ move: "s", draw: window.drawFuncs.dummyDrawTileRiverHex },
				{ move: "s" },
				{ move: "s", draw: window.drawFuncs.dummyDrawTileRiverHex },
			]
		));

		window.drawFuncs._drawHex(context, scale, pixelLocation.px, pixelLocation.py, undefined, "black");

		tempGrid.draw(context);
	},
};
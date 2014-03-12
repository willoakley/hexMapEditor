window.drawFuncs = {
	_mergeOptions: function (additionalOptions) {
		var options = {
			scale: 10.0,
			rotation: "n",
			offset: {
				px: 0,
				py: 0,
			},
			text: {
				value: "",
				colour: "black",
				isIcon: false,
			},
			outline: {
				show: true,
				colour: "black",
				thickness: 1,
			},
			fill: {
				show: false,
				colour: "white",
			},
		};

		$.extend(true, options, additionalOptions);
		return options;
	},

	_hexagon: function(context, drawOptions) {
		var options = window.drawFuncs._mergeOptions(drawOptions);
		var points = window.hexMaths.hexPointsAtOffset(options.offset.px, options.offset.py, options.scale);

		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		for (var ii = 1; ii < points.length; ii++) {
			context.lineTo(points[ii].x, points[ii].y);
		}

		context.closePath();

		if (options.fill.show) {
			context.fillStyle = options.fill.colour;
			context.fill();
		}

		if (options.outline.show) {
			context.lineWidth = options.outline.thickness;
			context.strokeStyle = options.outline.colour;
			context.stroke();
		}

		if (options.text.value != undefined && options.text.value.length > 0) {
			var font = "Arial";
			if (options.text.isIcon) {
				font = "FontAwesome";
			}

			var maxWidth = window.hexMaths.getOffsetWidth(options.scale);
			var textLeft = options.offset.px + (window.hexMaths.getWidth(options.scale) / 2.0);
			var textTop = options.offset.py + (window.hexMaths.getHeight(options.scale) / 2.0) + (options.scale / 2.0);

			context.fillStyle = options.text.colour;
			context.textAlign = 'center';
			context.font = "bold " + Math.floor(options.scale * 0.9) + "px " + font;
			context.fillText(options.text.value, textLeft, textTop, maxWidth);
		}

		return points;
	},

	_hilightHexagon: function (context, options, state) {
		if (state !== window.gridItemState.selected) {
			return;
		}

		var colour = "rgba(255,128,64, 0.5)";
		options.fill = { show: true, colour: colour };
		options.outline = { show: true, colour: colour, thickness: 2 };

		window.drawFuncs._hexagon(context, options);
	},

	hilightHex: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		window.drawFuncs._hilightHexagon(context, { scale: scale, offset: pixelLocation, rotation: rotation }, window.gridItemState.selected);
	},

	// - - - - - - - - - - - - - - - - - - - - - - Tile types - - - - - - - - - - - - - - - - - - - - - - - - - -
	tile: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: "grey", },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple(
			"tempRiver",
			[
				{ draw: window.drawFuncs.depthOneRiver },
				{ move: "s", draw: window.drawFuncs.depthOneRiver },
				{ move: "s" },
				{ move: "s", draw: window.drawFuncs.depthOneRiver },
			]
		));

		tempGrid.draw(context);

		options.fill = undefined;
		options.outline = { show: true, thickness: 2, colour: "black" };
		window.drawFuncs._hexagon(context, options);

		window.drawFuncs._hilightHexagon(context, options, state);
	},

	// - - - - - - - - - - - - - - - - - - - - - - Terrain types - - - - - - - - - - - - - - - - - - - - - - - - - -
	lightWoods: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
		};

		var points = window.drawFuncs._hexagon(context, options);
		context.fillStyle = "green";
		context.textAlign = 'left';
		context.font = "bold " + Math.floor(options.scale) + "px FontAwesome";
		context.fillText("\uf18c", points[0].x - (scale * 0.33), points[0].y + (scale * 0.75));

		window.drawFuncs._hilightHexagon(context, options, state);
	},

	depthOneRiver: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: "cyan" },
			text: { value: "D1", colour: "black" },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},
};
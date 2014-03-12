window.colours = {
	water: "#0066FF",
	tile: "#D6D6D6",
	hill: "#AEAEAE",
	lightWoods: "#339933",
	heavyWoods: "#003300",
	hilight: "rgba(255,128,64, 0.5)",
	building: "#404040",
	outline: "black",
	lightOutline: "white",
};

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
				colour: window.colours.outline,
				isIcon: false,
			},
			outline: {
				show: true,
				colour: window.colours.outline,
				thickness: 1,
			},
			fill: {
				show: false,
				colour: window.colours.lightOutline,
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

		options.fill = { show: true, colour: window.colours.hilight };
		options.outline = { show: true, colour: window.colours.hilight, thickness: 2 };

		window.drawFuncs._hexagon(context, options);
	},

	_outlineHex: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, offset: pixelLocation,
			outline: { show: true, colour: window.colours.outline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	hilightHex: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		window.drawFuncs._hilightHexagon(context, { scale: scale, offset: pixelLocation, rotation: rotation }, window.gridItemState.selected);
	},

	// - - - - - - - - - - - - - - - - - - - - - - Tile types - - - - - - - - - - - - - - - - - - - - - - - - - -
	tile: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: true, thickness: 2 },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.tileBacking);
		tempGrid.draw(context);

		window.drawFuncs._hilightHexagon(context, options, state);
	},

	// - - - - - - - - - - - - - - - - - - - - - - Terrain types - - - - - - - - - - - - - - - - - - - - - - - - - -
	lightWoods: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
		};

		var points = window.drawFuncs._hexagon(context, options);
		context.fillStyle = window.colours.lightWoods;
		context.textAlign = 'left';
		context.font = "bold " + Math.floor(options.scale) + "px FontAwesome";
		context.fillText("\uf18c", points[0].x - (scale * 0.33), points[0].y + (scale * 0.75));

		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heavyWoods: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
		};

		var points = window.drawFuncs._hexagon(context, options);
		context.fillStyle = window.colours.heavyWoods;
		context.textAlign = 'left';
		context.font = "bold " + Math.floor(options.scale) + "px FontAwesome";
		context.fillText("\uf18c", points[0].x - (scale * 0.33), points[0].y + (scale * 0.75));

		context.fillText("\uf18c", points[1].x - (scale * 0.33), points[1].y + (scale * 0.33));

		window.drawFuncs._hilightHexagon(context, options, state);
	},

	depthZeroRiver: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.water },
			text: { value: "D0" },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	depthOneRiver: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.water },
			text: { value: "D1" },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	depthTwoRiver: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.water },
			text: { value: "D2" },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightZeroBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B0", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightOneBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B1", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightTwoBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B2", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightThreeBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B3", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightFourBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B4", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightOneHill: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hill },
			text: { value: "H1" },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightTwoHill: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hill },
			text: { value: "H2" },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},

	heightThreeHill: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hill },
			text: { value: "H3" },
		};
		window.drawFuncs._hexagon(context, options);
		window.drawFuncs._hilightHexagon(context, options, state);
	},
};

window.tileBacking = window.drawableFactory.newDrawableMultiple("tempRiver", [
	{ move: "n" }, { move: "n" }, { move: "n" }, { move: "sw" },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se" },
	{ move: "s", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "sw" },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "se" },
	{ move: "s", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw", draw: window.drawFuncs._outlineHex },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "s", draw: window.drawFuncs._outlineHex },
	{ move: "se" },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
	{ move: "se" },
	{ move: "ne", draw: window.drawFuncs._outlineHex },
]);
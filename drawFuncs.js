window.colours = {
	water: "#0066FF",
	lightWater: "#80B2FF",
	darkWater: "#003D99",
	tile: "#EAEAEA",
	hill: "#D6D6D6",
	hillTwo: "#969696",
	hillThree: "#5A5A5A",
	lightWoods: "#339933",
	heavyWoods: "#003300",
	hilight: "rgba(255,128,64, 0.5)",
	building: "#404040",
	barrier: "#404040",
	outline: "black",
	lightOutline: "white",
	road: "#999966",
	nothing: "white",
	objective: "red",
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

	_drawPoints: function (context, points) {
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		for (var ii = 1; ii < points.length; ii++) {
			context.lineTo(points[ii].x, points[ii].y);
		}

		context.closePath();
	},

	_hexagon: function(context, drawOptions) {
		var options = window.drawFuncs._mergeOptions(drawOptions);
		var points = window.hexMaths.hexPointsAtOffset(options.offset.px, options.offset.py, options.scale);
		window.drawFuncs._drawPoints(context, points);

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
			var maxWidth = window.hexMaths.getOffsetWidth(options.scale);
			var textLeft = options.offset.px + (window.hexMaths.getWidth(options.scale) / 2.0);
			var textTop = options.offset.py + (window.hexMaths.getHeight(options.scale) / 2.0) + (options.scale / 2.0);

			context.fillStyle = options.text.colour;
			context.textAlign = 'center';
			if (options.text.isIcon) {
				context.font = Math.floor(options.scale * 1.2) + "px FontAwesome";
			} else {
				context.font = "bold " + Math.floor(options.scale) + "px Arial";
			}
			context.fillText(options.text.value, textLeft, textTop, maxWidth);
		}

		if (drawOptions.state == window.gridItemState.selected) {
			window.drawFuncs._hilightHexagon(context, { scale: options.scale, offset: options.offset, state: drawOptions.state });
		}

		return points;
	},

	_hilightHexagon: function (context, options) {
		if (options.state !== window.gridItemState.selected) {
			return;
		}

		var points = window.hexMaths.hexPointsAtOffset(options.offset.px, options.offset.py, options.scale);
		window.drawFuncs._drawPoints(context, points);
		context.fillStyle = window.colours.hilight;
		context.fill();

		context.lineWidth = 2;
		context.strokeStyle = window.colours.hilight;
		context.stroke();
	},

	_outlineHex: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, offset: pixelLocation, state: window.gridItemState.normal,
			outline: { show: true, colour: window.colours.outline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	hilightHex: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		window.drawFuncs._hilightHexagon(context, { scale: scale, offset: pixelLocation, state: window.gridItemState.selected });
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
	},

	halfTile: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);

		var points = window.hexMaths.hexPointsAtOffset(options.offset.px, options.offset.py, options.scale);
		var rotationFactor = window.gridCompas.directionValues[rotation];

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.halfTileBacking);
		tempGrid.draw(context);

		context.beginPath();
		context.moveTo(points[(5 + rotationFactor) % 6].x, points[(5 + rotationFactor) % 6].y);
		context.lineTo(points[(2 + rotationFactor) % 6].x, points[(2 + rotationFactor) % 6].y);
		context.lineTo(points[(3 + rotationFactor) % 6].x, points[(3 + rotationFactor) % 6].y);
		context.lineTo(points[(4 + rotationFactor) % 6].x, points[(4 + rotationFactor) % 6].y);
		context.closePath();
		context.fillStyle = window.colours.nothing;
		context.fill();

		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(points[(5 + rotationFactor) % 6].x, points[(5 + rotationFactor) % 6].y);
		context.lineTo(points[(2 + rotationFactor) % 6].x, points[(2 + rotationFactor) % 6].y);
		context.lineTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(0 + rotationFactor) % 6].x, points[(0 + rotationFactor) % 6].y);
		context.closePath();
		context.strokeStyle = window.colours.outline;
		context.stroke();
	},

	riverOne: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: true, thickness: 2 },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.tileBacking);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple("tempRiver", [
			{ move: "n" }, { move: "n" },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
		]));
		river.state = state;

		tempGrid.draw(context);
	},

	riverTwo: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: true, thickness: 2 },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.tileBacking);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple("tempRiver", [
			{ move: "n" }, { move: "n" },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthZeroRiver },
			{ move: "s", draw: window.drawFuncs.depthZeroRiver },
			{ move: "s", draw: window.drawFuncs.depthZeroRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "n" },
			{ move: "n" },
			{ move: "ne", draw: window.drawFuncs.depthZeroRiver },
			{ move: "ne", draw: window.drawFuncs.depthZeroRiver },
			{ move: "nw", draw: window.drawFuncs.depthZeroRiver },
			{ move: "n", draw: window.drawFuncs.depthZeroRiver },
		]));
		river.state = state;

		tempGrid.draw(context);
	},

	riverThree: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: true, thickness: 2 },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.tileBacking);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple("tempRiver", [
			{ move: "n" }, { move: "n" },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
		]));
		river.state = state;

		tempGrid.draw(context);
	},

	riverFour: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: true, thickness: 2 },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.tileBacking);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple("tempRiver", [
			{ move: "se" }, { move: "se" },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "nw", draw: window.drawFuncs.depthOneRiver },
			{ move: "nw", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
		]));
		river.state = state;

		tempGrid.draw(context);
	},

	riverFive: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: true, thickness: 2 },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.tileBacking);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple("tempRiver", [
			{ move: "s" }, { move: "s" },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "ne", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "ne", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthOneRiver },
		]));
		river.state = state;

		tempGrid.draw(context);
	},

	riverSix: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile, },
			outline: { show: true, thickness: 2 },
		};
		window.drawFuncs._hexagon(context, options);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var tileCentreIndex = { gx: 4, gy: 3 };
		tempGrid.addItem(tileCentreIndex, rotation, window.tileBacking);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawableFactory.newDrawableMultiple("tempRiver", [
			{ move: "s" }, { move: "s" },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "ne", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
			{ move: "nw", draw: window.drawFuncs.depthOneRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthTwoRiver },
			{ move: "sw", draw: window.drawFuncs.depthOneRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "se", draw: window.drawFuncs.depthTwoRiver },
			{ move: "s", draw: window.drawFuncs.depthOneRiver },
			{ move: "n" },
			{ move: "n", draw: window.drawFuncs.depthTwoRiver },
			{ move: "ne", draw: window.drawFuncs.depthTwoRiver },
			{ move: "n", draw: window.drawFuncs.depthOneRiver },
		]));
		river.state = state;

		tempGrid.draw(context);
	},

	// - - - - - - - - - - - - - - - - - - - - - - Terrain types - - - - - - - - - - - - - - - - - - - - - - - - - -
	lightWoods: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var sclaePadding = scale * 0.2;
		var options = {
			scale: scale - sclaePadding, state: state, offset: { px: pixelLocation.px + sclaePadding, py: pixelLocation.py + sclaePadding }, rotation: rotation,
			outline: { show: true, thickness: 3, colour: "rgba(135,225,0,0.7)" }
		};

		var points = window.drawFuncs._hexagon(context, options);
		context.fillStyle = window.colours.lightWoods;
		context.textAlign = 'left';
		context.font = "bold " + Math.floor(options.scale) + "px FontAwesome";
		context.fillText("\uf18c", points[0].x - (scale * 0.33), points[0].y + (scale * 0.75));
	},

	heavyWoods: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var sclaePadding = scale * 0.2;
		var options = {
			scale: scale - sclaePadding, state: state, offset: { px: pixelLocation.px + sclaePadding, py: pixelLocation.py + sclaePadding }, rotation: rotation,
			outline: { show: true, thickness: 3, colour: "rgba(14, 71, 0, 0.7)" }
		};

		var points = window.drawFuncs._hexagon(context, options);
		context.fillStyle = window.colours.heavyWoods;
		context.textAlign = 'left';
		context.font = "bold " + Math.floor(options.scale) + "px FontAwesome";
		context.fillText("\uf18c", points[0].x - (scale * 0.33), points[0].y + (scale * 0.75));
		context.fillText("\uf18c", points[1].x - (scale * 0.33), points[1].y + (scale * 0.33));
	},

	water: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.water },
		};
		window.drawFuncs._hexagon(context, options);
	},

	depthZeroRiver: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.lightWater },
			text: { value: "D0" },
		};
		window.drawFuncs._hexagon(context, options);
	},

	depthOneRiver: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.water },
			text: { value: "D1" },
		};
		window.drawFuncs._hexagon(context, options);
	},

	depthTwoRiver: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.darkWater },
			text: { value: "D2", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightZeroBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B0", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightOneBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B1", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightTwoBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B2", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightThreeBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B3", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightFourBuilding: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B4", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightOneHill: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hill },
			text: { value: "H1" },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightTwoHill: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hillTwo },
			text: { value: "H2" },
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightThreeHill: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hillThree },
			text: { value: "H3", colour: window.colours.lightOutline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	road: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var points = window.hexMaths.hexPointsAtOffset(pixelLocation.px, pixelLocation.py, scale);
		var rotationFactor = window.gridCompas.directionValues[rotation];

		context.beginPath();
		context.moveTo(points[(0 + rotationFactor) % 6].x, points[(0 + rotationFactor) % 6].y);
		context.lineTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(3 + rotationFactor) % 6].x, points[(3 + rotationFactor) % 6].y);
		context.lineTo(points[(4 + rotationFactor) % 6].x, points[(4 + rotationFactor) % 6].y);
		context.closePath();

		context.fillStyle = window.colours.road;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = window.colours.outline;
		context.stroke();

		window.drawFuncs._hexagon(context, { scale: scale, state: state, offset: pixelLocation, outline: { show: false } });
	},

	roadCorner: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var points = window.hexMaths.hexPointsAtOffset(pixelLocation.px, pixelLocation.py, scale);
		var rotationFactor = window.gridCompas.directionValues[rotation];

		context.beginPath();
		context.moveTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(2 + rotationFactor) % 6].x, points[(2 + rotationFactor) % 6].y);
		context.lineTo(points[(3 + rotationFactor) % 6].x, points[(3 + rotationFactor) % 6].y);
		context.lineTo(points[(4 + rotationFactor) % 6].x, points[(4 + rotationFactor) % 6].y);
		context.closePath();

		context.fillStyle = window.colours.road;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = window.colours.outline;
		context.stroke();

		window.drawFuncs._hexagon(context, { scale: scale, state: state, offset: pixelLocation, outline: { show: false } });
	},

	roadTJunction: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var points = window.hexMaths.hexPointsAtOffset(pixelLocation.px, pixelLocation.py, scale);
		var rotationFactor = window.gridCompas.directionValues[rotation];
		var buffer = scale * 0.2;

		context.beginPath();
		context.moveTo(points[(0 + rotationFactor) % 6].x, points[(0 + rotationFactor) % 6].y);
		context.lineTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(2 + rotationFactor) % 6].x, points[(2 + rotationFactor) % 6].y);
		context.lineTo(points[(3 + rotationFactor) % 6].x, points[(3 + rotationFactor) % 6].y);
		context.lineTo(points[(4 + rotationFactor) % 6].x, points[(4 + rotationFactor) % 6].y);
		context.closePath();

		context.fillStyle = window.colours.road;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = window.colours.outline;
		context.stroke();

		context.beginPath();
		context.moveTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(4 + rotationFactor) % 6].x, points[(4 + rotationFactor) % 6].y);
		context.stroke();

		window.drawFuncs._hexagon(context, { scale: scale, state: state, offset: pixelLocation, outline: { show: false } });
	},

	roadBridge: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		window.drawFuncs.road(context, pixelLocation, scale, rotation, state, itemArgs);

		var points = window.hexMaths.hexPointsAtOffset(pixelLocation.px, pixelLocation.py, scale);
		var rotationFactor = window.gridCompas.directionValues[rotation];

		context.beginPath();
		context.moveTo(points[(0 + rotationFactor) % 6].x, points[(0 + rotationFactor) % 6].y);
		context.lineTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(3 + rotationFactor) % 6].x, points[(3 + rotationFactor) % 6].y);
		context.lineTo(points[(4 + rotationFactor) % 6].x, points[(4 + rotationFactor) % 6].y);
		context.closePath();

		context.fillStyle = window.colours.road;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = window.colours.outline;
		context.stroke();

		context.beginPath();
		context.moveTo(points[(2 + rotationFactor) % 6].x, points[(2 + rotationFactor) % 6].y);
		context.lineTo(points[(5 + rotationFactor) % 6].x, points[(5 + rotationFactor) % 6].y);
		context.stroke();

		window.drawFuncs._hexagon(context, { scale: scale, state: state, offset: pixelLocation, outline: { show: false } });
	},

	barrier: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var points = window.hexMaths.hexPointsAtOffset(pixelLocation.px, pixelLocation.py, scale);
		var rotationFactor = window.gridCompas.directionValues[rotation];
		context.beginPath();
		context.moveTo(points[(0 + rotationFactor) % 6].x, points[(0 + rotationFactor) % 6].y);
		context.lineTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(2 + rotationFactor) % 6].x, points[(2 + rotationFactor) % 6].y);
		context.lineWidth = scale * 0.4;
		context.strokeStyle = window.colours.barrier;
		context.stroke();

		// For hilighting purposes we need a hex even if it has nothing in it
		window.drawFuncs._hexagon(context, { scale: scale, state: state, offset: pixelLocation, outline: { show: false } });
	},

	bullseye: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf140", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	flag: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf024", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	bolt: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf0e7", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	comms: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf130", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	truck: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf0d1", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	warning: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf071", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	person: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf007", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	wrench: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "\uf0ad", isIcon: true, colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	a: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "A", colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	b: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "B", colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	c: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "C", colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},

	d: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: "D", colour: window.colours.objective },
			outline: { show: false },
		};
		window.drawFuncs._hexagon(context, options);
	},
};

window.tileBacking = window.drawableFactory.newDrawableMultiple("tempTiles", [
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

window.halfTileBacking = window.drawableFactory.newDrawableMultiple("tempTiles", [
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
	{ move: "sw" },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw" },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw" },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
	{ move: "sw" },
	{ move: "nw", draw: window.drawFuncs._outlineHex },
]);
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
	hilightAlternate: "rgba(253,150,239, 0.5)",
	building: "#404040",
	barrier: "#404040",
	outline: "black",
	lightOutline: "white",
	road: "#999966",
	nothing: "white",
	objective: "red",
	sateliteBackground: "#576870",
};

var tileCentreIndex = { gx: 4, gy: 3 };

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
				context.font = Math.floor(options.scale * 1.5) + "px FontAwesome";
			} else {
				context.font = "bold " + Math.floor(options.scale) + "px Arial";
			}
			context.fillText(options.text.value, textLeft, textTop, maxWidth);
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

	_outlineHex: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, offset: pixelLocation, state: window.gridItemState.normal,
			outline: { show: true, colour: window.colours.outline },
		};
		window.drawFuncs._hexagon(context, options);
	},

	hilightHex: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._hilightHexagon(context, { scale: scale, offset: pixelLocation, state: window.gridItemState.selected });
	},

	hilightRotationPointHex: function(context, pixelLocation, scale, rotation, state) {
		var points = window.hexMaths.hexPointsAtOffset(pixelLocation.px, pixelLocation.py, scale);
		window.drawFuncs._drawPoints(context, points);
		context.fillStyle = window.colours.hilightAlternate;
		context.fill();

		context.lineWidth = 2;
		context.strokeStyle = window.colours.hilightAlternate;
		context.stroke();
	},

	_cachedDrawableMaps: [],
	_loadDrawableMap: function(id, json) {
		if (window.drawFuncs._cachedDrawableMaps[id] == undefined) {
			var pathJson = "";
			switch(id) {
				case "tempTiles": { pathJson = '{"id":"tempTiles","description":"tempTiles","drawPath":"n:,n:,n:,sw:,nw:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:,s:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,sw:,se:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,se:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,se:,s:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,sw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,s:_outlineHex,se:,ne:_outlineHex,se:,ne:_outlineHex"}'; break; }
				case "tempHalfTiles": { pathJson = '{"id":"tempTiles","description":"tempTiles","drawPath":"n:,n:,n:,sw:,nw:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:,s:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,sw:,se:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,ne:_outlineHex,se:_outlineHex,se:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex,sw:_outlineHex,nw:_outlineHex"}'; break; }
				case "tempRiverOne": { pathJson = '{"id":"tempRiver","description":"tempRiver","drawPath":"n:,n:,n:depthOneRiver,sw:depthOneRiver,s:depthOneRiver,s:depthOneRiver,se:depthOneRiver,se:depthOneRiver,sw:depthOneRiver,se:depthOneRiver,sw:depthOneRiver,s:depthOneRiver" }'; break; }
				case "tempRiverTwo": { pathJson = '{"id":"tempRiver", "description":"tempRiver", "drawPath":"n:,n:,n:depthOneRiver,sw:depthOneRiver,se:depthOneRiver,sw:depthZeroRiver,s:depthZeroRiver,s:depthZeroRiver,se:depthOneRiver,s:depthOneRiver,s:depthOneRiver,n:,n:,ne:depthZeroRiver,ne:depthZeroRiver,nw:depthZeroRiver,n:depthZeroRiver"}'; break; }
				case "tempRiverThree": { pathJson = '{"id":"tempRiver", "description":"tempRiver", "drawPath":"n:,n:,n:depthOneRiver,se:depthOneRiver,s:depthOneRiver,s:depthOneRiver,s:depthOneRiver,s:depthOneRiver,sw:depthOneRiver,se:depthOneRiver,sw:depthOneRiver"}'; break; }
				case "tempRiverFour": { pathJson = '{"id":"tempRiver", "description":"tempRiver","drawPath":"se:,se:,se:depthOneRiver,n:depthOneRiver,n:depthOneRiver,nw:depthOneRiver,nw:depthOneRiver,s:depthOneRiver,s:depthOneRiver,s:depthOneRiver,sw:depthOneRiver,s:depthOneRiver"}'; break; }
				case "tempRiverFive": { pathJson = '{"id":"tempRiver","description":"tempRiver","drawPath":",s:,s:,s:depthOneRiver,n:depthOneRiver,n:depthOneRiver,ne:depthOneRiver,n:depthOneRiver,n:depthOneRiver,ne:depthOneRiver,se:depthOneRiver"}'; break; }
				case "tempRiverSix": { pathJson = '{ "id":"tempRiver", "description":"tempRiver","drawPath":"s:,s:,s:depthOneRiver,n:depthOneRiver,n:depthOneRiver,ne:depthOneRiver,n:depthOneRiver,n:depthOneRiver,nw:depthOneRiver,sw:depthOneRiver,s:depthTwoRiver,sw:depthOneRiver,s:depthOneRiver,se:depthTwoRiver,s:depthOneRiver,n:,n:depthTwoRiver,ne:depthTwoRiver,n:depthOneRiver"}'; break; }
				default: { throw "Missing path for " + id; break; }
			}

			window.drawFuncs._cachedDrawableMaps[id] = window.drawableFactory.newDrawableFromJson(pathJson);
		}

		return window.drawFuncs._cachedDrawableMaps[id];
	},

	// - - - - - - - - - - - - - - - - - - - - - - Tile types - - - - - - - - - - - - - - - - - - - - - - - - - -
	_tileBackingImages: {},

	_getTileBackingImage: function (scale) {
		var tileIndex = "scale_" + scale;
		if (window.drawFuncs._tileBackingImages[tileIndex] !== undefined) {
			return window.drawFuncs._tileBackingImages[tileIndex];
		}

		var tileHexesCanvas = $("<canvas id=\"" + tileIndex + "\"/>").attr("style", "display:none;").attr("width", window.hexMaths.getWidth(scale) + 1).attr("height", window.hexMaths.getHeight(scale) + 1);
		$("body").append(tileHexesCanvas);

		var tileHexes = window.newGrid(scale / 7, { sx: 9, sy: 7 }, { px: 0, py: 0 });
		tileHexes.addItem({ gx: 4, gy: 3 }, "n", window.drawFuncs._loadDrawableMap("tempTiles"));
		tileHexes.draw(tileHexesCanvas[0].getContext("2d"));

		var backingHexImage = new Image();
		backingHexImage.src = tileHexesCanvas[0].toDataURL("image/png");
		window.drawFuncs._tileBackingImages[tileIndex] = backingHexImage;

		return window.drawFuncs._tileBackingImages[tileIndex];
	},

	_getHalfTileBackingImage: function (scale) {
		var tileIndex = "scale_" + scale + "_half";
		if (window.drawFuncs._tileBackingImages[tileIndex] !== undefined) {
			return window.drawFuncs._tileBackingImages[tileIndex];
		}

		var tileHexesCanvas = $("<canvas id=\"" + tileIndex + "\"/>").attr("style", "display:none;").attr("width", window.hexMaths.getWidth(scale) + 1).attr("height", (window.hexMaths.getHeight(scale) / 2.0) + 1);
		$("body").append(tileHexesCanvas);

		var tileHexes = window.newGrid(scale / 7, { sx: 9, sy: 4 }, { px: 0, py: 0 });
		tileHexes.addItem({ gx: 4, gy: 3 }, "n", window.drawFuncs._loadDrawableMap("tempHalfTiles"));
		tileHexes.draw(tileHexesCanvas[0].getContext("2d"));

		var backingHexImage = new Image();
		backingHexImage.src = tileHexesCanvas[0].toDataURL("image/png");
		window.drawFuncs._tileBackingImages[tileIndex] = backingHexImage;

		return window.drawFuncs._tileBackingImages[tileIndex];
	},

	tile: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile },
			outline: { show: true, thickness: 2 }
		};
		window.drawFuncs._hexagon(context, options);
		context.drawImage(window.drawFuncs._getTileBackingImage(scale), pixelLocation.px, pixelLocation.py);
	},

	halfTile: function(context, pixelLocation, scale, rotation, state) {
		var points = window.hexMaths.hexPointsAtOffset(pixelLocation.px, pixelLocation.py, scale);
		var rotationFactor = window.gridCompas.directionValues[rotation];

		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(points[(5 + rotationFactor) % 6].x, points[(5 + rotationFactor) % 6].y);
		context.lineTo(points[(2 + rotationFactor) % 6].x, points[(2 + rotationFactor) % 6].y);
		context.lineTo(points[(1 + rotationFactor) % 6].x, points[(1 + rotationFactor) % 6].y);
		context.lineTo(points[(0 + rotationFactor) % 6].x, points[(0 + rotationFactor) % 6].y);
		context.closePath();

		context.fillStyle = window.colours.tile;
		context.fill();
		context.strokeStyle = window.colours.outline;
		context.stroke();

		var halfWidth = window.hexMaths.getWidth(scale) / 2.0;
		var halfHeight = window.hexMaths.getHeight(scale) / 2.0;
		var image = window.drawFuncs._getHalfTileBackingImage(scale);

		context.save();
		context.translate(pixelLocation.px + halfWidth, pixelLocation.py + halfHeight);
		context.rotate((rotationFactor * 60) * Math.PI / 180);
		context.drawImage(image, -halfWidth, -halfHeight);
		context.restore();

		window.drawFuncs._hexagon(context, { scale: scale, state: state, offset: pixelLocation, outline: { show: false } });
	},

	riverOne: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile },
			outline: { show: true, thickness: 2 }
		};
		window.drawFuncs._hexagon(context, options);
		context.drawImage(window.drawFuncs._getTileBackingImage(scale), pixelLocation.px, pixelLocation.py);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);

		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawFuncs._loadDrawableMap("tempRiverOne"));
		river.state = state;
		tempGrid.draw(context);
	},

	riverTwo: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile },
			outline: { show: true, thickness: 2 }
		};
		window.drawFuncs._hexagon(context, options);
		context.drawImage(window.drawFuncs._getTileBackingImage(scale), pixelLocation.px, pixelLocation.py);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawFuncs._loadDrawableMap("tempRiverTwo"));
		river.state = state;
		tempGrid.draw(context);
	},

	riverThree: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile },
			outline: { show: true, thickness: 2 }
		};
		window.drawFuncs._hexagon(context, options);
		context.drawImage(window.drawFuncs._getTileBackingImage(scale), pixelLocation.px, pixelLocation.py);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawFuncs._loadDrawableMap("tempRiverThree"));
		river.state = state;
		tempGrid.draw(context);
	},

	riverFour: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile },
			outline: { show: true, thickness: 2 }
		};
		window.drawFuncs._hexagon(context, options);
		context.drawImage(window.drawFuncs._getTileBackingImage(scale), pixelLocation.px, pixelLocation.py);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawFuncs._loadDrawableMap("tempRiverFour"));
		river.state = state;
		tempGrid.draw(context);
	},

	riverFive: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile },
			outline: { show: true, thickness: 2 }
		};
		window.drawFuncs._hexagon(context, options);
		context.drawImage(window.drawFuncs._getTileBackingImage(scale), pixelLocation.px, pixelLocation.py);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawFuncs._loadDrawableMap("tempRiverFive"));
		river.state = state;
		tempGrid.draw(context);
	},

	riverSix: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.tile },
			outline: { show: true, thickness: 2 }
		};
		window.drawFuncs._hexagon(context, options);
		context.drawImage(window.drawFuncs._getTileBackingImage(scale), pixelLocation.px, pixelLocation.py);

		var tempGrid = window.newGrid(scale / 7, { sx: 9, sy: 7 }, pixelLocation);
		var river = tempGrid.addItem(tileCentreIndex, rotation, window.drawFuncs._loadDrawableMap("tempRiverSix"));
		river.state = state;
		tempGrid.draw(context);
	},

	// - - - - - - - - - - - - - - - - - - - - - - Terrain types - - - - - - - - - - - - - - - - - - - - - - - - - -
	lightWoods: function(context, pixelLocation, scale, rotation, state) {
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

	heavyWoods: function(context, pixelLocation, scale, rotation, state) {
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

	water: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.water }
		};
		window.drawFuncs._hexagon(context, options);
	},

	depthZeroRiver: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.lightWater },
			text: { value: "D0" }
		};
		window.drawFuncs._hexagon(context, options);
	},

	depthOneRiver: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.water },
			text: { value: "D1" }
		};
		window.drawFuncs._hexagon(context, options);
	},

	depthTwoRiver: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.darkWater },
			text: { value: "D2", colour: window.colours.lightOutline }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightZeroBuilding: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B0", colour: window.colours.lightOutline }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightOneBuilding: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B1", colour: window.colours.lightOutline }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightTwoBuilding: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B2", colour: window.colours.lightOutline }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightThreeBuilding: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B3", colour: window.colours.lightOutline }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightFourBuilding: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.building },
			text: { value: "B4", colour: window.colours.lightOutline }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightOneHill: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hill },
			text: { value: "H1" }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightTwoHill: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hillTwo },
			text: { value: "H2" }
		};
		window.drawFuncs._hexagon(context, options);
	},

	heightThreeHill: function(context, pixelLocation, scale, rotation, state) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			fill: { show: true, colour: window.colours.hillThree },
			text: { value: "H3", colour: window.colours.lightOutline }
		};
		window.drawFuncs._hexagon(context, options);
	},

	road: function(context, pixelLocation, scale, rotation, state) {
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

	roadCorner: function(context, pixelLocation, scale, rotation, state) {
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

	roadTJunction: function(context, pixelLocation, scale, rotation, state) {
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

	roadBridge: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs.road(context, pixelLocation, scale, rotation, state);

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

	barrier: function(context, pixelLocation, scale, rotation, state) {
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

	_objective: function (context, pixelLocation, scale, rotation, state, textValue) {
		var options = {
			scale: scale, state: state, offset: pixelLocation, rotation: rotation,
			text: { value: textValue, isIcon: true, colour: window.colours.objective },
			outline: { show: false }
		};
		window.drawFuncs._hexagon(context, options);
	},

	bullseye: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf140");
	},

	flag: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf024");
	},

	bolt: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf0e7");
	},

	comms: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf130");
	},

	truck: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf0d1");
	},

	warning: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf071");
	},

	person: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf007");
	},

	wrench: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "\uf0ad");
	},

	a: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "A");
	},

	b: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "B");
	},

	c: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "C");
	},

	d: function(context, pixelLocation, scale, rotation, state) {
		window.drawFuncs._objective(context, pixelLocation, scale, rotation, state, "D");
	},
};
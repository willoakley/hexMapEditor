window.gridCompas = {
	_oddNegbouringHexIndexMap: Object.freeze({ n: { x: 0,  y: -1 }, ne: { x: 1,  y: 0 }, se: { x: 1,  y: 1 }, s:  { x: 0,  y: 1 }, sw: { x: -1, y: 1 }, nw: { x: -1, y: 0 } }),
	_evenNegbouringHexIndexMap: Object.freeze({ n: { x: 0,  y: -1 }, ne: { x: 1,  y: -1 }, se: { x: 1,  y: 0 }, s:  { x: 0,  y: 1 }, sw: { x: -1, y: 0 }, nw: { x: -1, y: -1 } }),
	_directionValuesReverse: Object.freeze({ 0: "n", 1: "ne", 2: "se", 3: "s", 4: "sw", 5: "nw" }),

	directionValues: Object.freeze({ n: 0, ne: 1, se: 2, s:  3, sw: 4, nw: 5 }),
	directionOptions: Object.freeze({ north: "n", south: "s", northEast: "ne", southEast: "se", northWest: "nw", southWest: "sw" }),

	rotateFacingBy: function (currentFacing, byFaces) {
		if (byFaces == undefined || byFaces < 1) {
			return currentFacing;
		}

		var directionValue = this.directionValues[currentFacing];
		return this._directionValuesReverse[directionValue + byFaces % 6];
	},

	getNeghbouringGridIndex: function (index, direction) {
		var map = this._evenNegbouringHexIndexMap;
		if (index.gx % 2 == 1) {
			map = this._oddNegbouringHexIndexMap;
		}

		var directionMapping = map[direction];
		if (directionMapping === undefined) {
			return undefined;
		}

		return { gx: index.gx + directionMapping.x, gy: index.gy + directionMapping.y };
	},

	followPathFromGridIndex: function (index, pathArray, includeWalkedIndexes) {
		var currentIndex = index;
		var walkedIndexes = [];
		walkedIndexes[0] = currentIndex;

		for (var ii = 0; ii < pathArray.length; ii++) {
			currentIndex = this.getNeghbouringGridIndex(currentIndex, pathArray[ii]);
			walkedIndexes[ii + 1] = currentIndex;
		}

		if (includeWalkedIndexes !== undefined && includeWalkedIndexes == true) {
			return { destination: currentIndex, walkedIndexes: walkedIndexes };
		}

		return currentIndex;
	},
};


window.drawableFactory = {
	/*  
		drawFunction should be a function like:
		function (context, pixelLocation, scale, facing) {
			console.log("drawableFactory._defaultDraw called for '" + this.id + "' at [" + pixelLocation.px + "," + pixelLocation.py + "].";
		}
		The scale is typically the side of the hex you give to the grid. your items should draw based on this scale.
		The facing is the current facing of the item in case it makes a difference to what you want to draw.
		
		pathDrawFunctionArray should be an array of objects like:
		{ move: "s"; draw: drawFunction }
		For no move, supply move as null or ommit the 'move' property. The move is assuming the structure is designed in its north facing position
		For no draw at hex (i.e. just move a space) ommit the 'draw' property
	*/

	newDrawableSingle: function (id, drawFunction) {
		return {
			id: id,
			type: "single",
			drawPath: [ { move: null, draw: drawFunction } ],
		};
	},

	newDrawableMultiple: function (id, pathDrawFunctionArray) {
		return {
			id: id,
			type: "multiple",
			drawPath: pathDrawFunctionArray,
		};
	},
};


window.newGridIndex = function (x, y) {
	return { gx: x, gy: y };
};


window.newGrid = function (scale, size, offset) {
	scale = scale || 16.0;
	offset = offset || { px: 0.0, py: 0.0 };
	size = size || { sx: 1, sy: 1 };

	return {
		_scale: scale,
		_pixelOffset: offset,
		_size: size,
		_indexesContainingSomething: null,
		_grid: {
			/* order keys are added serves as draw order */
			/* "x,y": { drawableItem, positioning: { facing, startIndex, affectedIndexes } } */
		},

		_clear_indexesContainingSomething: function () {
			this._indexesContainingSomething = [];
			for (var x = 0; x < this._size.sx; x++) {
				this._indexesContainingSomething[x] = [];
				for (var y = 0; y < this._size.sy; y++) {
					this._indexesContainingSomething[x][y] = null;
				}
			}
		},

		_moveIsValid: function (move) {
			return move !== undefined && move != null;
		},

		_getPixelLocationFormGridIndex: function (gridIndex) {
			var width = window.hexMaths.getOffsetWidth(this._scale);
			var height = window.hexMaths.getHeight(this._scale);
			
			var leftOffset = gridIndex.gx * width;
			var topOffset = gridIndex.gy * height;
			if (Math.abs(gridIndex.gx) % 2 == 1) {
				topOffset = topOffset + (height / 2.0);
			}
			
			return { px: this._pixelOffset.px + leftOffset, py: this._pixelOffset.py + topOffset };
		},

		recalculateAffectedIndexes: function() {
			this._clear_indexesContainingSomething();

			var keys = Object.keys(this._grid);
			for (var k = 0; k < keys.length; k++) {
				var item = this._grid[keys[k]];
				for (var i = 0; i < item.positioning.affectedIndexes.length; i++) {
					var affectedIndex = item.positioning.affectedIndexes[i];
					this._indexesContainingSomething[affectedIndex.gx][affectedIndex.gy] = item;
				}
			}
		},

		addItem: function (gridIndex, facing, drawableItem) {
			var index = gridIndex.gx + "," + gridIndex.gy;

			this._grid[index] = {
				drawableItem: drawableItem,
				positioning: {
					facing: facing,
					startIndex: gridIndex,
					affectedIndexes: [ gridIndex ],
				},
			};

			if (drawableItem.type == "multiple") {
				// need to update affected hexes based on the paths
				var count = 0;
				var currentIndex = gridIndex;
				for (var i = 0; i < drawableItem.drawPath.length; i++) {
					var current = drawableItem.drawPath[i];

					if (this._moveIsValid(current.move)) {
						var moveDirection = current.move;
						if (facing != window.gridCompas.directionOptions.north) {
							moveDirection = window.gridCompas.rotateFacingBy(moveDirection, window.gridCompas.directionValues[facing]);
						}

						currentIndex = window.gridCompas.getNeghbouringGridIndex(currentIndex, moveDirection);
					}

					if (current.draw !== undefined) {
						// index is affected only if we would draw something there
						this._grid[index].positioning.affectedIndexes[count] = currentIndex;
						count++;
					}
				}
			}

			this.recalculateAffectedIndexes();
		},

		reomveItem: function (drawableItem) {
			var keys = Object.keys(this._grid);
			for (var k = 0; k < keys.length; k++) {
				var item = this._grid[keys[k]];

				if (item.drawableItem == drawableItem) {
					delete this._grid[keys[k]];
					break;
				}
			}
		}, 

		getItemAt: function (gridIndex) {
			if (gridIndex.gx >= this._size.sx || gridIndex.gy >= this._size.sy) {
				return null;
			}

			return this._indexesContainingSomething[gridIndex.gx][gridIndex.gy]; 
		},

		draw: function (context) {
			var keys = Object.keys(this._grid);
			for (var k = 0; k < keys.length; k++) {
				var item = this._grid[keys[k]];
				var currentIndex = item.positioning.startIndex;

				for (var i = 0; i < item.drawableItem.drawPath.length; i++) {
					var current = item.drawableItem.drawPath[i];

					if (this._moveIsValid(current.move)) {
						var moveDirection = current.move;
						if (item.positioning.facing != window.gridCompas.directionOptions.north) {
							moveDirection = window.gridCompas.rotateFacingBy(moveDirection, window.gridCompas.directionValues[item.positioning.facing]);
						}

						currentIndex = window.gridCompas.getNeghbouringGridIndex(currentIndex, moveDirection);
					}

					if (current.draw === undefined) {
						continue;
					}

					var pixelLocation = this._getPixelLocationFormGridIndex(currentIndex);
					current.draw(context, pixelLocation, this._scale, item.positioning.facing);
				}
			}
		},

		// TODO potentially useful for drawing grids on top etc.
		drawUnderlay: function (context) {},
		drawOverlay: function (context) {},
	};
};
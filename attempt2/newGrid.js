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
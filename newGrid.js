window.gridItemState = Object.freeze({
	normal: "normal",
	selected: "selected",
});

window.newGrid = function (scale, size, offset) {
	scale = scale || 16.0;
	offset = offset || { px: 0.0, py: 0.0 };
	size = size || { sx: 1, sy: 1 };

	return {
		_scale: scale,
		_pixelOffset: offset,
		_size: size,
		_indexesContainingSomething: {},
		_grid: {
			/* order keys are added serves as draw order */
			/* "x,y": { drawableItem, positioning: { facing, startIndex, affectedIndexes } } */
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

		_contains: function (item) {
			var keys = Object.keys(this._grid);
			for (var k = 0; k < keys.length; k++) {
				var currentitem = this._grid[keys[k]];

				if (item == currentitem) {
					return true;
				}
			}

			return false;
		},

		getScale: function() {
			return this._scale;
		},

		getSize: function () {
			return Object.freeze(this._size);
		},

		getGridIndexFormPixelLocation: function (pixelCoordinates) {
			var x = pixelCoordinates.px - this._pixelOffset.px;
			var y = pixelCoordinates.py - this._pixelOffset.py;

			/* Logic:
			 * Each hex is split vertically and horisontally. The left horisontal section contains the lefthand sloped section and a side length's worth or rectangle.
			 * The upper and lower sections are split evenly across the middle of the hex.
			 * There are two types of section (A and B). When the segment row and column are both even or both are odd, you see a section A, otherwise a section B
			 * E represents the start of an even section row or column, O an odd one.
			 *
				   E \      O/       E \
				 .E:........:........:........
				   : /      :\       : /
				   :/   A   : \  B   :/
				 .O:........:........:........
				   :\   B   : /  A   :\
				 .E:.\......:/.......:.\.......
				   : /      :\       : /
			 */

			var sectionWidth = window.hexMaths.getSectionWidth(this._scale);
			var sectionHeight = window.hexMaths.getSectionHeight(this._scale);
			var sectionX = Math.floor(x / sectionWidth);
			var sectionY = Math.floor(y / sectionHeight);
			var columnIsEven = sectionX % 2 == 0;
			var columnIsOdd = !columnIsEven;
			var rowIsEven = sectionY % 2 == 0;

			// The odd columns are shifted down by one row so take that off to get the index right on odd columns
			var yGridPosition = (sectionY / 2);
			if (columnIsOdd && rowIsEven) {
				yGridPosition = yGridPosition - 1;
			}

			var differenceBetweenStartOfXSectionAndXPosition = x - (sectionX * sectionWidth);
			if (differenceBetweenStartOfXSectionAndXPosition >= window.hexMaths.getH(this._scale)) {
				//...then we're in the unsloped/rectangular section of the hex section (unique across both halves and section types A and B.
				return { gx: sectionX, gy: Math.floor(yGridPosition) };
			}

			var isSegmentTypeA = sectionX % 2 == sectionY % 2;
			var differenceBetweenStartOfYSectionAndYPosition = null;
			if (isSegmentTypeA) {
				differenceBetweenStartOfYSectionAndYPosition = ((sectionY + 1) * sectionHeight) - y;
			} else {
				differenceBetweenStartOfYSectionAndYPosition = y - (sectionY * sectionHeight);
			}

			// The angle between the hex edge and straight up vertical is 30 degrees. More 30 degrees and we're to the right of the line. 0.5235 is 30 degrees in radians
			var angleInRadians = Math.atan(differenceBetweenStartOfXSectionAndXPosition / differenceBetweenStartOfYSectionAndYPosition);
			var rightOfLine = Math.abs(angleInRadians) >= 0.5235;

			if (rightOfLine) {
				return { gx: sectionX, gy: Math.floor(yGridPosition) };
			}

			// Left of line so xGridPosition will be in a hex to the left
			if (columnIsEven && isSegmentTypeA) {
				return { gx: sectionX - 1, gy: Math.floor(yGridPosition - 1) };
			} else if ((!columnIsEven) && (!isSegmentTypeA)) {
				return { gx: sectionX - 1, gy: Math.floor(yGridPosition + 1) };
			} else {
				return { gx: sectionX - 1, gy: Math.floor(yGridPosition) }; // ((!columnIsEven) && isSegmentTypeA) OR (columnIsEven && (!isSegmentTypeA))
			}
		},

		recalculateAffectedIndexes: function() {
			this._indexesContainingSomething = {};

			var keys = Object.keys(this._grid);
			for (var k = 0; k < keys.length; k++) {
				var item = this._grid[keys[k]];
				for (var i = 0; i < item.positioning.affectedIndexes.length; i++) {
					var affectedIndex = item.positioning.affectedIndexes[i];
					this._indexesContainingSomething[affectedIndex.gx + "," + affectedIndex.gy] = item;
				}
			}
		},

		addItem: function (gridIndex, facing, drawableItem, itemArgs) {
			var index = gridIndex.gx + "," + gridIndex.gy + "," + drawableItem.id;

			this._grid[index] = {
				drawableItem: drawableItem,
				itemArgs: itemArgs,
				state: window.gridItemState.normal,
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
			return this._grid[index];
		},

		removeItem: function (item) {
			var keys = Object.keys(this._grid);
			for (var k = 0; k < keys.length; k++) {
				var currentitem = this._grid[keys[k]];

				if (item == currentitem) {
					delete this._grid[keys[k]];
					this.recalculateAffectedIndexes();
					break;
				}
			}
		}, 

		getItemAt: function (gridIndex) {
			var item = this._indexesContainingSomething[gridIndex.gx + "," + gridIndex.gy];
			if (item === undefined) {
				return null;
			}

			return item;
		},

		rotateItem: function (item) {
			if (!this._contains(item)) {
				return;
			}

			item.positioning.facing = window.gridCompas.rotateFacingBy(item.positioning.facing, 1);

			if (item.positioning.affectedIndexes.length > 1) {
				this.recalculateAffectedIndexes();
			}
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
					current.draw(context, pixelLocation, this._scale, item.positioning.facing, item.state, item.itemArgs);
				}
			}
		},
	};
};
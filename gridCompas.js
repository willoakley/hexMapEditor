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
		return this._directionValuesReverse[(directionValue + byFaces) % 6];
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
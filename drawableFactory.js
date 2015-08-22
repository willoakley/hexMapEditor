window.drawableFactory = {
	/*  
		See drawableFactory.js for example definitions of drawFunction function.
		
		pathDrawFunctionArray should be an array of objects like:
		{ move: "s"; draw: drawFunction }
		For no move, supply move as null or ommit the 'move' property. The move is assuming the structure is designed in its north facing position
		For no draw at hex (i.e. just move a space) ommit the 'draw' property
	*/

	newDrawableSingle: function (id, drawFunction, sateliteDrawFunction) {
		return {
			id: id,
			type: "single",
			drawPath: [ { move: null, draw: drawFunction } ],
			sateliteDrawFunction: sateliteDrawFunction
		};
	},

	newDrawableMultiple: function (id, pathDrawFunctionArray, sateliteDrawFunction) {
		return {
			id: id,
			type: "multiple",
			drawPath: pathDrawFunctionArray,
			sateliteDrawFunction: sateliteDrawFunction
		};
	},
};
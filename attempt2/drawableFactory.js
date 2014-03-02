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
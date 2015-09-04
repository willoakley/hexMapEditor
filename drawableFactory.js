window.drawableFactory = {
	/*  
		See drawableFactory.js for example definitions of drawFunction function.
		
		pathDrawFunctionArray should be an array of objects like:
		{ move: "s"; draw: drawFunction }
		For no move, supply move as null or ommit the 'move' property. The move is assuming the structure is designed in its north facing position
		For no draw at hex (i.e. just move a space) ommit the 'draw' property
	*/

	newDrawableMultiple: function (id, description, pathDrawFunctionArray) {
		return {
			id: id,
			description: description,
			drawPath: pathDrawFunctionArray
		};
	},

	newDrawableSingle: function (id, description, drawFunction) {
		return window.drawableFactory.newDrawableMultiple(id, description, [ { draw: drawFunction } ]);
	},

	newDrawableFromJson: function (jsonString) {
		var drawable = JSON.parse(jsonString);
		var drawArray = [];

		if (drawable.id == undefined || drawable.description == undefined || drawable.drawPath == undefined) {
			throw "bad drawable item supplied";
		}

		var moveAndDraw = drawable.drawPath.split(",");
		if (moveAndDraw.length < 1) {
			throw "no parseable move/draw actions in path";
		}

		for (var ii in moveAndDraw) {
			var actions = moveAndDraw[ii].split(":");
			var extractedMove = undefined;
			var extractedDraw = undefined;

			if (actions.length == 0 || actions.length > 2) {
				throw "bad move/draw element in path at position " + ii;
			}

			if (actions.length == 1) {
				extractedDraw = window.drawFuncs[actions[0]];
			}

			if (actions.length > 1) {
				if (actions[0].length == 0 || actions[0].length > 2) {
					throw "bad move detected in path at position " + ii;
				}

				// TODO replace this with just saving the name and evaluating on the draw action.
				if (window.drawFuncs[actions[1]] == undefined) {
					throw "action " + actions[1] + " does not exist from path element " + ii;
				}

				extractedDraw = window.drawFuncs[actions[1]];
				extractedMove = actions[0];
			}

			drawArray[drawArray.length] = { move: extractedMove, draw: extractedDraw };
		}

		return window.drawableFactory.newDrawableMultiple(drawable.id, drawable.description, drawArray);
	},
};
window.drawableFactory = {
	_newDrawableMultiple: function (id, description, pathDrawFunctionArray) {
		return {
			id: id,
			description: description,
			drawPath: pathDrawFunctionArray
		};
	},

	newDrawableFromExistingDrawable: function (drawableItem, newId, newDescription, newDrawFunction) {
		if (window.drawFuncs[newDrawFunction] == undefined) {
			throw "action " + newDrawFunction + " does not exist";
		}

		var pathDrawFunctionArray = [];
		for(var ii in drawableItem.drawPath) {
			pathDrawFunctionArray[ii] = { move: drawableItem.drawPath[ii].move, draw: window.drawFuncs[newDrawFunction] };
		}

		return {
			id: newId,
			description: newDescription,
			drawPath: pathDrawFunctionArray
		};
	},

	// This function is really slow. Avoid calling multiple times
	newDrawableFromJson: function (jsonString) {
		var drawable = JSON.parse(jsonString);
		var drawArray = [];

		if (drawable.id == undefined || drawable.description == undefined || drawable.drawPath == undefined) {
			throw "bad drawable item supplied";
		}

		var moveAndDraw = drawable.drawPath.replace(/\s/g, "").split(",");
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
				if (actions[1].length > 0) {				
					if (window.drawFuncs[actions[1]] == undefined) {
						throw "action " + actions[1] + " does not exist from path element " + ii;
					}

					extractedDraw = window.drawFuncs[actions[1]];
				}

				if (window.gridCompas.directionValues[actions[0]] == undefined) {
					throw "move " + actions[0] + " is not a valid compas direction from path element " + ii;
				}

				extractedMove = actions[0];
			}

			drawArray[drawArray.length] = { move: extractedMove, draw: extractedDraw };
		}

		return window.drawableFactory._newDrawableMultiple(drawable.id, drawable.description, drawArray);
	},
};
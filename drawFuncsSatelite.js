window.drawFuncsSatelite = {
	dummy: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		/* TODO: Figure out what parameters are needed to actually draw the images in the right place */
		if (state == window.gridItemState.selected) {
			window.drawFuncs.hilightHex(context, pixelLocation, scale, rotation, state, itemArgs);
		}
	},
}
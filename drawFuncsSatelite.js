window.drawFuncsSatelite = {
	dummy: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		/* TODO: Figure out what parameters are needed to actually draw the images in the right place */
		
		/*
		Additional things:
		- centre grid pos of first hex to rotate around
		- top left of first hex to render image - probably needs to be the equivalent depending on the facing
		- image src path?
		*/
		var degrees = 30;
		var image = $("<img />").attr("src", "sceneryImages/barracksPng.png").attr("crossOrigin", "anonymous")[0]; // maybe preload the images on opening to make it easier?

		context.save();

		// move to the center of the canvas
		context.translate(400, 400);

		// rotate the canvas to the specified degrees
		context.rotate(degrees * Math.PI / 180);

		// draw the image
		// since the context is rotated, the image will be rotated also
		context.drawImage(image, scale, scale);

		// we’re done with the rotating so restore the unrotated context
		context.restore();
		
		if (state == window.gridItemState.selected) {
			window.drawFuncs.hilightHex(context, pixelLocation, scale, rotation, state, itemArgs);
		}
	},
}
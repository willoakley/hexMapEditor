window.drawFuncsSatelite = {
	_drawImage: function (context, pixelLocation, scale, rotation, image) {
		var imageScale = scale /  32.0;

		context.save();
		// This might not want to be the top left as it mucks up the drawing when translated
		context.translate(pixelLocation.px, pixelLocation.py);

		var rotationFactor = window.gridCompas.directionValues[rotation];
		if (rotationFactor > 0) {
			context.rotate((rotationFactor * 60) * Math.PI / 180);
		}

		// TODO Sort out the draw position when the image is rotated because of the hex rotation
		context.drawImage(image, 0, 0, image.width * imageScale, image.height * imageScale);
		context.restore();
	},

	dummy: function(context, pixelLocation, scale, rotation, state, itemArgs) {
		var image = window.sateliteImages.barracks;
		window.drawFuncsSatelite._drawImage(context, pixelLocation, scale, rotation, image);
	},
}

window.sateliteImages = {
	// HACK http://websemantics.co.uk/online_tools/image_to_data_uri_convertor/ include the images as b64 code here to get around the same-origin policy on the canvas.
	barracks: $('<img width="58" height="111" src="data:image/png;base64,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" />')[0]
}
window.drawFuncsSatelite = {
	_tileScale: 0.56,

	_itemScale: 0.5,

	_drawImage: function (context, pixelLocationTopLeft, pixelLocationCentre, scale, rotation, image) {
		var negOffset = { px: pixelLocationTopLeft.px - pixelLocationCentre.px, py: pixelLocationTopLeft.py - pixelLocationCentre.py };

		context.save();
		context.translate(pixelLocationCentre.px, pixelLocationCentre.py);

		var rotationFactor = window.gridCompas.directionValues[rotation];
		if (rotationFactor > 0) {
			context.rotate((rotationFactor * 60) * Math.PI / 180);
		}

		context.drawImage(image, negOffset.px, negOffset.py, image.width * scale, image.height * scale);
		context.restore();
	},

	barracks: function(context, pixelLocationTopLeft, pixelLocationCentre, scale, rotation, state, itemArgs) {
		window.drawFuncsSatelite._drawImage(context, pixelLocationTopLeft, pixelLocationCentre, window.drawFuncsSatelite._itemScale, rotation, window.sateliteImages.barracks);
	},
	
	radarStation: function(context, pixelLocationTopLeft, pixelLocationCentre, scale, rotation, state, itemArgs) {
		window.drawFuncsSatelite._drawImage(context, pixelLocationTopLeft, pixelLocationCentre, window.drawFuncsSatelite._itemScale, rotation, window.sateliteImages.radarStation);
	},

	plainTile: function(context, pixelLocationTopLeft, pixelLocationCentre, scale, rotation, state, itemArgs) {
		window.drawFuncsSatelite._drawImage(context, pixelLocationTopLeft, pixelLocationCentre, window.drawFuncsSatelite._tileScale, rotation, window.sateliteImages.plainTile);
	},
}
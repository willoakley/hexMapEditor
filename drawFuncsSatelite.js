window.drawFuncsSatelite = {
	_tileScale: 0.56,
	_itemScale: 0.5,
	_menuItemScale: 0.5,
	_menuTileScale: 0.28,

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

	canSateliteRenderItem: function (id) {
		return $(window.sateliteImages[id]).is('img');
	},

	drawSateliteItem: function(context, pixelLocationTopLeft, pixelLocationCentre, scale, rotation, state, id) {
		var image = window.sateliteImages[id];
		var imageScale = window.drawFuncsSatelite._itemScale;

		switch(scale) {
			case 8: {
				imageScale = window.drawFuncsSatelite._menuItemScale;
				break;
			}
			case 16: {
				imageScale = window.drawFuncsSatelite._itemScale;
				break;
			}
			case 56:
			case 112: {
				imageScale = window.drawFuncsSatelite._tileScale;
				break;
			}
			case 53.33333333333333: {
				imageScale = window.drawFuncsSatelite._menuTileScale;
				break;
			}
			default: {
				console.log(scale);
				console.log(id);
				break;
			}
		}

		window.drawFuncsSatelite._drawImage(context, pixelLocationTopLeft, pixelLocationCentre, imageScale, rotation, image);
	},
}
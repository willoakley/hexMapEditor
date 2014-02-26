window.tile = function (context, hexMaths, options) {
	return {
		context: context,
		hexMaths: hexMaths,
		sideLength: 10.0,
		tileSize: 7,
		
		drawTile: function () {
			window.hexGridFactory(this.context, this.hexMaths, {
				hexSideLength: this.sideLength,
				hexesAcross: this.tileSize + 2,
				hexesDown: this.tileSize
			}).drawGrid({ strokeWidth: 2, strokeColour: "grey" });
			
			window.hexGridFactory(this.context, this.hexMaths, {
				hexesAcross: 1,
				hexesDown: 1,
				/* Some magic figures here but they do scale correctly: */
				hexSideLength: this.sideLength * this.tileSize,
			}).drawGrid({ strokeWidth: 1, strokeColour: "blue", fill: false });
			
			/*
				TODO:
				- only render hex oputlines for those that would be visible inside the tile
				- draw tile outline under hexes instead and fill it with grey or an image of splodgy green and grey
				- make tile text an optional mask with nothing by default
			*/
		},
	};
}
window.grid = {
	context: null,
	hexMaths: null,

	_defaultOptions: function (options) {
		var defaultDrawOptions = {
			offsetLeft: 0.0,
			offsetTop: 0.0,
			sideLength: 30.0,

			fill: true,
			fillColour: "yellow",

			stroke: true,
			strokeColour: 'black',
			strokeWidth: 1,
			
			text: "",
			textColour: "black",
			textSize: 15,
			textFont: "Arial",
		};
	
		if (options === undefined) {
			options = defaultDrawOptions;
		} else {
			options = $.extend(defaultDrawOptions, options);
		}
		
		return options;
	},
	
	init: function (hexMath) {
		// http://stackoverflow.com/questions/3239680/jquery-dynamic-canvas-creation-ctx-getcontext-is-not-a-function
		this.context = $("#canvas")[0].getContext("2d");
		this.hexMaths = hexMath;
	},

	drawHexGrid: function (hexesAcross, hexesDown, options) {
		options = this._defaultOptions(options);
		
		var width = this.hexMaths.getOffsetWidth(options.sideLength);
		var height = this.hexMaths.getHeight(options.sideLength);
		
		for (var x = 0; x < hexesAcross; x++) {
			for (var y = 0; y < hexesDown; y++) {
				options.offsetLeft = x * width;
				if (x % 2 == 1) {
					options.offsetTop = (height / 2.0) + y * height;
				} else {
					options.offsetTop = y * height;
				}
				
				options.text = "[" + x + "," + y + "]";
				
				this.drawHex(options);
			}
		}
	},
	
	drawHex: function(options) {
		options = this._defaultOptions(options);

		var context = this.context;
		var points = this.hexMaths.hexPointsAtOffset(options.offsetLeft, options.offsetTop, options.sideLength);

		context.beginPath();		
		context.moveTo(points[0].x, points[0].y);
		
		for (var ii = 1; ii < points.length; ii++) {
			context.lineTo(points[ii].x, points[ii].y);
		}
		
		context.closePath();
		
		if (options.fill) {
			context.fillStyle = options.fillColour;
			context.fill();
		}
		
		if (options.stroke) {
			context.lineWidth = options.strokeWidth;
			context.strokeStyle = options.strokeColour;
			context.stroke();
		}
		
		if (options.text != null && options.text.length) {
			var maxWidth = this.hexMaths.getOffsetWidth(options.sideLength);
			var textLeft = options.offsetLeft + (this.hexMaths.getWidth(options.sideLength) / 2.0);
			var textTop = options.offsetTop + (this.hexMaths.getHeight(options.sideLength) / 2.0);
			
			context.fillStyle = options.textColour;
			context.textAlign = 'center';
			context.font = "bold " + options.textSize + "px " + options.textFont;
			context.fillText(options.text, textLeft, textTop, maxWidth);
		}
	},
};

grid = window.grid;
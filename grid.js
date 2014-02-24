window.grid = {
	context: null,
	hexMaths: null,

	defaultDrawOptions: {
		offsetLeft: 0.0,
		offsetTop: 0.0,
		sideLength: 30.0,

		fill: true,
		fillStyle: "yellow",

		stroke: true,
		strokeStyle: 'black',
		lineWidth: 1,
	},
	
	init: function (hexMath) {
		this.context = this.getContext();
		this.hexMaths = hexMath;
	},

	getCanvas: function () {
		// http://stackoverflow.com/questions/3239680/jquery-dynamic-canvas-creation-ctx-getcontext-is-not-a-function
		return $("#canvas")[0];
	},
	
	getContext: function () {
		return this.getCanvas().getContext("2d");
	},
	
	drawHex: function(options) {
		if (options === undefined) {
			options = this.defaultDrawOptions;
		} else {
			options = $.extend(this.defaultDrawOptions, options);
		}

		var context = this.context;
		var points = this.hexMaths.hexPointsAtOffset(options.offsetLeft, options.offsetTop, options.sideLength);

		context.beginPath();		
		context.moveTo(points[0].x, points[0].y);
		
		for (var ii = 1; ii < points.length; ii++) {
			context.lineTo(points[ii].x, points[ii].y);
		}
		
		context.closePath();
		
		if (options.fill) {
			context.fillStyle = options.fillStyle;
			context.fill();
		}
		
		if (options.stroke) {
			context.lineWidth = options.lineWidth;
			context.strokeStyle = options.strokeStyle;
			context.stroke();
		}
	},
};

grid = window.grid;
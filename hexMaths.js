window.hexMaths = {
	SinThirtyDegrees: 0.5000,
	CosThirtyDegrees: 0.8660,

	hexPointsAtOffset: function (leftOffset, topOffset, sideLength) {
		var r = this.getR(sideLength);
		var h = this.getH(sideLength);
		var height = 2.0 * r;
		var width = sideLength + 2.0 * h;
		
		return [ 
				{ x: leftOffset + h,                y: topOffset },
				{ x: leftOffset + h + sideLength,   y: topOffset },
				{ x: leftOffset + width,            y: topOffset + r },
				{ x: leftOffset + h + sideLength,   y: topOffset + height },
				{ x: leftOffset + h,                y: topOffset + height },
				{ x: leftOffset,                    y: topOffset + r },
			];
	},
	
	getR: function (sideLength) {
		return this.CosThirtyDegrees * sideLength;
	},
	
	getH: function (sideLength) {
		return this.SinThirtyDegrees * sideLength;
	},
};

hexMaths = window.hexMaths;
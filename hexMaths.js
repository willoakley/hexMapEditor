window.hexMaths = {
	SinThirtyDegrees: 0.5000,
	CosThirtyDegrees: 0.8660,

	hexPointsAtOffset: function (leftOffset, topOffset, sideLength) {
		var r = this.getR(sideLength);
		var h = this.getH(sideLength);
		var height = this.getHeight(sideLength);
		var width = this.getWidth(sideLength);
		
		return [ 
				{ x: leftOffset + h,                y: topOffset },
				{ x: leftOffset + h + sideLength,   y: topOffset },
				{ x: leftOffset + width,            y: topOffset + r },
				{ x: leftOffset + h + sideLength,   y: topOffset + height },
				{ x: leftOffset + h,                y: topOffset + height },
				{ x: leftOffset,                    y: topOffset + r },
			];
	},
	
	getHeight: function (sideLength) {
		return 2.0 * this.getR(sideLength);
	},
	
	getWidth: function (sideLength) {
		return sideLength + 2.0 * this.getH(sideLength);
	},
	
	getOffsetWidth: function (sideLength) {
		return sideLength + this.getH(sideLength);
	},
	
	getR: function (sideLength) {
		return this.CosThirtyDegrees * sideLength;
	},
	
	getH: function (sideLength) {
		return this.SinThirtyDegrees * sideLength;
	},
};

hexMaths = window.hexMaths;
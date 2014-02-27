window.hexFormatOptions = {
	plain:			{ fillColour: "grey", fill: true },
	depthOneWater:	{ text: "D1", fillColour: "blue", fill: true },
};

/* featurePaths are walked from the upper-left-most hex in the tile. moveDirection is not optional options (n, ne, se, s, se, sw).  */
window.tileMenuItems = {
	plain: { 
		name: "plain", 
		featurePaths: [ ]
	},
	
	riverOne: {
		name: "riverOne", 
		featurePaths: [ 
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater }
		]
	},
										
	riverTwo: {
		name: "riverTwo",
		featurePaths: [ 
			{ moveDirection: "s" },
			{ moveDirection: "se", hexFormatOptions: window.hexFormatOptions.depthOneWater }
		]
	},									
};
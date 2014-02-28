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
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater },
		]
	},
										
	riverTwo: {
		name: "riverTwo",
		featurePaths: [ 
			{ moveDirection: "se" },
			{ moveDirection: "ne", hexFormatOptions: window.hexFormatOptions.depthOneWater },
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater },
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater },
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater },
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater },
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater },
			{ moveDirection: "s", hexFormatOptions: window.hexFormatOptions.depthOneWater },
		]
	},									
};
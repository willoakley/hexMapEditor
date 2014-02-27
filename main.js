var hexes = null;
var tiles = null;
var canvas = null;

function canvasClick(ev) {
	var clickX = ev.pageX - canvas.offset().left;
	var clickY = ev.pageY - canvas.offset().top;

	var coordinates = hexes.getGridPositionFromCoordinates(clickX, clickY);
	hexes.drawHexAtGridIndex(coordinates.x, coordinates.y, { fillColour: "red", text: "click" });
};

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	var data = $(ev.currentTarget).data("drag-data");
	
	ev.dataTransfer.setData("Text", JSON.stringify(data));
}

function drop(ev) {
	ev.preventDefault();

	var clickX = ev.pageX - canvas.offset().left;
	var clickY = ev.pageY - canvas.offset().top;
	var data = JSON.parse(ev.dataTransfer.getData("Text"));

	console.log("drop-at:[" + clickX + "," + clickY + "] data:" + data);

	var coordinates = hexes.getGridPositionFromCoordinates(clickX, clickY);
	hexes.drawHexAtGridIndex(coordinates.x, coordinates.y, { fillColour: "green", text: data });
}

function addTileToMenu(newTile) {
	var id = "menuTile_" + newTile.name;
	$("<canvas id=\"" + id + "\"/>")
		.attr("class", "draggable")
		.attr("width", "150")
		.attr("height", "150")
		.data("drag-data", newTile.name).appendTo($(".parts.tiles"));
	$("<br />").appendTo($(".parts.tiles"));

	var tileContext = $("#" + id)[0].getContext("2d");
	window.tile(tileContext, window.hexMaths, { hexSideLength: 10, gridLeftOffset: 2.0, gridTopOffset: 2.0 }, newTile.featurePaths).drawTile();
}

$(document).ready(function () {
	var tileName = "plainTile";
	
	for(var newTileKey in window.tileMenuItems) {
		addTileToMenu(window.tileMenuItems[newTileKey]);
	}

	canvas = $("#canvas");
	var context = canvas[0].getContext("2d");
	canvas.click(canvasClick);

	hexes = window.hexGridFactory.createHexGrid(context, window.hexMaths, { hexSideLength: 16, hexesAcross: 39, hexesDown: 29 });
	// Do not draw these. They are there for calculations and debugging only
	//hexes.drawGrid({ strokeWidth: 1, strokeColour: "grey", fill: false });

	tiles = window.hexGridFactory.createHexGrid(context, window.hexMaths, {
		hexesAcross: 5,
		hexesDown: 4,
		/* Some magic figures here but they do scale correctly: */
		hexSideLength: hexes.sideLength * 7,
		gridLeftOffset: hexes.sideLength * 1.44, 
		gridTopOffset: hexes.sideLength * 0.88,
	});
	tiles.drawGrid({ stroke: true, strokeWidth: 2, strokeColour: "black" });

	$("#downloadMapLink").click(function () {
		this.href = canvas[0].toDataURL('image/png');
	});
	
	$(".draggable").attr("draggable", "true").attr("ondragstart", "drag(event)");
});









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

$(document).ready(function () {
	$(".draggable").attr("draggable", "true").attr("ondragstart", "drag(event)");

	canvas = $("#canvas");
	var context = canvas[0].getContext("2d");
	canvas.click(canvasClick);

	hexes = window.hexGridFactory(context, window.hexMaths, { hexSideLength: 10, hexesAcross: 31, hexesDown: 18 });
	hexes.drawGrid({ strokeWidth: 2, strokeColour: "grey" });

	tiles = window.hexGridFactory(context, window.hexMaths, {
		hexesAcross: 4,
		hexesDown: 4,
		/* Some magic figures here but they do scale correctly: */
		hexSideLength: hexes.sideLength * 7,
		gridLeftOffset: hexes.sideLength * 1.44, 
		gridTopOffset: hexes.sideLength * 0.88,
	});
	tiles.drawGrid({ strokeWidth: 1, strokeColour: "blue", fill: false });

	$("#downloadMapLink").click(function () {
		this.href = canvas[0].toDataURL('image/png');
	});
	
	var testTileContext = $("#testTileCanvas")[0].getContext("2d");
	var testTile = window.tile(testTileContext, window.hexMaths, {});
	testTile.drawTile();
});









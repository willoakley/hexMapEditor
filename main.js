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
	
	hexes = window.hexGridFactory(context, window.hexMaths, { hexSideLength: 25, hexesAcross: 31, hexesDown: 18 });
	hexes.drawGrid({ strokeWidth: 2, strokeColour: "grey" });
	
	tiles = window.tileGridFactory(context, window.hexMaths, hexes);
	tiles.drawGrid();
	
	canvas.click(canvasClick);
});
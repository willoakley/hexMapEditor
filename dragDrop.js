var trackingData = { grid: null, hilightItem: null };

function menuItemBeginDrag(ev) {
	var data = $(ev.currentTarget).data("drag-data");
	ev.dataTransfer.setData("Text", data);

	switch (JSON.parse(data).type) {
		case "tile": {
			trackingData.grid = tileGrid;
			break;
		} case "hex": {
			trackingData.grid = hexGrid;
			break;
		}
	}
}

function menuItemEndDrag(event) {
	trackingData.grid.removeItem(trackingData.hilightItem);
	drawCanvas();
}

function canvasDrop(ev) {
	ev.preventDefault();

	var clickX = ev.pageX - canvasElement.offset().left;
	var clickY = ev.pageY - canvasElement.offset().top;
	var data = JSON.parse(ev.dataTransfer.getData("Text"));

	if (data === undefined || data.type === undefined) {
		return;
	}

	var grid = null;
	switch (data.type) {
		case "tile": {
			grid = tileGrid;
			break;
		} case "hex": {
			grid = hexGrid;
			break;
		} default: {
			return;
		}
	}

	var coordinates = grid.getGridIndexFormPixelLocation({ px: clickX, py: clickY });
	grid.addItem(coordinates, "n", menuItems[data.menuId], { id: data.menuId });
	drawCanvas();
}

function getMousePosition(evt) {
	evt = evt || window.event;
	var x = evt.pageX - canvasElement.offset().left;
	var	y = evt.pageY - canvasElement.offset().top;

	if (x > 0 && y > 0 && x <= canvasElement.width() && y <= canvasElement.height()) {
		hilightSelectedGridPosition({ px: x, py: y });
	}
}

$(function () {
	document.ondragover = getMousePosition;
});
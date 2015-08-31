var trackingData = { grid: null, hilightItem: null };

function menuItemBeginDrag(ev) {
	var data = $(ev.currentTarget).data("drag-data");
	ev.dataTransfer.setData("Text", data);

	if (selectedItem != null) {
		selectedItem.state = window.gridItemState.normal;
		selectedItem = null;
		drawCanvas();
	}

	var menuId = $(ev.currentTarget).attr("id");
	if (window.menuItems[menuId].quantity < 1) {
		return false;
	}

	var drawPattern = window.menuItems[menuId].item.drawPath;
	var hilightPath = [];

	for (var i = 0; i < drawPattern.length; i++) {
		var step = drawPattern[i];
		hilightPath[i] = { move: step.move, draw: step.draw };

		if (step.draw !== undefined) {
			hilightPath[i].draw = window.drawFuncs.hilightHex;
		}
	}

	trackingData.hilightDrawableItem = window.drawableFactory.newDrawableMultiple("hilight", hilightPath);

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

	if (data === undefined || data.type === undefined || menuItems[data.menuId].quantity < 1) {
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

	menuItems[data.menuId].adjustQuantity(-1);

	var coordinates = grid.getGridIndexFormPixelLocation({ px: clickX, py: clickY });
	grid.addItem(coordinates, "n", menuItems[data.menuId].item, { id: data.menuId });
	console.log(menuItems[data.menuId].item);
	if (document.getElementById("autoSelectItem").checked) {
		var selectableItemCoOrdinates = coordinates
		var itemDrawPath = menuItems[data.menuId].item.drawPath;

		for (var itemDrawIndex = 0; itemDrawIndex < itemDrawPath.length; itemDrawIndex = itemDrawIndex + 1) {
			if (itemDrawPath[itemDrawIndex].move != undefined || itemDrawPath[itemDrawIndex].draw == undefined) {
				selectableItemCoOrdinates = window.gridCompas.getNeghbouringGridIndex(selectableItemCoOrdinates, itemDrawPath[itemDrawIndex].move);
			}
			else {
				break;
			}
		}

		var item = grid.getItemAt(selectableItemCoOrdinates);
		item.state = window.gridItemState.selected;
		selectedItem = item;

		document.getElementById("canvas").focus();
	}

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
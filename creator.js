var hexGrid = null;
var tileGrid = null;
var canvasElement = null;
var selectedItem = null;

function drawCanvas() {
	var context = getContextFromJquery(canvasElement);

	context.clearRect(0, 0, canvasElement.width(), canvasElement.height());
	tileGrid.draw(context);
	hexGrid.draw(context);
};

function hilightSelectedGridPosition(position) {		
	var coordinates = trackingData.grid.getGridIndexFormPixelLocation({ px: position.px, py: position.py });

	if (trackingData.hilightItem != null && gridEquals(trackingData.hilightItem.positioning.startIndex, coordinates)) {
		if (coordinates.gx > trackingData.grid.getSize().sx || coordinates.gx < 0 || coordinates.gy > trackingData.grid.getSize().sy || coordinates.gy < 0) {
			trackingData.grid.removeItem(trackingData.hilightItem);
			drawCanvas();
		}

		return;
	}

	trackingData.grid.removeItem(trackingData.hilightItem);
	trackingData.hilightItem = trackingData.grid.addItem(coordinates, "n", trackingData.hilightDrawableItem, { id: "hilight" });
	drawCanvas();
}

function canvasClick(e) {
	var pos = { px: e.pageX - canvasElement.offset().left, py: e.pageY - canvasElement.offset().top };
	var hex = hexGrid.getItemAt(hexGrid.getGridIndexFormPixelLocation(pos));
	var tile = tileGrid.getItemAt(tileGrid.getGridIndexFormPixelLocation(pos));

	var item = null;
	if (hex != null) {
		item = hex;
	} else if (tile != null) {
		item = tile;
	}

	if (selectedItem != null) {
		selectedItem.state = window.gridItemState.normal;
		selectedItem = null;

		if (item == null) {
			drawCanvas();
			return;
		}
	}

	if (item == null) {
		return;
	}

	item.state = window.gridItemState.selected;
	selectedItem = item;
	drawCanvas();
}

function downloadMapLinkClick(ev) {
	this.href = canvasElement[0].toDataURL('image/png');
}

function rotateItemLink(ev) {
	if (selectedItem == null) {
		return;
	}

	hexGrid.rotateItem(selectedItem);
	tileGrid.rotateItem(selectedItem);
	drawCanvas();
}

function removeItemLink(ev) {
	if (selectedItem == null) {
		return;
	}

	hexGrid.removeItem(selectedItem);
	tileGrid.removeItem(selectedItem);
	selectedItem = null;
	drawCanvas();
}

function gridEquals(indexOne, indexTwo) {
	if (indexOne === undefined || indexTwo === undefined || indexOne == null || indexTwo == null) {
		return false;
	}

	return (indexOne.gx == indexTwo.gx && indexOne.gy == indexTwo.gy);
}

function permitDropping(ev) {
	ev.preventDefault();
}

function newGridIndex(x, y) {
	return { gx: x, gy: y };
}

function getContextFromJquery(element) {
	return element[0].getContext("2d");
}

function initGrids() {
	canvasElement = $("#canvas");
	hexGrid = window.newGrid(16, { sx: 38, sy: 27 });
	tileGrid = window.newGrid(hexGrid.getScale() * 7, { sx: 4, sy: 4 });
	drawCanvas();
}

function moveItem(gridOffset) {
	if (selectedItem == null) {
		return;
	}

	hexGrid.shiftItem(selectedItem, gridOffset);
	tileGrid.shiftItem(selectedItem, gridOffset);
	drawCanvas();
}

function saveLink() {
	// Deselect selected item so it isn't serialised
	canvasClick({ pageX: 0, pageY: 0 });

	var output = { features: hexGrid.serialise(), tiles: tileGrid.serialise() };
	$("#saveBox").val(JSON.stringify(output));
}

function loadLink() {
	var input = $("#loadBox").val();

	var objInput = null;
	try {
		objInput = JSON.parse(input);
	} catch (error) {
		console.log(error);
		alert("Failed to load. Error: " + error.message);
		return;
	}

	if (objInput.features == undefined) {
		alert("Failed to load: No features found");
		return;
	}

	if (objInput.tiles == undefined) {
		alert("Failed to load: No tiles found");
		return;
	}

	initGrids();
	initMenu();

	for (var t = 0; t < objInput.tiles.length; t++) {
		var tile = objInput.tiles[t];
		var id = "menutile_" + tile.id;
		var menuItem = menuItems[id];
		
		if (menuItems[id] === undefined) {
			continue;
		}

		tileGrid.addItem(tile.position, tile.facing, menuItems[id], { id: id });
	}

	for (var f = 0; f < objInput.features.length; f++) {
		var feature = objInput.features[f];
		var id = "menuhex_" + feature.id;
		var menuItem = menuItems[id];
		
		if (menuItems[id] === undefined) {
			continue;
		}

		hexGrid.addItem(feature.position, feature.facing, menuItems[id], { id: id });
	}

	drawCanvas();
}

$(function () {
	initGrids();

	$("#downloadMapLink").click(downloadMapLinkClick);
	$("#removeItemLink").click(removeItemLink);
	$("#saveMapLink").click(saveLink);
	$("#loadMapLink").click(loadLink);

	$("#moveItemUpLink").click(function () { moveItem({ gx: 0, gy: -1 }); });
	$("#moveItemDownLink").click(function () { moveItem({ gx: 0, gy: 1 }); });
	$("#moveItemLeftLink").click(function () { moveItem({ gx: -1, gy: 0 }); });
	$("#moveItemRightLink").click(function () { moveItem({ gx: 1, gy: 0 }); });
	$("#rotateItemLink").click(rotateItemLink);

	$("#menu").accordion({ heightStyle: "fill", collapsible: true, icons: false });
	initMenu();

	canvasElement.click(canvasClick);
});
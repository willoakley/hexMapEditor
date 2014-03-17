var menuItems = {};
var menuTiles = [
	window.drawableFactory.newDrawableSingle("one", window.drawFuncs.tile)
];
var menuFeatures = [
	window.drawableFactory.newDrawableMultiple("two", [
		{ draw: window.drawFuncs.lightWoods },
		{ move: "s", draw: window.drawFuncs.lightWoods },
		{ move: "s" },
		{ move: "s", draw: window.drawFuncs.lightWoods },
	])
];

function addMenuItem(drawableItem, menuType) {
	var id = "menu" + menuType + "_" + drawableItem.id;
	var menuElementId = "#" + menuType + "Menu";
	var itemGrid = null;

	menuItems[id] = drawableItem;

	if (menuType == "tile") {
		itemGrid = window.newGrid(tileGrid.getScale() / 2, { sx: 1, sy: 1 });
	}
	else {
		itemGrid = window.newGrid(hexGrid.getScale() / 2, { sx: 9, sy: 7 });
	}

	itemGrid.addItem(window.newGridIndex(0, 0), "n", drawableItem, { id: id });

	$("<canvas id=\"" + id + "\"/>")
		.attr("class", "draggable ui-widget-content ui-corner-all menuItem")
		.attr("draggable", "true")
		.attr("ondragstart", "menuItemBeginDrag(event)")
		.attr("ondragend", "menuItemEndDrag(event)")
		.attr("width", "115")
		.attr("height", "100")
		.data("drag-data", JSON.stringify({ menuId: id, type: menuType }))
	.appendTo("<li/>")
	.appendTo($(menuElementId));

	var menuItemContext = getContextFromJquery($("#" + id));
	itemGrid.draw(menuItemContext);
}

function initMenu() {
	$("#hexMenu").html("");
	$("#tileMenu").html("");
	menuItems = {};

	for (var t = 0; t < menuTiles.length; t++) {
		addMenuItem(menuTiles[t], "tile");
	}

	for (var h = 0; h < menuTiles.length; h++) {
		addMenuItem(menuFeatures[h], "hex");
	}
}
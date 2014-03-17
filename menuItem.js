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
	]), //dummy

	window.drawableFactory.newDrawableMultiple("bridge", [
		{ draw: window.drawFuncs.road },
		{ move: "s", draw: window.drawFuncs.water },
		{ draw: window.drawFuncs.road },
		{ move: "s", draw: window.drawFuncs.road },
	]), //x3
	window.drawableFactory.newDrawableSingle("commsTower", window.drawFuncs.heightFourBuilding), //x2
	window.drawableFactory.newDrawableSingle("barrier", window.drawFuncs.barrier), //x20
	window.drawableFactory.newDrawableSingle("bunker", window.drawFuncs.heightZeroBuilding), //x1
	window.drawableFactory.newDrawableSingle("radarStation", window.drawFuncs.heightZeroBuilding), //x1
	window.drawableFactory.newDrawableSingle("lightWoods", window.drawFuncs.lightWoods), //x20
	window.drawableFactory.newDrawableSingle("heavyWoods", window.drawFuncs.heavyWoods), //x10
	window.drawableFactory.newDrawableSingle("road", window.drawFuncs.road), //x12
	window.drawableFactory.newDrawableMultiple("roadDouble", [
		{ draw: window.drawFuncs.road },
		{ move: "s", draw: window.drawFuncs.road },
	]), //x6
	window.drawableFactory.newDrawableMultiple("roadTripple", [
		{ draw: window.drawFuncs.road },
		{ move: "s", draw: window.drawFuncs.road },
		{ move: "s", draw: window.drawFuncs.road },
	]), //x5
	window.drawableFactory.newDrawableSingle("roadCorner", window.drawFuncs.roadCorner), //x6
	window.drawableFactory.newDrawableSingle("roadTJunction", window.drawFuncs.roadTJunction), //x4
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

	for (var h = 0; h < menuFeatures.length; h++) {
		addMenuItem(menuFeatures[h], "hex");
	}
}
var menuItems = {};

function addMenuItem(itemWithQuantity, itemType, menuElementId) {
	var drawableItem = itemWithQuantity.item;
	var id = "menu" + itemType + "_" + drawableItem.id;
	var itemGrid = null;

	menuItems[id] = {
		id: id,
		name: "",
		item: drawableItem,
		quantity: itemWithQuantity.quantity,
		adjustQuantity: function (byAmmount) {
			if (this.quantity < 1 && this.quantity + byAmmount > 0) {
				$("#" + this.id).parent().removeClass("disable");
			}

			if (this.quantity > 0 && this.quantity + byAmmount <= 0) {
				$("#" + this.id).parent().addClass("disable");
			}

			this.quantity += byAmmount;
			$("#"+this.id).parent().find(".quantity").html("x" + this.quantity);
		},
	};

	if (itemType == "tile") {
		itemGrid = window.newGrid(tileGrid.getScale() / 2, { sx: 1, sy: 1 });
	}
	else {
		itemGrid = window.newGrid(hexGrid.getScale() / 2, { sx: 9, sy: 7 });
	}

	itemGrid.addItem(window.newGridIndex(0, 0), "n", drawableItem, { id: id });

	var listItem = $("<li />");
	var container = $("<div />").attr("draggable", "true");
	container.append($("<canvas id=\"" + id + "\"/>")
		.attr("class", "draggable ui-widget-content ui-corner-all menuItem")
		.attr("draggable", "true")
		.attr("ondragstart", "menuItemBeginDrag(event)")
		.attr("ondragend", "menuItemEndDrag(event)")
		.attr("width", "115")
		.attr("height", "100")
		.data("drag-data", JSON.stringify({ menuId: id, type: itemType }))
	);
	container.append($("<span class=\"name\">" + itemWithQuantity.name + "</span>"));
	container.append($("<span class=\"quantity\">x" + itemWithQuantity.quantity + "</span>"));

	$("#" + menuElementId).append(listItem.append(container));

	var menuItemContext = getContextFromJquery($("#" + id));
	itemGrid.draw(menuItemContext);
}

function addMenuItems(itemType, menuElementId, itemCollection) {
	for (var i in itemCollection) {
		addMenuItem(itemCollection[i], itemType, menuElementId);
	}
}

function initMenu() {
	$("#tileMenu").html("");
	$("#hexMenu").html("");
	$("#buildingMenu").html("");
	$("#natrualMenu").html("");
	$("#roadMenu").html("");
	$("#objectivesMenu").html("");
	menuItems = {};

	addMenuItems("tile", "tileMenu", [
		{ quantity: 8, name: "Plain tile", item: window.drawableFactory.newDrawableSingle("tile", window.drawFuncs.tile) },
		{ quantity: 4, name: "Half tile", item: window.drawableFactory.newDrawableSingle("halfTile", window.drawFuncs.halfTile) },
		{ quantity: 1, name: "River tile", item: window.drawableFactory.newDrawableSingle("riverOne", window.drawFuncs.riverOne) },
		{ quantity: 1, name: "River tile", item: window.drawableFactory.newDrawableSingle("riverTwo", window.drawFuncs.riverTwo) },
		{ quantity: 1, name: "River tile", item: window.drawableFactory.newDrawableSingle("riverThree", window.drawFuncs.riverThree) },
		{ quantity: 1, name: "River tile", item: window.drawableFactory.newDrawableSingle("riverFour", window.drawFuncs.riverFour) },
		{ quantity: 1, name: "River tile", item: window.drawableFactory.newDrawableSingle("riverFive", window.drawFuncs.riverFive) },
		{ quantity: 1, name: "River tile", item: window.drawableFactory.newDrawableSingle("riverSix", window.drawFuncs.riverSix) },
	]);

	addMenuItems("hex", "buildingMenu", [
		{ quantity: 2, name: "Gas tank", item: window.drawableFactory.newDrawableMultiple("gasTank", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "ne", draw: window.drawFuncs.heightTwoBuilding }, ]) },
		{ quantity: 1, name: "Barracks", item: window.drawableFactory.newDrawableMultiple("barracks", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, ], window.drawFuncsSatelite.dummy) },
		{ quantity: 1, name: "Tower block", item: window.drawableFactory.newDrawableMultiple("buildingOne", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, ]) },
		{ quantity: 1, name: "Tower block", item: window.drawableFactory.newDrawableMultiple("buildingTwo", [ { draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, ]) },
		{ quantity: 1, name: "Tower block", item: window.drawableFactory.newDrawableMultiple("buildingThree", [ { draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "ne", draw: window.drawFuncs.heightThreeBuilding }, { move: "n", draw: window.drawFuncs.heightThreeBuilding }, ]) },
		{ quantity: 1, name: "Tower block", item: window.drawableFactory.newDrawableMultiple("buildingFour", [ { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "se", draw: window.drawFuncs.heightThreeBuilding }, { move: "n", draw: window.drawFuncs.heightThreeBuilding }, { move: "n", draw: window.drawFuncs.heightThreeBuilding }, { move: "se", draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, ]) },
		{ quantity: 1, name: "Tower block", item: window.drawableFactory.newDrawableMultiple("buildingFive", [ { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "se", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, { move: "se", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, ]) },
		{ quantity: 1, name: "Mech bay", item: window.drawableFactory.newDrawableMultiple("mechBay", [ { draw: window.drawFuncs.heightFourBuilding }, { move: "s", draw: window.drawFuncs.heightFourBuilding }, { move: "s", draw: window.drawFuncs.heightFourBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightFourBuilding }, { move: "se", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, ]) },
		{ quantity: 1, name: "Factory", item: window.drawableFactory.newDrawableMultiple("factoryOne", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "ne", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "ne", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, ]) },
		{ quantity: 1, name: "Factory", item: window.drawableFactory.newDrawableMultiple("factoryTwo", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "ne", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, ]) },
		{ quantity: 1, name: "Missile silo", item: window.drawableFactory.newDrawableMultiple("missileSilo", [ { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "se", draw: window.drawFuncs.heightZeroBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightZeroBuilding }, { move: "n", draw: window.drawFuncs.heightZeroBuilding }, { move: "se", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, ]) },
		{ quantity: 2, name: "Comms tower", item: window.drawableFactory.newDrawableSingle("commsTower", window.drawFuncs.heightFourBuilding) },
		{ quantity: 20, name: "Barrier", item: window.drawableFactory.newDrawableSingle("barrier", window.drawFuncs.barrier) },
		{ quantity: 1, name: "Bunker", item: window.drawableFactory.newDrawableSingle("bunker", window.drawFuncs.heightZeroBuilding) },
		{ quantity: 1, name: "Radar post", item: window.drawableFactory.newDrawableSingle("radarStation", window.drawFuncs.heightZeroBuilding) },
	]);

	addMenuItems("hex", "roadMenu", [
		{ quantity: 12, name: "Road", item: window.drawableFactory.newDrawableSingle("road", window.drawFuncs.road) },
		{ quantity: 6, name: "Double road", item: window.drawableFactory.newDrawableMultiple("roadDouble", [ { draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.road }, ]) },
		{ quantity: 5, name: "Tripple road", item: window.drawableFactory.newDrawableMultiple("roadTripple", [ { draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.road }, ]) },
		{ quantity: 6, name: "Corner", item: window.drawableFactory.newDrawableSingle("roadCorner", window.drawFuncs.roadCorner) },
		{ quantity: 4, name: "T-Junction", item: window.drawableFactory.newDrawableSingle("roadTJunction", window.drawFuncs.roadTJunction) },
		{ quantity: 3, name: "Bridge", item: window.drawableFactory.newDrawableMultiple("bridge", [ { draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.water }, { draw: window.drawFuncs.roadBridge }, { move: "s", draw: window.drawFuncs.road }, ] ) },
	]);

	addMenuItems("hex", "natrualMenu", [
		{ quantity: 20, name: "Light woods", item: window.drawableFactory.newDrawableSingle("lightWoods", window.drawFuncs.lightWoods) },
		{ quantity: 10, name: "Heavy woods", item: window.drawableFactory.newDrawableSingle("heavyWoods", window.drawFuncs.heavyWoods) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillOne", [ { move: "se" }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "se", draw: window.drawFuncs.heightTwoHill }, { move: "sw", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightThreeHill }, { move: "ne", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillTwo", [ { draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "nw", draw: window.drawFuncs.heightTwoHill } ] ) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillThree", [ { move: "se", draw: window.drawFuncs.heightTwoHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightThreeHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillFour", [ { draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillFive", [ { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillSix", [ { draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "sw", draw: window.drawFuncs.heightTwoHill } ] ) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillSeven", [ { draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "se", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, name: "Hill", item: window.drawableFactory.newDrawableMultiple("hillEight", [ { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightThreeHill }, { move: "se", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill } ] ) },
	]);

	addMenuItems("hex", "objectivesMenu", [
		{ quantity: 10, name: "Point A", item: window.drawableFactory.newDrawableSingle("a", window.drawFuncs.a) },
		{ quantity: 10, name: "Point B", item: window.drawableFactory.newDrawableSingle("b", window.drawFuncs.b) },
		{ quantity: 10, name: "Point C", item: window.drawableFactory.newDrawableSingle("c", window.drawFuncs.c) },
		{ quantity: 10, name: "Point D", item: window.drawableFactory.newDrawableSingle("d", window.drawFuncs.d) },
		{ quantity: 10, name: "Bullseye", item: window.drawableFactory.newDrawableSingle("bullseye", window.drawFuncs.bullseye) },
		{ quantity: 10, name: "Flag", item: window.drawableFactory.newDrawableSingle("flag", window.drawFuncs.flag) },
		{ quantity: 10, name: "Lightning bolt", item: window.drawableFactory.newDrawableSingle("bolt", window.drawFuncs.bolt) },
		{ quantity: 10, name: "Comms", item: window.drawableFactory.newDrawableSingle("comms", window.drawFuncs.comms) },
		{ quantity: 10, name: "Vehicle", item: window.drawableFactory.newDrawableSingle("truck", window.drawFuncs.truck) },
		{ quantity: 10, name: "Warning", item: window.drawableFactory.newDrawableSingle("warning", window.drawFuncs.warning) },
		{ quantity: 10, name: "Person", item: window.drawableFactory.newDrawableSingle("person", window.drawFuncs.person) },
		{ quantity: 10, name: "Wrench", item: window.drawableFactory.newDrawableSingle("wrench", window.drawFuncs.wrench) },
	]);
}
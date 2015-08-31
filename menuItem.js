var menuItems = {};

function addMenuItem(itemWithQuantity, itemType, menuElementId) {
	var drawableItem = itemWithQuantity.item;
	var id = "menu" + itemType + "_" + drawableItem.id;
	var itemGrid = null;

	menuItems[id] = {
		id: id,
		name: drawableItem.description,
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
	container.append($("<span class=\"name\">" + drawableItem.description + "</span>"));
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
		{ quantity: 8, item: window.drawableFactory.newDrawableSingle("tile","Plain tile", window.drawFuncs.tile, window.drawFuncsSatelite.plainTile) },
		{ quantity: 4, item: window.drawableFactory.newDrawableSingle("halfTile","Half tile", window.drawFuncs.halfTile) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("riverOne","River tile", window.drawFuncs.riverOne) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("riverTwo","River tile", window.drawFuncs.riverTwo) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("riverThree","River tile", window.drawFuncs.riverThree) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("riverFour","River tile", window.drawFuncs.riverFour) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("riverFive","River tile", window.drawFuncs.riverFive) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("riverSix","River tile", window.drawFuncs.riverSix) },
	]);

	addMenuItems("hex", "buildingMenu", [
		{ quantity: 2, item: window.drawableFactory.newDrawableMultiple("gasTank","Gas tank", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "ne", draw: window.drawFuncs.heightTwoBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("barracks","Barracks", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, ], window.drawFuncsSatelite.barracks) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("buildingOne","Tower block", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("buildingTwo","Tower block", [ { draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("buildingThree","Tower block", [ { draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "ne", draw: window.drawFuncs.heightThreeBuilding }, { move: "n", draw: window.drawFuncs.heightThreeBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("buildingFour","Tower block", [ { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, { move: "se", draw: window.drawFuncs.heightThreeBuilding }, { move: "n", draw: window.drawFuncs.heightThreeBuilding }, { move: "n", draw: window.drawFuncs.heightThreeBuilding }, { move: "se", draw: window.drawFuncs.heightThreeBuilding }, { move: "s", draw: window.drawFuncs.heightThreeBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("buildingFive","Tower block", [ { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "se", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, { move: "se", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, ], window.drawFuncsSatelite.buildingFive) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("mechBay","Mech bay", [ { draw: window.drawFuncs.heightFourBuilding }, { move: "s", draw: window.drawFuncs.heightFourBuilding }, { move: "s", draw: window.drawFuncs.heightFourBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightFourBuilding }, { move: "se", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, { move: "n", draw: window.drawFuncs.heightFourBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("factoryOne","Factory", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "ne", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "ne", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, { move: "s", draw: window.drawFuncs.heightOneBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("factoryTwo","Factory", [ { draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "s", draw: window.drawFuncs.heightTwoBuilding }, { move: "ne", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, { move: "n", draw: window.drawFuncs.heightTwoBuilding }, ]) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("missileSilo","Missile silo", [ { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, { move: "se", draw: window.drawFuncs.heightZeroBuilding }, { move: "n", draw: window.drawFuncs.heightOneBuilding }, { move: "n", draw: window.drawFuncs.heightZeroBuilding }, { move: "n", draw: window.drawFuncs.heightZeroBuilding }, { move: "se", draw: window.drawFuncs.heightZeroBuilding }, { move: "s", draw: window.drawFuncs.heightZeroBuilding }, ]) },
		{ quantity: 2, item: window.drawableFactory.newDrawableSingle("commsTower","Comms tower", window.drawFuncs.heightFourBuilding) },
		{ quantity: 20, item: window.drawableFactory.newDrawableSingle("barrier","Barrier", window.drawFuncs.barrier) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("bunker","Bunker", window.drawFuncs.heightZeroBuilding) },
		{ quantity: 1, item: window.drawableFactory.newDrawableSingle("radarStation","Radar station", window.drawFuncs.heightZeroBuilding, window.drawFuncsSatelite.radarStation) },
	]);

	addMenuItems("hex", "roadMenu", [
		{ quantity: 12, item: window.drawableFactory.newDrawableSingle("road","Road", window.drawFuncs.road) },
		{ quantity: 6, item: window.drawableFactory.newDrawableMultiple("roadDouble","Double road", [ { draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.road }, ]) },
		{ quantity: 5, item: window.drawableFactory.newDrawableMultiple("roadTripple","Tripple road", [ { draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.road }, ]) },
		{ quantity: 6, item: window.drawableFactory.newDrawableSingle("roadCorner","Corner", window.drawFuncs.roadCorner) },
		{ quantity: 4, item: window.drawableFactory.newDrawableSingle("roadTJunction","T-Junction", window.drawFuncs.roadTJunction) },
		{ quantity: 3, item: window.drawableFactory.newDrawableMultiple("bridge","Bridge", [ { draw: window.drawFuncs.road }, { move: "s", draw: window.drawFuncs.water }, { draw: window.drawFuncs.roadBridge }, { move: "s", draw: window.drawFuncs.road }, ] ) },
	]);

	addMenuItems("hex", "natrualMenu", [
		{ quantity: 20, item: window.drawableFactory.newDrawableSingle("lightWoods","Light woods", window.drawFuncs.lightWoods) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("heavyWoods","Heavy woods", window.drawFuncs.heavyWoods) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillOne","Hill", [ { move: "se" }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "se", draw: window.drawFuncs.heightTwoHill }, { move: "sw", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightThreeHill }, { move: "ne", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillTwo","Hill", [ { draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "nw", draw: window.drawFuncs.heightTwoHill } ] ) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillThree","Hill", [ { move: "se", draw: window.drawFuncs.heightTwoHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightThreeHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillFour","Hill", [ { draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillFive","Hill", [ { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillSix","Hill", [ { draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "sw", draw: window.drawFuncs.heightTwoHill } ] ) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillSeven","Hill", [ { draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "se", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightOneHill }, { move: "n", draw: window.drawFuncs.heightOneHill } ] ) },
		{ quantity: 1, item: window.drawableFactory.newDrawableMultiple("hillEight","Hill", [ { move: "se", draw: window.drawFuncs.heightOneHill }, { move: "sw", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "s", draw: window.drawFuncs.heightOneHill }, { move: "ne", draw: window.drawFuncs.heightTwoHill }, { move: "ne", draw: window.drawFuncs.heightThreeHill }, { move: "s", draw: window.drawFuncs.heightThreeHill }, { move: "se", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightTwoHill }, { move: "n", draw: window.drawFuncs.heightOneHill }, { move: "se", draw: window.drawFuncs.heightOneHill } ] ) },
	]);

	addMenuItems("hex", "objectivesMenu", [
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("a","Point A", window.drawFuncs.a) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("b","Point B", window.drawFuncs.b) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("c","Point C", window.drawFuncs.c) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("d","Point D", window.drawFuncs.d) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("bullseye","Bullseye", window.drawFuncs.bullseye) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("flag","Flag", window.drawFuncs.flag) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("bolt","Lightning bolt", window.drawFuncs.bolt) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("comms","Comms", window.drawFuncs.comms) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("truck","Vehicle", window.drawFuncs.truck) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("warning","Warning", window.drawFuncs.warning) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("person","Person", window.drawFuncs.person) },
		{ quantity: 10, item: window.drawableFactory.newDrawableSingle("wrench","Wrench", window.drawFuncs.wrench) },
	]);
}
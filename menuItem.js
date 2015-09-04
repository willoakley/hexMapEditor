var menuItems = {};

function addMenuItem(itemWithQuantity, itemType, menuElementId) {
	var drawableItem = window.drawableFactory.newDrawableFromJson(itemWithQuantity.item);
	var id = "menu" + itemType + "_" + drawableItem.id;
	var itemGrid = null;

	if (itemType == "tile") {
		itemGrid = window.newGrid(tileGrid.getScale() / 2.1, { sx: 1, sy: 1 });
	}
	else {
		itemGrid = window.newGrid(hexGrid.getScale() / 2, { sx: 9, sy: 7 });
	}

	itemGrid.addItem(window.newGridIndex(0, 0), "n", drawableItem);

	menuItems[id] = {
		id: id,
		name: drawableItem.description,
		item: drawableItem,
		quantity: itemWithQuantity.quantity,
		itemGrid: itemGrid,
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
		draw: function(mapContext) {
			var context = getContextFromJquery($("#" + this.id));
			context.clearRect(0, 0, canvasElement.width(), canvasElement.height());
			this.itemGrid.draw(context, mapContext);
		},
	};

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

	menuItems[id].draw(getCanvasMode());
}

function redrawMenuItems(mapContext) {
	for (var id in menuItems) {
		menuItems[id].draw(mapContext);
	}
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
		{ quantity: 8, item: '{ "id":"tile", "description": "Plain tile", "drawPath": "tile" }' },
		{ quantity: 4, item: '{ "id":"halfTile", "description": "Half tile", "drawPath": "halfTile" }' },
		{ quantity: 1, item: '{ "id":"riverOne", "description": "River tile", "drawPath": "riverOne" }' },
		{ quantity: 1, item: '{ "id":"riverTwo", "description": "River tile", "drawPath": "riverTwo" }' },
		{ quantity: 1, item: '{ "id":"riverThree", "description": "River tile", "drawPath": "riverThree" }' },
		{ quantity: 1, item: '{ "id":"riverFour", "description": "River tile", "drawPath": "riverFour" }' },
		{ quantity: 1, item: '{ "id":"riverFive", "description": "River tile", "drawPath": "riverFive" }' },
		{ quantity: 1, item: '{ "id":"riverSix", "description": "River tile", "drawPath": "riverSix"} ' },
	]);

	addMenuItems("hex", "objectivesMenu", [
		{ quantity: 10, item: '{ "id":"a", "description": "Point A", "drawPath": "a" }' },
		{ quantity: 10, item: '{ "id":"b", "description": "Point B", "drawPath": "b" }' },
		{ quantity: 10, item: '{ "id":"c", "description": "Point C", "drawPath": "c" }' },
		{ quantity: 10, item: '{ "id":"d", "description": "Point D", "drawPath": "d" }' },
		{ quantity: 10, item: '{ "id":"bullseye", "description": "Bullseye", "drawPath": "bullseye" }' },
		{ quantity: 10, item: '{ "id":"flag", "description": "Flag", "drawPath": "flag" }' },
		{ quantity: 10, item: '{ "id":"bolt", "description": "Lightning bolt", "drawPath": "bolt" }' },
		{ quantity: 10, item: '{ "id":"comms", "description": "Comms", "drawPath": "comms" }' },
		{ quantity: 10, item: '{ "id":"truck", "description": "Vehicle", "drawPath": "truck" }' },
		{ quantity: 10, item: '{ "id":"warning", "description": "Warning", "drawPath": "warning" }' },
		{ quantity: 10, item: '{ "id":"person", "description": "Person", "drawPath": "person" }' },
		{ quantity: 10, item: '{ "id":"wrench", "description": "Wrench", "drawPath": "wrench" }' },
	]);

	addMenuItems("hex", "natrualMenu", [
		{ quantity: 20, item: '{ "id":"lightWoods", "description": "Light woods", "drawPath": "lightWoods" }' },
		{ quantity: 10, item: '{ "id":"heavyWoods", "description": "Heavy woods", "drawPath": "heavyWoods" }' },
		{ quantity: 1, item: '{ "id":"hillOne", "description": "Hill", "drawPath": "se:heightOneHill,s:heightOneHill,sw:heightOneHill,s:heightOneHill,se:heightOneHill,n:heightOneHill,ne:heightTwoHill,se:heightTwoHill,sw:heightTwoHill,s:heightThreeHill,ne:heightThreeHill,s:heightTwoHill,s:heightOneHill,s:heightOneHill,ne:heightOneHill,n:heightOneHill,n:heightOneHill,se:heightOneHill" }' },
		{ quantity: 1, item: '{ "id":"hillTwo", "description": "Hill", "drawPath": "heightOneHill,s:heightOneHill,s:heightOneHill,ne:heightOneHill,se:heightOneHill,s:heightOneHill,nw:heightTwoHill" }' },
		{ quantity: 1, item: '{ "id":"hillThree", "description": "Hill", "drawPath": "se:heightTwoHill,sw:heightOneHill,s:heightOneHill,ne:heightThreeHill,s:heightThreeHill,ne:heightTwoHill,s:heightOneHill,ne:heightOneHill" }' },
		{ quantity: 1, item: '{ "id":"hillFour", "description": "Hill", "drawPath": "heightTwoHill,s:heightTwoHill,s:heightOneHill,se:heightOneHill,n:heightTwoHill,ne:heightOneHill" }' },
		{ quantity: 1, item: '{ "id":"hillFive", "description": "Hill", "drawPath": "s:heightTwoHill,s:heightTwoHill,ne:heightTwoHill,n:heightOneHill,se:heightOneHill,s:heightOneHill,sw:heightOneHill" }' },
		{ quantity: 1, item: '{ "id":"hillSix", "description": "Hill", "drawPath": "heightOneHill,s:heightOneHill,ne:heightOneHill,se:heightOneHill,s:heightOneHill,sw:heightOneHill,n:heightTwoHill,sw:heightTwoHill" }' },
		{ quantity: 1, item: '{ "id":"hillSeven", "description": "Hill", "drawPath": "heightOneHill,s:heightTwoHill,s:heightOneHill,ne:heightTwoHill,n:heightTwoHill,se:heightThreeHill,s:heightTwoHill,ne:heightOneHill,n:heightOneHill" }' },
		{ quantity: 1, item: '{ "id":"hillEight", "description": "Hill", "drawPath": "se:heightOneHill,sw:heightOneHill,s:heightOneHill,s:heightOneHill,ne:heightTwoHill,ne:heightThreeHill,s:heightThreeHill,se:heightTwoHill,n:heightTwoHill,n:heightOneHill,se:heightOneHill" }' },
	]);

	addMenuItems("hex", "roadMenu", [
		{ quantity: 12, item:'{ "id":"road", "description": "Road", "drawPath": "road" }' },
		{ quantity: 6, item: '{ "id":"roadDouble", "description": "Double road", "drawPath": "road,s:road" }' },
		{ quantity: 5, item: '{ "id":"roadTripple", "description": "Tripple road", "drawPath": "road,s:road,s:road" }' },
		{ quantity: 6, item: '{ "id":"roadCorner", "description": "Corner", "drawPath": "roadCorner" }' },
		{ quantity: 4, item: '{ "id":"roadTJunction", "description": "T-Junction", "drawPath": "roadTJunction" }' },
		{ quantity: 3, item: '{ "id":"bridge", "description": "Bridge", "drawPath": "road,s:water,roadBridge,s:road" }' },
	]);

	addMenuItems("hex", "buildingMenu", [
		{ quantity: 2, item: '{ "id": "gasTank", "description": "Gas tank", "drawPath": "heightTwoBuilding,s:heightTwoBuilding,ne:heightTwoBuilding" }' },
		{ quantity: 1, item: '{ "id": "barracks", "description": "Barracks", "drawPath": "heightTwoBuilding,s:heightTwoBuilding" }' },
		{ quantity: 1, item: '{ "id": "buildingOne", "description": "Tower block", "drawPath": "heightTwoBuilding,s:heightTwoBuilding" }' },
		{ quantity: 1, item: '{ "id": "buildingTwo", "description": "Tower block", "drawPath": "heightThreeBuilding,s:heightThreeBuilding" }' },
		{ quantity: 1, item: '{ "id": "buildingThree", "description": "Tower block", "drawPath": "heightThreeBuilding,s:heightThreeBuilding,s:heightThreeBuilding,ne:heightThreeBuilding,n:heightThreeBuilding" }' },
		{ quantity: 1, item: '{ "id": "buildingFour", "description": "Tower block", "drawPath": "s:heightThreeBuilding,s:heightThreeBuilding,se:heightThreeBuilding,n:heightThreeBuilding,n:heightThreeBuilding,se:heightThreeBuilding,s:heightThreeBuilding" }' },
		{ quantity: 1, item: '{ "id": "buildingFive", "description": "Tower block", "drawPath": "s:heightTwoBuilding,s:heightTwoBuilding,se:heightTwoBuilding,n:heightTwoBuilding,n:heightTwoBuilding,se:heightTwoBuilding,s:heightTwoBuilding" }' },
		{ quantity: 1, item: '{ "id": "mechBay", "description": "Mech bay", "drawPath": "heightFourBuilding,s:heightFourBuilding,s:heightFourBuilding,s:heightZeroBuilding,s:heightFourBuilding,se:heightFourBuilding,n:heightFourBuilding,n:heightFourBuilding,n:heightFourBuilding,n:heightFourBuilding" }' },
		{ quantity: 1, item: '{ "id": "factoryOne", "description": "Factory", "drawPath": "heightTwoBuilding,s:heightTwoBuilding,s:heightTwoBuilding,s:heightTwoBuilding,s:heightTwoBuilding,ne:heightOneBuilding,n:heightOneBuilding,n:heightOneBuilding,n:heightOneBuilding,ne:heightOneBuilding,s:heightOneBuilding,s:heightOneBuilding,s:heightOneBuilding,s:heightOneBuilding" }' },
		{ quantity: 1, item: '{ "id": "factoryTwo", "description": "Factory", "drawPath": "heightTwoBuilding,s:heightTwoBuilding,s:heightTwoBuilding,s:heightTwoBuilding,ne:heightTwoBuilding,n:heightTwoBuilding,n:heightTwoBuilding" }' },
		{ quantity: 1, item: '{ "id": "missileSilo", "description": "Missile silo", "drawPath": "s:heightZeroBuilding,s:heightZeroBuilding,s:heightZeroBuilding,se:heightZeroBuilding,n:heightOneBuilding,n:heightZeroBuilding,n:heightZeroBuilding,se:heightZeroBuilding,s:heightZeroBuilding" }' },
		{ quantity: 2, item: '{ "id": "commsTower", "description": "Comms tower", "drawPath": "heightFourBuilding" }' },
		{ quantity: 20,item: '{ "id": "barrier", "description": "Barrier", "drawPath": "barrier" }' },
		{ quantity: 1, item: '{ "id": "bunker", "description": "Bunker", "drawPath": "heightZeroBuilding" }' },
		{ quantity: 1, item: '{ "id": "radarStation", "description": "Radar station", "drawPath": "heightZeroBuilding" }' },
	]);
}
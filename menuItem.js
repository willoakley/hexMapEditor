var menuItems = {};

function initMenu() {
	$("#hexMenu").html("");
	$("#tileMenu").html("");
	menuItems = {};

	addMenuItem(window.drawableFactory.newDrawableSingle("one", window.drawFuncs.tile), "tile");

	addMenuItem(window.drawableFactory.newDrawableMultiple("two", [
		{ draw: window.drawFuncs.lightWoods },
		{ move: "s", draw: window.drawFuncs.lightWoods },
		{ move: "s" },
		{ move: "s", draw: window.drawFuncs.lightWoods },
	]),"hex");
}
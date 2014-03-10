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
};
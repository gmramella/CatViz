/*
Listener that runs when focus is lost
*/
window.addEventListener("blur", function(e) {
	if (!view) alert(STR_VIEW_CLASS_MISSING_PLEASE_REFRESH_THE_PAGE);
	view.createBlurRectangle();
	focused = false;
	
	if (keyboardMouseStatus !== "menu open" && keyboardMouseStatus !== "input open" && keyboardMouseStatus !== "tsv open") {
		if (keyboardMouseStatus === "object update") {
			keyboardMouseStatus = "idle";
			// console.log("idle");
			view.deselectCircle(listOfObjectsPressed[0]);
			listOfObjectsPressed[0].setSelected(false);
		} else if (keyboardMouseStatus === "endomorphism update") {
			keyboardMouseStatus = "idle";
			// console.log("idle");
			view.deselectEndomorphism(listOfMorphismsPressed[0]);
			listOfMorphismsPressed[0].setSelected(false);
		} else if (keyboardMouseStatus === "morphism update") {
			keyboardMouseStatus = "idle";
			// console.log("idle");
			view.deselectBezier(listOfMorphismsPressed[0]);
			listOfMorphismsPressed[0].setSelected(false);
		} else if (selectedElements.length === 0) {
			keyboardMouseStatus = "idle";
			// console.log("idle");
		} else if (selectedElements.length > 0) {
			keyboardMouseStatus = "idle with element(s) selected";
			// console.log("idle with element(s) selected");
		}
	} else if (keyboardMouseStatus === "menu open") {
		$(document).click();
	} else if (keyboardMouseStatus === "input open") {
		if (selectedElements.length === 0) {
			keyboardMouseStatus = "idle";
			// console.log("idle");
		} else if (selectedElements.length > 0) {
			keyboardMouseStatus = "idle with element(s) selected";
			// console.log("idle with element(s) selected");
		}
		$("#objectInput").hide();
		$("#morphismInput").hide();
	} else if (keyboardMouseStatus === "tsv open") {
		if (selectedElements.length === 0) {
			keyboardMouseStatus = "idle";
			// console.log("idle");
		} else if (selectedElements.length > 0) {
			keyboardMouseStatus = "idle with element(s) selected";
			// console.log("idle with element(s) selected");
		}
		files.closeTSVInputDialog();
	}
	
	leftMousedownOnCanvas = false;
	leftMousedownOnMultiple = false;
	leftMousedownOnObject = false;
	leftMousedownOnMorphism = false;
	
	rightMousedownOnCanvas = false;
	rightMousedownOnMultiple = false;
	rightMousedownOnObject = false;
	rightMousedownOnMorphism = false;
	
	if (selectionRectanglePtr) {
		console.log("sim");
		view.deleteSelectionRectangle();
		selectionRectanglePtr = null;
	}
});

/*
Listener that runs when focus is regained
*/
window.addEventListener("focus", function(e) {
	if (!view) alert(STR_VIEW_CLASS_MISSING_PLEASE_REFRESH_THE_PAGE);
	view.removeBlurRectangle();
	focused = true;
});
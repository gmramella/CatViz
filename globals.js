/*
Attributes used throughout the application
*/

var objectsCounter = 0;
var objects = [];
var objectLabels = [];
function getObjectById(id) {
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].getId() === id) {
			return objects[i];
		}
	}
	return null;
}
function getObjectLabelById(id) {
	var count = 0;
	var found = false;
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].getId() === id) {
			found = true;
			break;
		}
		count++;
	}
	if (found) {
		return objectLabels[count];
	}
	return null;
}
function removeObjectById(id) {
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].getId() === id) {
			objects.splice(i, 1);
			break;
		}
	}
}
function removeObjectLabelById(id) {
	for (var i = 0; i < objectLabels.length; i++) {
		if (objectLabels[i][0] === id) {
			objectLabels.splice(i, 1);
			break;
		}
	}
}
/*
0		A
25		Z
26		AA
51		AZ
52		BA
77		BZ
676		AAA
701		AAZ
702		ABA
727		ABZ
1326	AZA
1351	AZZ
1352	BAA
...
*/
function currentObjectLabel() {
	if (objectsCounter < 26 - 1) {
		return String.fromCharCode('A'.charCodeAt(0) + objectsCounter % 26);
	} else {
		var labelLength = 1;
		while (Math.pow(26, labelLength) <= objectsCounter) {
			labelLength++;
		}
		var str = "";
		for (var i = 0; i < labelLength - 1; i++) {
			str += String.fromCharCode('A'.charCodeAt(0) + Math.floor(objectsCounter / 26) - 1)
		}
		str += String.fromCharCode('A'.charCodeAt(0) + objectsCounter % 26);
		return str;
	}
}

var morphismsCounter = 0;
var morphisms = [];
var morphismLabels = [];
function getMorphismById(id) {
	for (var i = 0; i < morphisms.length; i++) {
		if (morphisms[i].getId() === id) {
			return morphisms[i];
		}
	}
	return null;
}
function getMorphismLabelById(id) {
	var count = 0;
	var found = false;
	for (var i = 0; i < morphisms.length; i++) {
		if (morphisms[i].getId() === id) {
			found = true;
			break;
		}
		count++;
	}
	if (found) {
		return morphismLabels[count];
	}
	return null;
}
function removeMorphismById(id) {
	for (var i = 0; i < morphisms.length; i++) {
		if (morphisms[i].getId() === id) {
			morphisms.splice(i, 1);
			break;
		}
	}
}
function removeMorphismLabelById(id) {
	for (var i = 0; i < morphismLabels.length; i++) {
		if (morphismLabels[i][0] === id) {
			morphismLabels.splice(i, 1);
			break;
		}
	}
}
/*
0	f
20	z
21	aa
46	az
47	ba
72	bz
671	za
696	zz
...
*/
function currentMorphismLabel() {
	if ((morphismsCounter - objectsCounter) <= 21 - 1) {
		return String.fromCharCode('f'.charCodeAt(0) + (morphismsCounter - objectsCounter) % 22);
	} else if (21 - 1 < (morphismsCounter - objectsCounter) && (morphismsCounter - objectsCounter) <= 21 + 26 - 1) {
		var str = "";
		str += String.fromCharCode('a'.charCodeAt(0) + Math.floor((morphismsCounter - objectsCounter - 21) / 26));
		str += String.fromCharCode('a'.charCodeAt(0) + (morphismsCounter - objectsCounter - 21) % 26);
		return str;
	} else {
		var labelLength = 1;
		while (Math.pow(26, labelLength) <= (morphismsCounter - objectsCounter - 21)) {
			labelLength++;
		}
		var str = "";
		for (var i = 0; i < labelLength - 1; i++) {
			str += String.fromCharCode('a'.charCodeAt(0) + Math.floor((morphismsCounter - objectsCounter - 21) / 26));
		}
		str += String.fromCharCode('a'.charCodeAt(0) + (morphismsCounter - objectsCounter - 21) % 26);
		return str;
	}
}
function getMorphismLabelById(id) {
	for (var i = 0; i < morphisms.length; i++) {
		if (morphisms[i].getId() === id) {
			return morphisms[i].getLabel();
		}
	}
	return null;
}
function getMorphismsBySource(source) {
	var list = [];
	for (var i = 0; i < morphisms.length; i++) {
		if (morphisms[i].getSource() === source) {
			list.push(morphisms[i]);
		}
	}
	return list;
}
function getMorphismsBySourceOrTarget(source, target) {
	var list = [];
	for (var i = 0; i < morphisms.length; i++) {
		if ((morphisms[i].getSource() === source && morphisms[i].getTarget() === target) || (morphisms[i].getSource() === target && morphisms[i].getTarget() === source)) {
			list.push(morphisms[i]);
		}
	}
	return list;
}

var altPressed = false;
var altReleased = false;

var ctrlPressed = false;
var ctrlReleased = false;

var shiftPressed = false;
var shiftReleased = false;

var tabPressed = false;
var tabReleased = false;

var altPressed = false;
var altReleased = false;

var capsOn = false;

var view = null;

var focused = true;

var mousedownCoords = null;

var mousemoveCoords = null;
var mousemoveDeltas = [];

var mouseupCoords = null;

var collider = null;

var menu = null;

var selectedElements = [];
function selectAll() {
	if (selectedElements.length < objects.length + morphisms.length) {
		selectedElements = [];
		for (var i = 0; i < objects.length; i++) {
			selectedElements.push({type: "object", element: objects[i]});
			view.selectCircle(objects[i]);
			objects[i].setSelected(true);
		}
		for (var i = 0; i < morphisms.length; i++) {
			var id = morphisms[i].getId();
			if (morphisms[i].getType() !== "endomorphism") {
				selectedElements.push({type: "morphism", element: morphisms[i]});
				view.selectBezier(morphisms[i]);
				morphisms[i].setSelected(true);
			} else {
				selectedElements.push({type: "endomorphism", element: morphisms[i]});
				view.selectEndomorphism(morphisms[i]);
				morphisms[i].setSelected(true);
			}
		}
	}
}
function deselectAll() {
	if (selectedElements.length > 0) {
		for (var i = 0; i < selectedElements.length; i++) {
			switch (selectedElements[i].type) {
				case "object":
					view.deselectCircle(selectedElements[i].element);
					selectedElements[i].element.setSelected(false);
					break;
				case "morphism":
					view.deselectBezier(selectedElements[i].element);
					selectedElements[i].element.setSelected(false);
					break;
				case "endomorphism":
					view.deselectEndomorphism(selectedElements[i].element);
					selectedElements[i].element.setSelected(false);
					break;
			}
		}
		selectedElements = [];
	}
}
function selectObjects() {
	if (selectedElements.length < objects.length + morphisms.length) {
		selectedElements = [];
		for (var i = 0; i < objects.length; i++) {
			selectedElements.push({type: "object", element: objects[i]});
			view.selectCircle(objects[i]);
			objects[i].setSelected(true);
			var idEndomorphism = objects[i].getEndomorphism(0);
			selectedElements.push({type: "endomorphism", element: idEndomorphism});
			view.selectEndomorphism(idEndomorphism);
			idEndomorphism.setSelected(true);
		}
	}
}
function selectMorphisms() {
	if (selectedElements.length < objects.length + morphisms.length) {
		selectedElements = [];
		for (var i = 0; i < morphisms.length; i++) {
			var id = morphisms[i].getId();
			if (morphisms[i].getType() !== "endomorphism") {
				selectedElements.push({type: "morphism", element: morphisms[i]});
				view.selectBezier(morphisms[i]);
				morphisms[i].setSelected(true);
			}
		}
	}
}
function selectEndomorphisms() {
	if (selectedElements.length < objects.length + morphisms.length) {
		selectedElements = [];
		for (var i = 0; i < morphisms.length; i++) {
			var id = morphisms[i].getId();
			if (morphisms[i].getType() === "endomorphism") {
				selectedElements.push({type: "endomorphism", element: morphisms[i]});
				view.selectEndomorphism(morphisms[i]);
				morphisms[i].setSelected(true);
			}
		}
	}
}
function hideSelectedElements() {
	hiddenElements = selectedElements.slice();
	for (var i = 0; i < hiddenElements.length; i++) {
		if (hiddenElements[i].type === "object") {
			view.hideCircle(hiddenElements[i].element);
			hiddenElements[i].element.setVisible(false);
			var endomorphisms = hiddenElements[i].element.getEndomorphisms();
			for (var j = 1; j < endomorphisms.length; j++) {
				view.hideEndomorphism(endomorphisms[j]);
				endomorphisms[j].setVisible(false);
				hiddenElements.push({type: "endomorphism", element: endomorphisms[j]});
			}
			var morphisms = hiddenElements[i].element.getMorphisms();
			for (var j = 0; j < morphisms.length; j++) {
				view.hideBezier(morphisms[j]);
				morphisms[j].setVisible(false);
				hiddenElements.push({type: "morphism", element: morphisms[j]});
			}
		} else if (hiddenElements[i].type !== "endomorphism") {
			view.hideBezier(hiddenElements[i].element);
			hiddenElements[i].element.setVisible(false);
		} else if (hiddenElements[i].type === "endomorphism") {
			if (!hiddenElements[i].element.getIsIdEndomorphism() || !getObjectById(hiddenElements[i].element.getSource()).getVisible()) {
				view.hideEndomorphism(hiddenElements[i].element);
				hiddenElements[i].element.setVisible(false);
			} else {
				alert(STR_CANNOT_DELETE_ID_ENDOMORPHISM_WITHOUT_DELETING_ITS_OBJECT_ALSO);
				view.deselectEndomorphism(hiddenElements[i].element);
			}
		}
	}
}

function dragSelected(mousemoveDeltas) {
	if (selectedElements.length > 0) {
		var selectedObjects = [];
		for (var i = 0; i < selectedElements.length; i++) {
			if (selectedElements[i].type === "object") {
				selectedObjects.push(selectedElements[i].element);
			}
		}
		for (var i = 0; i < selectedObjects.length; i++) {
			var object = selectedObjects[i];
			var objectPreviousPosition = object.getPosition();
			var coordsX = mousemoveCoords[0] + mousemoveDeltas[i][0];
			var coordsY = mousemoveCoords[1] + mousemoveDeltas[i][1];
			if (coordsX < 2 * SELECTED_CIRCLE_RADIUS + SELECTED_HANDLE_RADIUS) coordsX = 2 * SELECTED_CIRCLE_RADIUS + SELECTED_HANDLE_RADIUS;
			if (coordsY < 2 * SELECTED_CIRCLE_RADIUS + SELECTED_HANDLE_RADIUS) coordsY = 2 * SELECTED_CIRCLE_RADIUS + SELECTED_HANDLE_RADIUS;
			if (coordsX > view.canvasWidth - 2 * SELECTED_CIRCLE_RADIUS - SELECTED_HANDLE_RADIUS) coordsX = view.canvasWidth - 2 * SELECTED_CIRCLE_RADIUS - SELECTED_HANDLE_RADIUS;
			if (coordsY > view.canvasHeight - 2 * SELECTED_CIRCLE_RADIUS - SELECTED_HANDLE_RADIUS) coordsY = view.canvasHeight - 2 * SELECTED_CIRCLE_RADIUS - SELECTED_HANDLE_RADIUS;
			view.updateCircle(object, [coordsX, coordsY]);
			view.updateCircleLabel(object, [coordsX, coordsY]);
			object.setPosition([coordsX, coordsY]);
			view.selectCircle(object, [coordsX, coordsY]);
			
			var objectMorphisms = object.getMorphisms();
			var counterSource = 0;
			var counterTarget = 0;
			for (var j = 0; j < objectMorphisms.length; j++) {
				var source = getObjectById(objectMorphisms[j].getSource());
				var target = getObjectById(objectMorphisms[j].getTarget());
				var ptr = view.translateBezier(objectMorphisms[j]);
				view.translateBezierLabel(objectMorphisms[j]);
				for (var k = 0; k < objectMorphisms.length; k++) {
					if (objectMorphisms[k] === objectMorphisms[j]) {
						var m = [0.5 * (source.getX() + target.getX()), 0.5 * (source.getY() + target.getY())];
						var realAngleBetweenObjects = Math.realAngle(source.getPosition(), target.getPosition());
						var sign = Math.pow(-1, source.getId() > target.getId());
						var r = [m[0] - 2 * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
						var r = [m[0] - 2 * sign * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
						var ptr = view.updateBezier(objectMorphisms[k], r);
						view.updateBezierLabel(objectMorphisms[k], r);
						objectMorphisms[k].setPoints([ptr.p0, ptr.p1, ptr.p2]);
						objectMorphisms[k].setCurvePath(ptr.curve.attr("d"));
						objectMorphisms[k].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
						counterSource++;
						break;
					}
				}
			}
			var objectEndomorphisms = object.getEndomorphisms();
			for (var j = 0; j < objectEndomorphisms.length; j++) {
				view.translateEndomorphism(objectEndomorphisms[j], mousemoveCoords, objectPreviousPosition);
				view.translateEndomorphismLabel(objectEndomorphisms[j]);
			}
		}
	}
}

function copySelected() {
	// removeHiddenElements();
	copiedElements = [];
	for (var i = 0; i < selectedElements.length; i++) {
		if (selectedElements[i].type !== "endomorphism") {
			copiedElements.push(selectedElements[i]);
		} else if (selectedElements[i].type === "endomorphism" && !selectedElements[i].element.getIsIdEndomorphism()) {
			copiedElements.push(selectedElements[i]);
		} else if (selectedElements[i].type === "endomorphism" && selectedElements[i].element.getIsIdEndomorphism()) {
			var objectId = selectedElements[i].element.getSource();
			for (var j = 0; j < selectedElements.length; j++) {
				if (selectedElements[j].type === "object" && selectedElements[j].element.getId() === objectId) {
					copiedElements.push(selectedElements[i]);
					break
				}
			}
		}
	}
	pasteCounter = 0;
	deselectAll();
}

function cutSelected() {
	copiedElements = [];
	for (var i = 0; i < selectedElements.length; i++) {
		if (selectedElements[i].type !== "endomorphism") {
			copiedElements.push(selectedElements[i]);
		} else if (selectedElements[i].type === "endomorphism" && !selectedElements[i].element.getIsIdEndomorphism()) {
			copiedElements.push(selectedElements[i]);
		} else if (selectedElements[i].type === "endomorphism" && selectedElements[i].element.getIsIdEndomorphism()) {
			//only copy if its object is also copied
			var objectId = selectedElements[i].element.getSource();
			for (var j = 0; j < selectedElements.length; j++) {
				if (selectedElements[j].type === "object" && selectedElements[j].element.getId() === objectId) {
					copiedElements.push(selectedElements[i]);
					break
				}
			}
		}
	}
	hideSelectedElements();
	selectedElements = [];
}

//Mouse global variables
var startTimes = [null, null];
var endTimes = [null, null];
var starts = [new Date(), new Date()];
var doubleClick = false;
var counter = 0;

var draggingAllowed = false;
var dragging = false;

var listOfObjectsPressed = [];
var listOfMorphismsPressed = [];
var listOfObjectsReleased = [];
var listOfMorphismsReleased = [];

var leftMousedownOnCanvas = false;
var leftMousedownOnMultiple = false;
var leftMousedownOnObject = false;
var leftMousedownOnMorphism = false;

var rightMousedownOnCanvas = false;
var rightMousedownOnMultiple = false;
var rightMousedownOnObject = false;
var rightMousedownOnMorphism = false;

var selectionRectanglePtr = null;

var movingObjectLastPosition = null;
var movingMorphismLastPosition = null;
//----------------------

//Menu global variables
var menuOpen = false;
var menuCode = -1;
var inputOpen = false;
var inputCode = -1;
var labelString = "";
var xString = "";
var yString = "";
var sourceString = "";
var targetString = "";
var typesString = "";
//---------------------

//TSV global variables
var objectTSVString = "";
var morphismTSVString = "";
var TSVCode = -1;
//--------------------

//Data transfer global variables
var copiedElements = [];
var pasteCounter = 0;
var lastDuplicateObjectAndMorphism = {object: null, morphism: null};
var duplicateWithSameSourceCounter = 0;
var duplicateWithSameTargetCounter = 0;
//------------------------------
function pasteCopiedElements() {
	pasteCounter++;
	var reallyPastedElements = [];
	var pastedElements = copiedElements.slice();
	var pairsOfOldAndNewObjects = [];
	for (var i = 0; i < pastedElements.length; i++) {
		if (pastedElements[i].type === "object") {
			var originalObject = pastedElements[i].element;
			var x = originalObject.getX() + 2 * pasteCounter * Math.degCos(PASTE_ANGLE) * (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS);
			var y = originalObject.getY() - 2 * pasteCounter * Math.degSin(PASTE_ANGLE) * (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS);
			if (x < DEFAULT_CIRCLE_RADIUS) x = DEFAULT_CIRCLE_RADIUS;
			if (y < DEFAULT_CIRCLE_RADIUS) y = DEFAULT_CIRCLE_RADIUS;
			if (x > view.canvasWidth - DEFAULT_CIRCLE_RADIUS) x = view.canvasWidth - DEFAULT_CIRCLE_RADIUS;
			if (y > view.canvasHeight - DEFAULT_CIRCLE_RADIUS) y = view.canvasHeight - DEFAULT_CIRCLE_RADIUS;
			view.createCircle([x, y]);
			view.createCircleLabel([x, y]);
			var newObject = new Object([x, y]);
			objects.push(newObject);
			var ptr = view.createIdEndomorphism(newObject, DEFAULT_CIRCLE_RADIUS);
			view.createIdEndomorphismLabel(ptr.handle, DEFAULT_CIRCLE_RADIUS);
			var newMorphism = new Morphism(objectsCounter, objectsCounter, "endomorphism", true, ptr);
			morphisms.push(newMorphism);
			newObject.addEndomorphism(newMorphism);
			morphismsCounter++;
			pairsOfOldAndNewObjects.push([originalObject, newObject]);
			reallyPastedElements.push({type: "object", element: newObject});
			reallyPastedElements.push({type: "endomorphism", element: newMorphism});
			
			for (var j = 0; j < copiedElements.length; j++) {
				if (copiedElements[j].type === "endomorphism" && copiedElements[j].element.getSource() === originalObject.getId() && !copiedElements[j].element.getIsIdEndomorphism()) {
					var ptr = view.createEndomorphism(newObject, newObject.getRadius(), 270);
					view.createEndomorphismLabel(ptr.handle);
					var newMorphism = new Morphism(newObject.getId(), newObject.getId(), "endomorphism", false, ptr);
					morphisms.push(newMorphism);
					newObject.addEndomorphism(newMorphism);
					morphismsCounter++;
					reallyPastedElements.push({type: "endomorphism", element: newMorphism});
				}
			}
			var endomorphismsArray = newObject.getEndomorphisms();
			var angle = 360 / endomorphismsArray.length;
			for (var j = 0; j < endomorphismsArray.length; j++) {
				var x = newObject.getX() + Math.degCos(90 + j * angle);
				var y = newObject.getY() - Math.degSin(90 + j * angle);
				view.updateEndomorphism(endomorphismsArray[j], [x, y]);
				view.updateEndomorphismLabel(endomorphismsArray[j], [x, y]);
			}
			lastCreatedEndomorphismTimestamp = new Date().getTime();
			objectsCounter++;
			lastCreatedObjectTimestamp = new Date().getTime();
		}
	}
	for (var i = 0; i < pastedElements.length; i++) {
		if (pastedElements[i].type === "morphism") {
			var originalSource = pastedElements[i].element.getSource();
			var originalTarget = pastedElements[i].element.getTarget();
			var sourceSelected = false;
			var targetSelected = false;
			for (var j = 0; j < pastedElements.length; j++) {
				if (pastedElements[j].type === "object") {
					if (pastedElements[j].element.getId() === originalSource) {
						sourceSelected = true;
					} else if (pastedElements[j].element.getId() === originalTarget) {
						targetSelected = true;
					}
				}
			}
			if (sourceSelected && targetSelected) {
				var newSource = null;
				var newTarget = null;
				for (var j = 0; j < pairsOfOldAndNewObjects.length; j++) {
					if (pairsOfOldAndNewObjects[j][0].getId() === originalSource) {
						newSource = pairsOfOldAndNewObjects[j][1];
					} else if (pairsOfOldAndNewObjects[j][0].getId() === originalTarget) {
						newTarget = pairsOfOldAndNewObjects[j][1];
					}
				}
				var ptr = view.createBezier(newSource.getPosition(), newTarget.getPosition());
				view.createBezierLabel(ptr.handle);
				var newMorphism = new Morphism(newSource.getId(), newTarget.getId(), "morphism", false, ptr);
				morphisms.push(newMorphism);
				newSource.addMorphism(newMorphism);
				newTarget.addMorphism(newMorphism);
				morphismsCounter++;
				reallyPastedElements.push({type: "morphism", element: newMorphism});
				
				var sourceMorphismsArray = newSource.getMorphisms();
				var targetMorphismsArray = newTarget.getMorphisms();
				var morphismsBetweenObjects = 0;
				for (var k = 0; k < sourceMorphismsArray.length - 1; k++) {
					var id = sourceMorphismsArray[k].getId();
					for (var l = 0; l < targetMorphismsArray.length - 1; l++) {
						if ((targetMorphismsArray[l].getId()) === id) {
							morphismsBetweenObjects++;
							break;
						}
					}
				}
				var m = [0.5 * (newSource.getX() + newTarget.getX()), 0.5 * (newSource.getY() + newTarget.getY())];
				var realAngleBetweenObjects = Math.realAngle(newSource.getPosition(), newTarget.getPosition());
				var sign = Math.pow(-1, newSource.getId() > newTarget.getId());
				// var r = [m[0] - 2 * (m[0] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
				var r = [m[0] - 2 * sign * (m[0] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
				var ptr = view.updateBezier(newMorphism, r);
				view.updateBezierLabel(newMorphism, r);
				view.deselectBezier(newMorphism);
				newMorphism.setPoints([ptr.p0, ptr.p1, ptr.p2]);
				newMorphism.setCurvePath(ptr.curve.attr("d"));
				newMorphism.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
				
				lastCreatedMorphismTimestamp = new Date().getTime();
			}
		}
	}
	return reallyPastedElements;
}
function removeHiddenElements() {
	for (var i = 0; i < hiddenElements.length; i++) {
		if (hiddenElements[i].type === "object") {
			var id = hiddenElements[i].element.getId();
			view.deleteCircle(id);
			view.deleteCircleLabel(id);
		} else if (hiddenElements[i].type !== "endomorphism") {
			var id = hiddenElements[i].element.getId();
			view.deleteBezier(id);
			view.deleteBezierLabel(id);
		} else if (hiddenElements[i].type === "endomorphism") {
			var id = hiddenElements[i].element.getId();
			var isIdEndomorphism = false;
			for (var j = 0; j < objects.length; j++) {
				if (objects[j].getEndomorphism(0).getId() === id) {
					isIdEndomorphism = true;
					break;
				}
			}
			if (!isIdEndomorphism) {
				view.deleteEndomorphism(id);
				view.deleteEndomorphismLabel(id);
			}
		}
	}
	hiddenElements = [];
}

//State variables
var state = null;
var hiddenElements = [];
//---------------

//Drawing variables
var drawingLastCoords = null;
var tabPressed = false;
var drawingAllowed = false;
//-----------------

//Input (keyboard+mouse) variables
var keyboardMouseStatus = "idle";
//--------------------------------

//Object creation variables
var lastCreatedObjectTimestamp = new Date().getTime();
var lastCreatedEndomorphismTimestamp = new Date().getTime();
//-------------------------

//Morphism creation variables
var currentMorphismType = "morphism";
//---------------------------

function objectCreate(p) {
	view.createCircle(p);
	view.createCircleLabel(p);
	var newObject = new Object(p);
	objects.push(newObject);
	var ptr = view.createIdEndomorphism(newObject, DEFAULT_CIRCLE_RADIUS);
	view.createIdEndomorphismLabel(ptr.handle, DEFAULT_CIRCLE_RADIUS);
	var newMorphism = new Morphism(objectsCounter, objectsCounter, "endomorphism", true, ptr);
	morphisms.push(newMorphism);
	newObject.addEndomorphism(newMorphism);
	objectsCounter++;
	morphismsCounter++;
	state.createState("createObject", [newObject, newMorphism]);
	lastCreatedObjectTimestamp = new Date().getTime();
	lastCreatedEndomorphismTimestamp = new Date().getTime();
	return newObject;
}

function morphismCreate(source, target, type) {
	// console.log("morphism create");
	var ptr = view.createBezier(source.getPosition(), target.getPosition());
	view.createBezierLabel(ptr.handle);
	var newMorphism = new Morphism(source.getId(), target.getId(), type, false, ptr);
	morphisms.push(newMorphism);
	source.addMorphism(newMorphism);
	target.addMorphism(newMorphism);
	morphismsCounter++;
	//move the new morphism to avoid collision with other morphisms
	var sourceMorphismsArray = source.getMorphisms();
	var targetMorphismsArray = target.getMorphisms();
	var morphismsBetweenObjects = 0;
	for (var i = 0; i < sourceMorphismsArray.length - 1; i++) {
		var id = sourceMorphismsArray[i].getId();
		for (var j = 0; j < targetMorphismsArray.length - 1; j++) {
			if ((targetMorphismsArray[j].getId()) === id) {
				morphismsBetweenObjects++;
				break;
			}
		}
	}
	var m = [0.5 * (source.getX() + target.getX()), 0.5 * (source.getY() + target.getY())];
	var realAngleBetweenObjects = Math.realAngle(source.getPosition(), target.getPosition());
	var sign = Math.pow(-1, source.getId() > target.getId());
	// var r = [m[0] - 2 * (m[0] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
	var r = [m[0] - 2 * sign * (m[0] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + morphismsBetweenObjects * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
	var ptr = view.updateBezier(newMorphism, r);
	view.updateBezierLabel(newMorphism, r);
	view.deselectBezier(newMorphism);
	newMorphism.setPoints([ptr.p0, ptr.p1, ptr.p2]);
	newMorphism.setCurvePath(ptr.curve.attr("d"));
	newMorphism.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
	lastCreatedMorphismTimestamp = new Date().getTime();
	return newMorphism;
}
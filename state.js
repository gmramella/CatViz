/*
doneActions/undoneActions: string in { 
	"changeType", 
	"createEndomorphism", "createMorphism", "createMorphismFrom", "createMorphismTo", "createObject", 
	"cutSelected", 
	"deleteEndomorphism", "deleteMorphism", "deleteObject", "deleteSelected", 
	"dragEndomorphism", "dragSelected", 
	"pasteSelected", 
	"updateEndomorphism", "moveMorphism", "updateMorphism", "moveObject", "updateObject"
}
states: list of descriptions
currentStateIndex: natural number or -1, indicating empty list
*/
function State() {
	var doneActions = [];
	var undoneActions = [];
	var states = [];
	var currentStateIndex = -1;
	var savedStates = [];
	
	/*
	Remove undone actions when new action is done
	*/
	function removeUndoneActions() {
		for (var i = 0; i < undoneActions.length; i++) {
			console.log("removeUndoneActions "+undoneActions[i]);
			switch (undoneActions[i]) {
				case "changeType":
					break;
				case "createEndomorphism":
					break;
				case "createMorphism":
					var source = getObjectById(states[currentStateIndex + 1].morphisms.getSource());
					var target = getObjectById(states[currentStateIndex + 1].morphisms.getTarget());
					source.getMorphisms().splice(target.getMorphisms().length - 2, 1);
					if (source.getId() !== target.getId()) {
						target.getMorphisms().splice(target.getMorphisms().length - 2, 1);
					}
					break;
				case "createMorphismFrom":
					var source = getObjectById(states[currentStateIndex + 1].morphisms.getSource());
					var target = getObjectById(states[currentStateIndex + 1].morphisms.getTarget());
					source.getMorphisms().splice(target.getMorphisms().length - 2, 1);
					if (source.getId() !== target.getId()) {
						target.getMorphisms().splice(target.getMorphisms().length - 2, 1);
					}
					break;
				case "createMorphismTo":
					var source = getObjectById(states[currentStateIndex + 1].morphisms.getSource());
					var target = getObjectById(states[currentStateIndex + 1].morphisms.getTarget());
					source.getMorphisms().splice(target.getMorphisms().length - 2, 1);
					if (source.getId() !== target.getId()) {
						target.getMorphisms().splice(target.getMorphisms().length - 2, 1);
					}
					break;
				case "createObject":
					// var createdObject = states[i].objects[0];
					// var objectId = createdObject.getId();
					// var idEndomorphismId = createdObject.getEndomorphisms(0).getId();
					// removeMorphismById(idEndomorphismId);
					// removeMorphismLabelById(idEndomorphismId);
					// removeObjectById(objectId);
					// removeObjectLabelById(objectId);
					break;
				case "cutSelected":
					break;
				case "deleteMorphism":
					break;
				case "deleteObject":
					break;
				case "deleteSelected":
					break;
				case "dragSelected":
					break;
				case "pasteSelected":
					break;
				case "moveMorphism":
					break;
				case "updateMorphism":
					break;
				case "moveObject":
					break;
				case "updateObject":
					break;
			}
		}
		doneActions.splice(currentStateIndex + 1, undoneActions.length);
		states.splice(currentStateIndex + 1, undoneActions.length);
		undoneActions = [];
	}
	
	/*
	Create state with new action
	*/
	this.createState = function(action, elements) {
		if (action !== "cutSelected" && action !== "moveObject") {
			removeHiddenElements();
			removeUndoneActions();
		}
		switch (action) {
			case "changeType":
				doneActions.push("changeType");
				var description = {morphisms: elements[0], previousTypes: elements[1], currentTypes: null};
				states.push(description);
				currentStateIndex++;
				break;
			case "createEndomorphism":
				doneActions.push("createEndomorphism");
				var description = {endomorphisms: elements[0]};
				states.push(description);
				currentStateIndex++;
				break;
			case "createMorphism":
				doneActions.push("createMorphism");
				var description = {morphisms: elements[0]};
				states.push(description);
				currentStateIndex++;
				break;
			case "createMorphismFrom":
				doneActions.push("createMorphismFrom");
				var description = {morphisms: elements};
				states.push(description);
				currentStateIndex++;
				break;
			case "createMorphismTo":
				doneActions.push("createMorphismTo");
				var description = {morphisms: elements};
				states.push(description);
				currentStateIndex++;
				break;
			case "createObject":
				doneActions.push("createObject");
				var description = {objects: elements[0], endomorphisms: elements[1]};
				states.push(description);
				currentStateIndex++;
				break;
			case "cutSelected":
				doneActions.push("cutSelected");
				var description = {objects: [], morphisms: [], endomorphisms: []};
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].type === "object") {
						description.objects.push(elements[i].element);
						var object = elements[i].element;
						var morphisms = object.getMorphisms();
						var endomorphisms = object.getEndomorphisms();
						for (var j = 0; j < morphisms.length; j++) {
							if (!elements.has(morphisms[j])) {
								description.morphisms.push(morphisms[j]);
							}
						}
						for (var j = 0; j < endomorphisms.length; j++) {
							if (!elements.has(endomorphisms[j])) {
								description.endomorphisms.push(endomorphisms[j]);
							}
						}
					} else if (elements[i].type !== "endomorphism") {
						description.morphisms.push(elements[i].element);
					} else if (elements[i].type === "endomorphism") {
						description.endomorphisms.push(elements[i].element);
					}
				}
				states.push(description);
				currentStateIndex++;
				break;
			case "deleteMorphism":
				doneActions.push("deleteMorphism");
				var morphism = elements;
				var description = {objects: [], morphisms: [], endomorphisms: []};
				description.morphisms.push(morphism);
				states.push(description);
				currentStateIndex++;
				break;
			case "deleteObject":
				doneActions.push("deleteObject");
				console.log(elements);
				var object = elements;
				var description = {objects: [], morphisms: [], endomorphisms: []};
				description.objects.push(object);
				var morphismsArray = object.getMorphisms();
				var endomorphismsArray = object.getEndomorphisms();
				for (var i = 0; i < morphismsArray.length; i++) {
					description.morphisms.push(morphismsArray[i]);
				}
				for (var i = 0; i < endomorphismsArray.length; i++) {
					description.endomorphisms.push(endomorphismsArray[i]);
				}
				states.push(description);
				currentStateIndex++;
				break;
			case "deleteSelected":
				doneActions.push("deleteSelected");
				var description = {objects: [], morphisms: [], endomorphisms: []};
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].type === "object") {
						description.objects.push(elements[i].element);
						var morphs = elements[i].element.getMorphisms();
						for (var j = 0; j < morphs.length; j++) {
							description.morphisms.push(morphs[j]);
						}
						var endos = elements[i].element.getEndomorphisms();
						for (var j = 1; j < endos.length; j++) {
							description.endomorphisms.push(endos[j]);
						}
					} else if (elements[i].type !== "endomorphism") {
						description.morphisms.push(elements[i].element);
					} else if (elements[i].type === "endomorphism") {
						description.endomorphisms.push(elements[i].element);
					}
				}
				states.push(description);
				currentStateIndex++;
				break;
			case "dragSelected":
				console.log("dragSelected");
				doneActions.push("dragSelected");
				var description = {objects: [], morphisms: [], endomorphisms: [], objectsPreviousPositions: [], morphismsPreviousPositions: [], endomorphismsPreviousPositions: [], objectsCurrentPositions: [], morphismsCurrentPositions: [], endomorphismsCurrentPositions: []};
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].type === "object") {
						description.objects.push(elements[i].element);
						description.objectsPreviousPositions.push(elements[i].element.getPosition());
					} else if (elements[i].type !== "endomorphism") {
						description.morphisms.push(elements[i].element);
						description.morphismsPreviousPositions.push(elements[i].element.getHandlePosition());
					} else if (elements[i].type === "endomorphism") {
						description.endomorphisms.push(elements[i].element);
						description.endomorphismsPreviousPositions.push(elements[i].element.getHandlePosition());
					}
				}
				states.push(description);
				currentStateIndex++;
				break;
			case "pasteSelected":
				console.log("pasteSelected");
				doneActions.push("pasteSelected");
				var description = {objects: [], morphisms: [], endomorphisms: []};
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].type === "object") {
						description.objects.push(elements[i].element);
					} else if (elements[i].type !== "endomorphism") {
						description.morphisms.push(elements[i].element);
					} else if (elements[i].type === "endomorphism") {
						description.endomorphisms.push(elements[i].element);
					}
				}
				states.push(description);
				currentStateIndex++;
				break;
			case "moveMorphism":
				doneActions.push("moveMorphism");
				var description = {morphisms: null, endomorphisms: null, morphismsPreviousPositions: null, endomorphismsPreviousPositions: null, morphismsCurrentPositions: null, endomorphismsCurrentPositions: null};
				if (elements.getType() !== "endomorphism") {
					description.morphisms = elements;
					description.morphismsPreviousPositions = movingMorphismLastPosition;
				} else if (elements.getType() === "endomorphism") {
					description.endomorphisms = elements;
					description.endomorphismsPreviousPositions = movingMorphismLastPosition;
				}
				states.push(description);
				currentStateIndex++;
				break;
			case "updateMorphism":
				doneActions.push("updateMorphism");
				var description = {morphisms: elements[0], previousAttributes: elements[1], currentAttributes: null};
				states.push(description);
				currentStateIndex++;
				break;
			case "moveObject":
				doneActions.push("moveObject");
				var description = {objects: elements, objectsPreviousPositions: movingObjectLastPosition, objectsCurrentPositions: null};
				states.push(description);
				currentStateIndex++;
				break;
			case "updateObject":
				doneActions.push("updateObject");
				var description = {objects: elements[0], previousAttributes: elements[1], currentAttributes: null};
				states.push(description);
				currentStateIndex++;
				break;
		}
	}
	
	/*
	Go to next state on the stack of states
	*/
	this.gotoNextState = function() {
		if ((currentStateIndex + 1) >= states.length) {
			alert(STR_NO_MORE_REDO);
			return;
		}
		doneActions.push(undoneActions.pop());
		switch (doneActions.last()) {
			case "changeType":
				var morphism = states[currentStateIndex + 1].morphisms;
				var currType = states[currentStateIndex + 1].currentTypes;
				morphism.setType(currType);
				var position = morphism.getHandlePosition();
				view.changeBezierType(morphism);
				var ptr = view.updateBezier(morphism, position);
				view.updateBezierLabel(morphism, position);
				morphism.setPoints([ptr.p0, ptr.p1, ptr.p2]);
				morphism.setCurvePath(ptr.curve.attr("d"));
				morphism.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
				break;
			case "createEndomorphism":
				view.showEndomorphism(states[currentStateIndex + 1].endomorphisms);
				states[currentStateIndex + 1].endomorphisms.setVisible(true);
				var source = getObjectById(states[currentStateIndex + 1].endomorphisms.getSource());
				var endomorphismsArray = source.getEndomorphisms().filter(function(e){return e.getVisible();});
				var angle = 360 / endomorphismsArray.length;
				for (var i = 0; i < endomorphismsArray.length; i++) {
					var x = source.getX() + Math.degCos(90 + i * angle);
					var y = source.getY() - Math.degSin(90 + i * angle);
					view.updateEndomorphism(endomorphismsArray[i], [x, y]);
					view.updateEndomorphismLabel(endomorphismsArray[i], [x, y]);
				}
				break;
			case "createMorphism":
				view.showBezier(states[currentStateIndex + 1].morphisms);
				states[currentStateIndex + 1].morphisms.setVisible(true);
				break;
			case "createMorphismFrom":
				view.showBezier(states[currentStateIndex + 1].morphisms);
				states[currentStateIndex + 1].morphisms.setVisible(true);
				break;
			case "createMorphismTo":
				view.showBezier(states[currentStateIndex + 1].morphisms);
				states[currentStateIndex + 1].morphisms.setVisible(true);
				break;
			case "createObject":
				view.showCircle(states[currentStateIndex + 1].objects);
				states[currentStateIndex + 1].objects.setVisible(true);
				view.showEndomorphism(states[currentStateIndex + 1].endomorphisms);
				states[currentStateIndex + 1].endomorphisms.setVisible(true);
				break;
			case "cutSelected":
				var objs = states[currentStateIndex + 1].objects;
				var morphs = states[currentStateIndex + 1].morphisms;
				var endos = states[currentStateIndex + 1].endomorphisms;
				for (var i = 0; i < objs.length; i++) {
					view.hideCircle(objs[i]);
					objs[i].setVisible(false);
				}
				for (var i = 0; i < morphs.length; i++) {
					view.hideBezier(morphs[i]);
					morphs[i].setVisible(false);
				}
				for (var i = 0; i < endos.length; i++) {
					view.hideEndomorphism(endos[i]);
					endos[i].setVisible(false);
					var source = getObjectById(endos[i].getSource());
					var endomorphismsArray = source.getEndomorphisms().filter(function(e){return e.getVisible();});
					var angle = 360 / endomorphismsArray.length;
					for (var j = 0; j < endomorphismsArray.length; j++) {
						var x = source.getX() + Math.degCos(90 + j * angle);
						var y = source.getY() - Math.degSin(90 + j * angle);
						view.updateEndomorphism(endomorphismsArray[j], [x, y]);
						view.updateEndomorphismLabel(endomorphismsArray[j], [x, y]);
					}
				}
				break;
			case "deleteMorphism":
				console.log("deleteMorphism");
				var morph = states[currentStateIndex + 1].morphisms[0];
				if (morph.getType() !== "endomorphism") {
					view.hideBezier(morph);
					morph.setVisible(false);
				} else {
					view.hideEndomorphism(morph);
					morph.setVisible(false);
				}
				break;
			case "deleteObject":
				console.log("deleteObject");
				var obj = states[currentStateIndex + 1].objects[0];
				var morphs = states[currentStateIndex + 1].morphisms;
				var endos = states[currentStateIndex + 1].endomorphisms;
				view.hideCircle(obj);
				obj.setVisible(false);
				for (var i = 0; i < morphs.length; i++) {
					view.hideBezier(morphs[i]);
					morphs[i].setVisible(false);
				}
				var sources = [];
				for (var i = 0; i < endos.length; i++) {
					view.hideEndomorphism(endos[i]);
					endos[i].setVisible(false);
				}
				break;
			case "deleteSelected":
				var objs = states[currentStateIndex + 1].objects;
				var morphs = states[currentStateIndex + 1].morphisms;
				var endos = states[currentStateIndex + 1].endomorphisms;
				for (var i = 0; i < objs.length; i++) {
					view.hideCircle(objs[i]);
					objs[i].setVisible(false);
				}
				for (var i = 0; i < morphs.length; i++) {
					view.hideBezier(morphs[i]);
					morphs[i].setVisible(false);
				}
				var sources = [];
				for (var i = 0; i < endos.length; i++) {
					view.hideEndomorphism(endos[i]);
					endos[i].setVisible(false);
					sources.push(endos[i].getSource());
					var endomorphismsArray = getObjectById(endos[i].getSource()).getEndomorphisms();
					for (var j = 0; j < endomorphismsArray.length; j++) {
						if (endomorphismsArray[j].getId() == endos[i].getId()) {
							endomorphismsArray[j].setVisible(false);
						}
					}
				}
				sources = sources.uniques();
				for (var i = 0; i < sources.length; i++) {
					var source = getObjectById(sources[i]);
					var endomorphismsArray = source.getEndomorphisms().filter(function(e){return e.getVisible();});
					var angle = 360 / endomorphismsArray.length;
					for (var i = 0; i < endomorphismsArray.length; i++) {
						var x = source.getX() + Math.degCos(90 + i * angle);
						var y = source.getY() - Math.degSin(90 + i * angle);
						view.updateEndomorphism(endomorphismsArray[i], [x, y]);
						view.updateEndomorphismLabel(endomorphismsArray[i], [x, y]);
					}
				}
				break;
			case "dragSelected":
				console.log("dragSelected");
				var objs = states[currentStateIndex + 1].objects;
				var morphs = states[currentStateIndex + 1].morphisms;
				var endos = states[currentStateIndex + 1].endomorphisms;
				for (var i = 0; i < objs.length; i++) {
					var objectCurrentPosition = objs[i].getPosition();
					var temp = states[currentStateIndex + 1].objectsCurrentPositions[i];
					states[currentStateIndex + 1].objectsCurrentPositions[i] = states[currentStateIndex + 1].objectsPreviousPositions[i];
					states[currentStateIndex + 1].objectsPreviousPositions[i] = temp;
					var prevPosition = states[currentStateIndex + 1].objectsPreviousPositions[i];
					view.updateCircle(objs[i], prevPosition);
					view.updateCircleLabel(objs[i], prevPosition);
					objs[i].setPosition(prevPosition);
					var objectMorphisms = objs[i].getMorphisms();
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
								// var r = [m[0] - 2 * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var r = [m[0] - 2 * sign * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var ptr = view.updateBezier(objectMorphisms[k], r);
								view.updateBezierLabel(objectMorphisms[k], r);
								objectMorphisms[k].setPoints([ptr.p0, ptr.p1, ptr.p2]);
								objectMorphisms[k].setCurvePath(ptr.curve.attr("d"));
								objectMorphisms[k].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
								break;
							}
						}
					}
					var objectEndomorphisms = objs[i].getEndomorphisms();
					for (var j = 0; j < objectEndomorphisms.length; j++) {
						view.translateEndomorphism(objectEndomorphisms[j], prevPosition, objectCurrentPosition);
						view.translateEndomorphismLabel(objectEndomorphisms[j]);
					}
				}
				break;
			case "pasteSelected":
				console.log("pasteSelected");
				pasteCounter++;
				var objs = states[currentStateIndex + 1].objects;
				var morphs = states[currentStateIndex + 1].morphisms;
				var endos = states[currentStateIndex + 1].endomorphisms;
				for (var i = 0; i < objs.length; i++) {
					view.showCircle(objs[i]);
					objs[i].setVisible(true);
				}
				for (var i = 0; i < morphs.length; i++) {
					view.showBezier(morphs[i]);
					morphs[i].setVisible(true);
				}
				for (var i = 0; i < endos.length; i++) {
					view.showEndomorphism(endos[i]);
					endos[i].setVisible(true);
				}
				break;
			case "moveMorphism":
				var morphs = states[currentStateIndex + 1].morphisms;
				var endos = states[currentStateIndex + 1].endomorphisms;
				if (morphs !== null) {
					var morphismCurrentPosition = morphs.getHandlePosition();
					var temp = states[currentStateIndex + 1].morphismsCurrentPositions;
					states[currentStateIndex + 1].morphismsCurrentPositions = states[currentStateIndex + 1].morphismsPreviousPositions;
					states[currentStateIndex + 1].morphismsPreviousPositions = temp;
					var prevPosition = states[currentStateIndex + 1].morphismsPreviousPositions;
					view.updateBezier(morphs, prevPosition);
					view.updateBezierLabel(morphs, prevPosition);
					morphs.setHandlePosition(prevPosition);
				} else if (endos !== null) {
					var morphismCurrentPosition = endos.getHandlePosition();
					var temp = states[currentStateIndex + 1].endomorphismsCurrentPositions;
					states[currentStateIndex + 1].endomorphismsCurrentPositions = states[currentStateIndex + 1].endomorphismsPreviousPositions;
					states[currentStateIndex + 1].endomorphismsPreviousPositions = temp;
					var prevPosition = states[currentStateIndex + 1].endomorphismsPreviousPositions;
					view.updateEndomorphism(endos, prevPosition);
					view.updateEndomorphismLabel(endos, prevPosition);
					endos.setHandlePosition(prevPosition);
				}
				break;
			case "updateMorphism":
				var morphism = states[currentStateIndex + 1].morphisms;
				var currAttr = states[currentStateIndex + 1].currentAttributes;
				morphism.setAll(currAttr);
				var position = morphism.getHandlePosition();
				view.changeBezierType(morphism);
				var ptr = view.updateBezier(morphism, position);
				view.updateBezierLabel(morphism, position);
				break;
			case "moveObject":
				var obj = states[currentStateIndex + 1].objects;
				var objectCurrentPosition = obj.getPosition();
				var temp = states[currentStateIndex + 1].objectsCurrentPositions;
				states[currentStateIndex + 1].objectsCurrentPositions = states[currentStateIndex + 1].objectsPreviousPositions;
				states[currentStateIndex + 1].objectsPreviousPositions = temp;
				var prevPosition = states[currentStateIndex + 1].objectsPreviousPositions;
				view.updateCircle(obj, prevPosition);
				view.updateCircleLabel(obj, prevPosition);
				obj.setPosition(prevPosition);
				var objectMorphisms = obj.getMorphisms();
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
							// var r = [m[0] - 2 * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
							var r = [m[0] - 2 * sign * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
							var ptr = view.updateBezier(objectMorphisms[k], r);
							view.updateBezierLabel(objectMorphisms[k], r);
							objectMorphisms[k].setPoints([ptr.p0, ptr.p1, ptr.p2]);
							objectMorphisms[k].setCurvePath(ptr.curve.attr("d"));
							objectMorphisms[k].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
							break;
						}
					}
				}
				var objectEndomorphisms = obj.getEndomorphisms();
				for (var j = 0; j < objectEndomorphisms.length; j++) {
					view.translateEndomorphism(objectEndomorphisms[j], prevPosition, objectCurrentPosition);
					view.translateEndomorphismLabel(objectEndomorphisms[j]);
				}
				break;
			case "updateObject":
				var object = states[currentStateIndex + 1].objects;
				var currAttr = states[currentStateIndex + 1].currentAttributes;
				object.setAll(currAttr);
				view.changeCircleLabel(object);
				view.changeCirclePosition(object);
				view.changeCircleLabelPosition(object);
				var objectMorphisms = object.getMorphisms();
				for (var i = 0; i < objectMorphisms.length; i++) {
					var source = getObjectById(objectMorphisms[i].getSource());
					var target = getObjectById(objectMorphisms[i].getTarget());
					var m = [0.5 * (source.getX() + target.getX()), 0.5 * (source.getY() + target.getY())];
					var realAngleBetweenObjects = Math.realAngle(source.getPosition(), target.getPosition());
					var sign = Math.pow(-1, source.getId() > target.getId());
					// var r = [m[0] - 2 * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
					var r = [m[0] - 2 * sign * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
					view.changeBezier(objectMorphisms[i], r);
					view.changeBezierLabel(objectMorphisms[i], r);
				}
				var endomorphismsArray = object.getEndomorphisms();
				var angle = 360 / endomorphismsArray.length;
				for (var i = 0; i < endomorphismsArray.length; i++) {
					var x = object.getX() + Math.degCos(90 + i * angle);
					var y = object.getY() - Math.degSin(90 + i * angle);
					view.changeEndomorphism(endomorphismsArray[i], [x, y]);
					view.changeEndomorphismLabel(endomorphismsArray[i], [x, y]);
				}
				var endo = object.getEndomorphism(0);
				endo.setLabel("id" + object.getLabel());
				var pos = endo.getHandlePosition();
				view.changeEndomorphismLabel(endo, pos);
				break;
		}
		currentStateIndex++;
	}
	
	/*
	Go to previous state on the stack of states
	*/
	this.gotoPrevState = function() {
		if (currentStateIndex < 0) {
			alert(STR_NO_MORE_UNDO);
			return;
		}
		undoneActions.push(doneActions.pop());
		switch (undoneActions.last()) {
			case "changeType":
				var morphism = states[currentStateIndex].morphisms;
				var prevType = states[currentStateIndex].previousTypes;
				if (states[currentStateIndex].currentTypes === null) {
					states[currentStateIndex].currentTypes = morphism.getType();
				}
				morphism.setType(prevType);
				var position = morphism.getHandlePosition();
				view.changeBezierType(morphism);
				var ptr = view.updateBezier(morphism, position);
				view.updateBezierLabel(morphism, position);
				morphism.setPoints([ptr.p0, ptr.p1, ptr.p2]);
				morphism.setCurvePath(ptr.curve.attr("d"));
				morphism.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
				break;
			case "createEndomorphism":
				hiddenElements.push({type: "endomorphism", element: states[currentStateIndex].endomorphisms});
				view.hideEndomorphism(states[currentStateIndex].endomorphisms);
				states[currentStateIndex].endomorphisms.setVisible(false);
				var source = getObjectById(states[currentStateIndex].endomorphisms.getSource());
				var endomorphismsArray = source.getEndomorphisms().filter(function(e){return e.getVisible();});
				var angle = 360 / endomorphismsArray.length;
				for (var i = 0; i < endomorphismsArray.length; i++) {
					var x = source.getX() + Math.degCos(90 + i * angle);
					var y = source.getY() - Math.degSin(90 + i * angle);
					view.updateEndomorphism(endomorphismsArray[i], [x, y]);
					view.updateEndomorphismLabel(endomorphismsArray[i], [x, y]);
				}
				break;
			case "createMorphism":
				hiddenElements.push({type: "morphism", element: states[currentStateIndex].morphisms});
				view.hideBezier(states[currentStateIndex].morphisms);
				states[currentStateIndex].morphisms.setVisible(false);
				break;
			case "createMorphismFrom":
				hiddenElements.push({type: "morphism", element: states[currentStateIndex].morphisms});
				view.hideBezier(states[currentStateIndex].morphisms);
				states[currentStateIndex].morphisms.setVisible(false);
				break;
			case "createMorphismTo":
				hiddenElements.push({type: "morphism", element: states[currentStateIndex].morphisms});
				view.hideBezier(states[currentStateIndex].morphisms);
				states[currentStateIndex].morphisms.setVisible(false);
				break;
			case "createObject":
				hiddenElements.push({type: "object", element: states[currentStateIndex].objects});
				hiddenElements.push({type: "endomorphism", element: states[currentStateIndex].endomorphisms});
				view.hideCircle(states[currentStateIndex].objects);
				states[currentStateIndex].objects.setVisible(false);
				view.hideEndomorphism(states[currentStateIndex].endomorphisms);
				states[currentStateIndex].endomorphisms.setVisible(false);
				break;
			case "cutSelected":
				var objs = states[currentStateIndex].objects;
				var morphs = states[currentStateIndex].morphisms;
				var endos = states[currentStateIndex].endomorphisms;
				for (var i = 0; i < morphs.length; i++) {
					view.showBezier(morphs[i]);
					morphs[i].setVisible(true);
					view.deselectBezier(morphs[i]);
				}
				for (var i = 0; i < endos.length; i++) {
					view.showEndomorphism(endos[i]);
					endos[i].setVisible(true);
					view.deselectEndomorphism(endos[i]);
					var source = getObjectById(endos[i].getSource());
					var endomorphismsArray = source.getEndomorphisms().filter(function(e){return e.getVisible();});
					var angle = 360 / endomorphismsArray.length;
					for (var j = 0; j < endomorphismsArray.length; j++) {
						var x = source.getX() + Math.degCos(90 + j * angle);
						var y = source.getY() - Math.degSin(90 + j * angle);
						view.updateEndomorphism(endomorphismsArray[j], [x, y]);
						view.updateEndomorphismLabel(endomorphismsArray[j], [x, y]);
					}
				}
				for (var i = 0; i < objs.length; i++) {
					view.showCircle(objs[i]);
					objs[i].setVisible(true);
					view.deselectCircle(objs[i]);
				}
				hiddenElements = [];
				break;
			case "deleteMorphism":
				var morph = states[currentStateIndex].morphisms[0];
				if (morph.getType() !== "endomorphism") {
					view.showBezier(morph);
					morph.setVisible(true);
				} else {
					view.showEndomorphism(morph);
					morph.setVisible(true);
				}
				break;
			case "deleteObject":
				var obj = states[currentStateIndex].objects[0];
				var morphs = states[currentStateIndex].morphisms;
				var endos = states[currentStateIndex].endomorphisms;
				view.showCircle(obj);
				obj.setVisible(true);
				for (var i = 0; i < morphs.length; i++) {
					view.showBezier(morphs[i]);
					morphs[i].setVisible(true);
				}
				var sources = [];
				for (var i = 0; i < endos.length; i++) {
					view.showEndomorphism(endos[i]);
					endos[i].setVisible(true);
				}
				break;
			case "deleteSelected":
				var objs = states[currentStateIndex].objects;
				var morphs = states[currentStateIndex].morphisms;
				var endos = states[currentStateIndex].endomorphisms;
				for (var i = 0; i < objs.length; i++) {
					view.showCircle(objs[i]);
					objs[i].setVisible(true);
					view.deselectCircle(objs[i]);
				}
				for (var i = 0; i < morphs.length; i++) {
					view.showBezier(morphs[i]);
					morphs[i].setVisible(true);
					view.deselectBezier(morphs[i]);
				}
				var sources = [];
				for (var i = 0; i < endos.length; i++) {
					if (view.endomorphismExists(endos[i].getId())) {
						view.showEndomorphism(endos[i]);
						endos[i].setVisible(true);
						view.deselectEndomorphism(endos[i]);
					} else {
						var id = endos[i].getId();
						var label = endos[i].getLabel();
						var source = getObjectById(endos[i].getSource());
						var width = endos[i].getWidth();
						var ptr = view.createEndomorphism(source, source.getRadius(), 270, id);
						view.createEndomorphismLabel(ptr.handle, id);
						var newMorphism = new Morphism(source.getId(), source.getId(), "endomorphism", false, ptr);
						newMorphism.setId(id);
						newMorphism.setLabel(label);
						view.changeEndomorphismLabel(newMorphism, [0, 0]);
						morphisms.push(newMorphism);
						source.addEndomorphism(newMorphism);
					}
					sources.push(endos[i].getSource());
				}
				sources = sources.uniques();
				for (var i = 0; i < sources.length; i++) {
					var source = getObjectById(sources[i]);
					var endomorphismsArray = source.getEndomorphisms().filter(function(e){return e.getVisible();});
					var angle = 360 / endomorphismsArray.length;
					for (var i = 0; i < endomorphismsArray.length; i++) {
						var x = source.getX() + Math.degCos(90 + i * angle);
						var y = source.getY() - Math.degSin(90 + i * angle);
						view.updateEndomorphism(endomorphismsArray[i], [x, y]);
						view.updateEndomorphismLabel(endomorphismsArray[i], [x, y]);
					}
				}
				break;
			case "dragSelected":
				var objs = states[currentStateIndex].objects;
				var morphs = states[currentStateIndex].morphisms;
				var endos = states[currentStateIndex].endomorphisms;
				if (states[currentStateIndex].objectsCurrentPositions.length === 0) {
					for (var i = 0; i < objs.length; i++) {
						var objectCurrentPosition = objs[i].getPosition();
						states[currentStateIndex].objectsCurrentPositions.push(objectCurrentPosition);
						var prevPosition = states[currentStateIndex].objectsPreviousPositions[i];
						console.log(objectCurrentPosition);
						console.log(prevPosition);
						view.updateCircle(objs[i], prevPosition);
						view.updateCircleLabel(objs[i], prevPosition);
						objs[i].setPosition(prevPosition);
						var objectMorphisms = objs[i].getMorphisms();
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
									// var r = [m[0] - 2 * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
									var r = [m[0] - 2 * sign * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
									var ptr = view.updateBezier(objectMorphisms[k], r);
									view.updateBezierLabel(objectMorphisms[k], r);
									objectMorphisms[k].setPoints([ptr.p0, ptr.p1, ptr.p2]);
									objectMorphisms[k].setCurvePath(ptr.curve.attr("d"));
									objectMorphisms[k].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
									break;
								}
							}
						}
						var objectEndomorphisms = objs[i].getEndomorphisms();
						for (var j = 0; j < objectEndomorphisms.length; j++) {
							view.translateEndomorphism(objectEndomorphisms[j], prevPosition, objectCurrentPosition);
							view.translateEndomorphismLabel(objectEndomorphisms[j]);
						}
					}
				} else {
					for (var i = 0; i < objs.length; i++) {
						var objectCurrentPosition = objs[i].getPosition();
						var temp = states[currentStateIndex].objectsCurrentPositions[i];
						states[currentStateIndex].objectsCurrentPositions[i] = states[currentStateIndex].objectsPreviousPositions[i];
						states[currentStateIndex].objectsPreviousPositions[i] = temp;
						var prevPosition = states[currentStateIndex].objectsPreviousPositions[i];
						view.updateCircle(objs[i], prevPosition);
						view.updateCircleLabel(objs[i], prevPosition);
						objs[i].setPosition(prevPosition);
						var objectMorphisms = objs[i].getMorphisms();
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
									// var r = [m[0] - 2 * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
									var r = [m[0] - 2 * sign * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
									var ptr = view.updateBezier(objectMorphisms[k], r);
									view.updateBezierLabel(objectMorphisms[k], r);
									objectMorphisms[k].setPoints([ptr.p0, ptr.p1, ptr.p2]);
									objectMorphisms[k].setCurvePath(ptr.curve.attr("d"));
									objectMorphisms[k].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
									break;
								}
							}
						}
						var objectEndomorphisms = objs[i].getEndomorphisms();
						for (var j = 0; j < objectEndomorphisms.length; j++) {
							view.translateEndomorphism(objectEndomorphisms[j], prevPosition, objectCurrentPosition);
							view.translateEndomorphismLabel(objectEndomorphisms[j]);
						}
					}
				}
				if (states[currentStateIndex].morphismsCurrentPositions.length === 0) {
					for (var i = 0; i < morphs.length; i++) {
						console.log(morphs[i].getHandlePosition());
						console.log(states[currentStateIndex].morphismsPreviousPositions[i]);
						var morphismCurrentPosition = morphs[i].getHandlePosition();
						states[currentStateIndex].morphismsCurrentPositions.push(morphismCurrentPosition);
						var prevPosition = states[currentStateIndex].morphismsPreviousPositions[i];
						var ptr = view.updateBezier(morphs[i], prevPosition);
						view.updateBezierLabel(morphs[i], prevPosition);
						morphs[i].setPoints([ptr.p0, ptr.p1, ptr.p2]);
						morphs[i].setCurvePath(ptr.curve.attr("d"));
						morphs[i].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					}
				} else {
					for (var i = 0; i < morphs.length; i++) {
						// var morphismCurrentPosition = morphs[i].getHandlePosition();
						var temp = states[currentStateIndex].morphismsCurrentPositions[i];
						states[currentStateIndex].morphismsCurrentPositions[i] = states[currentStateIndex].morphismsPreviousPositions[i];
						states[currentStateIndex].morphismsPreviousPositions[i] = temp;
						var prevPosition = states[currentStateIndex].morphismsPreviousPositions[i];
						var ptr = view.updateBezier(morphs[i], prevPosition);
						view.updateBezierLabel(morphs[i], prevPosition);
						morphs[i].setPoints([ptr.p0, ptr.p1, ptr.p2]);
						morphs[i].setCurvePath(ptr.curve.attr("d"));
						morphs[i].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					}
				}
				if (states[currentStateIndex].endomorphismsCurrentPositions.length === 0) {
					for (var i = 0; i < endos.length; i++) {
						var endomorphismCurrentPosition = endos[i].getHandlePosition();
						states[currentStateIndex].endomorphismsCurrentPositions.push(endomorphismCurrentPosition);
						var prevPosition = states[currentStateIndex].endomorphismsPreviousPositions[i];
						var ptr = view.updateEndomorphism(endos[i], prevPosition);
						view.updateEndomorphismLabel(endos[i], prevPosition);
						endos[i].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					}
				} else {
					for (var i = 0; i < endos.length; i++) {
						// var endomorphismCurrentPosition = endos[i].getHandlePosition();
						var temp = states[currentStateIndex].endomorphismsCurrentPositions[i];
						states[currentStateIndex].endomorphismsCurrentPositions[i] = states[currentStateIndex].endomorphismsPreviousPositions[i];
						states[currentStateIndex].endomorphismsPreviousPositions[i] = temp;
						var prevPosition = states[currentStateIndex].endomorphismsPreviousPositions[i];
						var ptr = view.updateEndomorphism(endos[i], prevPosition);
						view.updateEndomorphismLabel(endos[i], prevPosition);
						endos[i].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					}
				}
				break;
			case "pasteSelected":
				pasteCounter--;
				var objs = states[currentStateIndex].objects;
				var morphs = states[currentStateIndex].morphisms;
				var endos = states[currentStateIndex].endomorphisms;
				for (var i = 0; i < objs.length; i++) {
					hiddenElements.push({type: "object", element: objs[i]});
					view.hideCircle(objs[i]);
					objs[i].setVisible(false);
				}
				for (var i = 0; i < morphs.length; i++) {
					hiddenElements.push({type: "morphism", element: morphs[i]});
					view.hideBezier(morphs[i]);
					morphs[i].setVisible(false);
				}
				for (var i = 0; i < endos.length; i++) {
					hiddenElements.push({type: "endomorphism", element: endos[i]});
					view.hideEndomorphism(endos[i]);
					endos[i].setVisible(false);
				}
				break;
			case "moveMorphism":
				var morphs = states[currentStateIndex].morphisms;
				var endos = states[currentStateIndex].endomorphisms;
				if (morphs !== null) {
					if (states[currentStateIndex].morphismsCurrentPositions === null) {
						var morphismCurrentPosition = morphs.getHandlePosition();
						states[currentStateIndex].morphismsCurrentPositions = morphismCurrentPosition;
						var prevPosition = states[currentStateIndex].morphismsPreviousPositions;
						var ptr = view.updateBezier(morphs, prevPosition);
						view.updateBezierLabel(morphs, prevPosition);
						morphs.setPoints([ptr.p0, ptr.p1, ptr.p2]);
						morphs.setCurvePath(ptr.curve.attr("d"));
						morphs.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					} else {
						// var morphismCurrentPosition = morphs.getHandlePosition();
						var temp = states[currentStateIndex].morphismsCurrentPositions;
						states[currentStateIndex].morphismsCurrentPositions = states[currentStateIndex].morphismsPreviousPositions;
						states[currentStateIndex].morphismsPreviousPositions = temp;
						var prevPosition = states[currentStateIndex].morphismsPreviousPositions;
						var ptr = view.updateBezier(morphs, prevPosition);
						view.updateBezierLabel(morphs, prevPosition);
						morphs.setPoints([ptr.p0, ptr.p1, ptr.p2]);
						morphs.setCurvePath(ptr.curve.attr("d"));
						morphs.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					}
				} else if (endos !== null) {
					if (states[currentStateIndex].endomorphismsCurrentPositions === null) {
						var endomorphismCurrentPosition = endos.getHandlePosition();
						states[currentStateIndex].endomorphismsCurrentPositions = endomorphismCurrentPosition;
						var prevPosition = states[currentStateIndex].endomorphismsPreviousPositions;
						var ptr = view.updateEndomorphism(endos, prevPosition);
						view.updateEndomorphismLabel(endos, prevPosition);
						endos.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					} else {
						// var endomorphismCurrentPosition = endos.getHandlePosition();
						var temp = states[currentStateIndex].endomorphismsCurrentPositions;
						states[currentStateIndex].endomorphismsCurrentPositions = states[currentStateIndex].endomorphismsPreviousPositions;
						states[currentStateIndex].endomorphismsPreviousPositions = temp;
						var prevPosition = states[currentStateIndex].endomorphismsPreviousPositions;
						var ptr = view.updateEndomorphism(endos, prevPosition);
						view.updateEndomorphismLabel(endos, prevPosition);
						endos.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					}
				}
				break;
			case "updateMorphism":
				var morphism = states[currentStateIndex].morphisms;
				var prevAttr = states[currentStateIndex].previousAttributes;
				if (states[currentStateIndex].currentAttributes === null) {
					states[currentStateIndex].currentAttributes = morphism.getAll();
				}
				morphism.setAll(prevAttr);
				var position = morphism.getHandlePosition();
				view.changeBezierType(morphism);
				var ptr = view.updateBezier(morphism, position);
				view.updateBezierLabel(morphism, position);
				break;
			case "moveObject":
				var obj = states[currentStateIndex].objects;
				if (states[currentStateIndex].objectsCurrentPositions === null) {
					var objectCurrentPosition = obj.getPosition();
					states[currentStateIndex].objectsCurrentPositions = objectCurrentPosition;
					var prevPosition = states[currentStateIndex].objectsPreviousPositions;
					view.updateCircle(obj, prevPosition);
					view.updateCircleLabel(obj, prevPosition);
					obj.setPosition(prevPosition);
					var objectMorphisms = obj.getMorphisms();
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
								// var r = [m[0] - 2 * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var r = [m[0] - 2 * sign * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var ptr = view.updateBezier(objectMorphisms[k], r);
								view.updateBezierLabel(objectMorphisms[k], r);
								objectMorphisms[k].setPoints([ptr.p0, ptr.p1, ptr.p2]);
								objectMorphisms[k].setCurvePath(ptr.curve.attr("d"));
								objectMorphisms[k].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
								break;
							}
						}
					}
					var objectEndomorphisms = obj.getEndomorphisms();
					for (var j = 0; j < objectEndomorphisms.length; j++) {
						view.translateEndomorphism(objectEndomorphisms[j], prevPosition, objectCurrentPosition);
						view.translateEndomorphismLabel(objectEndomorphisms[j]);
					}
				} else {
					var objectCurrentPosition = obj.getPosition();
					var temp = states[currentStateIndex].objectsCurrentPositions;
					states[currentStateIndex].objectsCurrentPositions = states[currentStateIndex].objectsPreviousPositions;
					states[currentStateIndex].objectsPreviousPositions = temp;
					var prevPosition = states[currentStateIndex].objectsPreviousPositions;
					view.updateCircle(obj, prevPosition);
					view.updateCircleLabel(obj, prevPosition);
					obj.setPosition(prevPosition);
					var objectMorphisms = obj.getMorphisms();
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
								// var r = [m[0] - 2 * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var r = [m[0] - 2 * sign * (m[0] + j * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + j * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var ptr = view.updateBezier(objectMorphisms[k], r);
								view.updateBezierLabel(objectMorphisms[k], r);
								objectMorphisms[k].setPoints([ptr.p0, ptr.p1, ptr.p2]);
								objectMorphisms[k].setCurvePath(ptr.curve.attr("d"));
								objectMorphisms[k].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
								break;
							}
						}
					}
					var objectEndomorphisms = obj.getEndomorphisms();
					for (var j = 0; j < objectEndomorphisms.length; j++) {
						view.translateEndomorphism(objectEndomorphisms[j], prevPosition, objectCurrentPosition);
						view.translateEndomorphismLabel(objectEndomorphisms[j]);
					}
				}
				break;
			case "updateObject":
				var object = states[currentStateIndex].objects;
				var prevAttr = states[currentStateIndex].previousAttributes;
				if (states[currentStateIndex].currentAttributes === null) {
					states[currentStateIndex].currentAttributes = object.getAll();
				}
				object.setAll(prevAttr);
				view.changeCircleLabel(object);
				view.changeCirclePosition(object);
				view.changeCircleLabelPosition(object);
				var objectMorphisms = object.getMorphisms();
				for (var i = 0; i < objectMorphisms.length; i++) {
					var source = getObjectById(objectMorphisms[i].getSource());
					var target = getObjectById(objectMorphisms[i].getTarget());
					var m = [0.5 * (source.getX() + target.getX()), 0.5 * (source.getY() + target.getY())];
					var realAngleBetweenObjects = Math.realAngle(source.getPosition(), target.getPosition());
					var sign = Math.pow(-1, source.getId() > target.getId());
					// var r = [m[0] - 2 * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
					var r = [m[0] - 2 * sign * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
					view.changeBezier(objectMorphisms[i], r);
					view.changeBezierLabel(objectMorphisms[i], r);
				}
				var endomorphismsArray = object.getEndomorphisms();
				var angle = 360 / endomorphismsArray.length;
				for (var i = 0; i < endomorphismsArray.length; i++) {
					var x = object.getX() + Math.degCos(90 + i * angle);
					var y = object.getY() - Math.degSin(90 + i * angle);
					view.changeEndomorphism(endomorphismsArray[i], [x, y]);
					view.changeEndomorphismLabel(endomorphismsArray[i], [x, y]);
				}
				var endo = object.getEndomorphism(0);
				endo.setLabel("id" + object.getLabel());
				var pos = endo.getHandlePosition();
				view.changeEndomorphismLabel(endo, pos);
				break;
		}
		currentStateIndex--;
	}
	
	/*
	Save current state
	*/
	this.saveCurrentState = function() {
		console.log("saveCurrentState");
		if (savedStates.last() !== states.last()) {
			savedStates.push(states.last());
		}
	}
	
	/*
	Delete previous state
	*/
	this.deletePreviousState = function() {
		console.log("deletePreviousState");
		savedStates.pop();
	}
	
	this.getDoneActions = function() {return doneActions;};
	this.getUndoneActions = function() {return undoneActions;};
	this.getStates = function() {return states;};
}
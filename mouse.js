document.addEventListener("dragstart", function(e) {
	e.preventDefault();
});

$(document).bind("contextmenu", function(e) {
	e.preventDefault();
});

window.addEventListener("mousedown", function(e) {
	if (keyboardMouseStatus !== "menu open" && keyboardMouseStatus !== "input open") {
		if (focused && (0 < e.pageX-8 && e.pageX-8 < view.canvasWidth && 0 < e.pageY-8 && e.pageY-8 < view.canvasHeight)) {
			mousedownCoords = [e.pageX-8, e.pageY-8];
			
			listOfObjectsPressed = collider.getAllCirclesWithPointInside(mousedownCoords);
			listOfMorphismsPressed = collider.getAllHandlesWithPointInside(mousedownCoords);
			
			leftMousedownOnCanvas = false;
			leftMousedownOnMultiple = false;
			leftMousedownOnObject = false;
			leftMousedownOnEndomorphism = false;
			leftMousedownOnMorphism = false;
			
			rightMousedownOnCanvas = false;
			rightMousedownOnMultiple = false;
			rightMousedownOnObject = false;
			rightMousedownOnEndoMorphism = false;
			rightMousedownOnMorphism = false;
			
			if (e.which === 1) {
				if (listOfObjectsPressed.length === 0 && listOfMorphismsPressed.length === 0)							leftMousedownOnCanvas = true;
				else if (listOfObjectsPressed.length > 0 && listOfMorphismsPressed.length > 0)							leftMousedownOnMultiple = true;
				else if (listOfObjectsPressed.length === 1)																leftMousedownOnObject = true;
				else if (listOfMorphismsPressed.length === 1 && listOfMorphismsPressed[0].getType() === "endomorphism")	leftMousedownOnEndomorphism = true;
				else if (listOfMorphismsPressed.length === 1 && listOfMorphismsPressed[0].getType() !== "endomorphism")	leftMousedownOnMorphism = true;
			} else if (e.which === 3) {
				if (listOfObjectsPressed.length === 0 && listOfMorphismsPressed.length === 0)							rightMousedownOnCanvas = true;
				else if (listOfObjectsPressed.length > 0 && listOfMorphismsPressed.length > 0)							rightMousedownOnMultiple = true;
				else if (listOfObjectsPressed.length === 1)																rightMousedownOnObject = true;
				else if (listOfMorphismsPressed.length === 1 && listOfMorphismsPressed[0].getType() === "endomorphism")	rightMousedownOnEndoMorphism = true;
				else if (listOfMorphismsPressed.length === 1 && listOfMorphismsPressed[0].getType() !== "endomorphism")	rightMousedownOnMorphism = true;
			}
			
			if (e.which === 1) {
				switch (keyboardMouseStatus) {
					case "idle":
						if (leftMousedownOnCanvas) {
							keyboardMouseStatus = "rect start";
							// console.log("rect start");
							view.createSelectionRectangle(mousedownCoords);
						} else if (leftMousedownOnObject) {
							keyboardMouseStatus = "deselect all";
							// console.log("deselect all");
							deselectAll();
							if (new Date().getTime() > lastCreatedObjectTimestamp + DOUBLE_CLICK_TOLERANCE) {
								keyboardMouseStatus = "object update";
								// console.log("object update");
								mousemoveDeltas.push([listOfObjectsPressed[0].getPosition()[0] - mousemoveCoords[0], listOfObjectsPressed[0].getPosition()[1] - mousemoveCoords[1]]);
								view.selectCircle(listOfObjectsPressed[0]);
								listOfObjectsPressed[0].setSelected(true);
								var objectEndomorphisms = listOfObjectsPressed[0].getEndomorphisms();
								for (var i = 0; i < objectEndomorphisms.length; i++) {
									view.selectEndomorphism(objectEndomorphisms[i]);
									objectEndomorphisms[i].setSelected(true);
									console.log(objectEndomorphisms[i].getSelected());
								}
								// state.createState("moveObject");
								movingObjectLastPosition = listOfObjectsPressed[0].getPosition();
							} else {
								var id = listOfObjectsPressed[0].getId();
								keyboardMouseStatus = "object delete";
								// console.log("object delete");
								objectsCounter--;
								morphismsCounter--;
								view.deleteCircle(objectsCounter);
								view.deleteCircleLabel(objectsCounter);
								objects.pop();
								view.deleteEndomorphism(morphismsCounter);
								view.deleteEndomorphismLabel(morphismsCounter);
								morphisms.pop();
								state.createState("deleteObject");
								keyboardMouseStatus = "idle";
								// console.log("idle");
								lastCreatedObjectTimestamp = new Date().getTime();
							}
						} else if (leftMousedownOnEndomorphism) {
							keyboardMouseStatus = "deselect all";
							// console.log("deselect all");
							deselectAll();
							keyboardMouseStatus = "endomorphism update";
							// console.log("endomorphism update");
							mousemoveDeltas.push([listOfMorphismsPressed[0].getHandlePosition()[0] - mousemoveCoords[0], listOfMorphismsPressed[0].getHandlePosition()[1] - mousemoveCoords[1]]);
							view.selectEndomorphism(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(true);
							movingMorphismLastPosition = listOfMorphismsPressed[0].getHandlePosition();
						} else if (leftMousedownOnMorphism) {
							keyboardMouseStatus = "deselect all";
							// console.log("deselect all");
							deselectAll();
							keyboardMouseStatus = "morphism update";
							// console.log("morphism update");
							mousemoveDeltas.push([listOfMorphismsPressed[0].getHandlePosition()[0] - mousemoveCoords[0], listOfMorphismsPressed[0].getHandlePosition()[1] - mousemoveCoords[1]]);
							view.selectBezier(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(true);
							movingMorphismLastPosition = listOfMorphismsPressed[0].getHandlePosition();
						}
						break;
					case "ctrl":
						if (leftMousedownOnObject) {
							keyboardMouseStatus = "object select start";
							// console.log("object select start");
							selectedElements.push({type: "object", element: listOfObjectsPressed[0]});
							view.selectCircle(listOfObjectsPressed[0]);
							listOfObjectsPressed[0].setSelected(true);
							var idEndomorphism = listOfObjectsPressed[0].getEndomorphism(0);
							selectedElements.push({type: "endomorphism", element: idEndomorphism});
							view.selectEndomorphism(idEndomorphism);
							idEndomorphism.setSelected(true);
							// var endomorphisms = listOfObjectsPressed[0].getEndomorphisms();
							// for (var i = 0; i < endomorphisms.length; i++) {
								// selectedElements.push({type: "endomorphism", element: endomorphisms[i]});
								// view.selectEndomorphism(endomorphisms[i]);
								// endomorphisms[i].setSelected(true);
							// }
						} else if (leftMousedownOnEndomorphism) {
							keyboardMouseStatus = "endomorphism select start";
							// console.log("endomorphism select start");
							selectedElements.push({type: "endomorphism", element: listOfMorphismsPressed[0]});
							view.selectEndomorphism(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(true);
						} else if (leftMousedownOnMorphism) {
							keyboardMouseStatus = "morphism select start";
							// console.log("morphism select start");
							selectedElements.push({type: "morphism", element: listOfMorphismsPressed[0]});
							view.selectBezier(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(true);
						}
						break;
					case "shift":
						if (leftMousedownOnCanvas) {
							if (mousedownCoords[0] >= (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS) && mousedownCoords[0] <= (view.canvasWidth - (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS)) && mousedownCoords[1] >= (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS) && mousedownCoords[1] <= (view.canvasHeight - (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS))) {
								keyboardMouseStatus = "object create start";
								// console.log("object create start");
							}
						} else if (leftMousedownOnObject) {
							keyboardMouseStatus = "endomorphism or morphism create start";
							// console.log("endomorphism or morphism create start");
						}
						break;
					case "tab":
						keyboardMouseStatus = "drawing start";
						// console.log("drawing start");
						drawing.startDrawing(mousedownCoords);
						break;
					case "menu open":
						// if (fora) {
							// keyboardMouseStatus = "idle";
							// console.log("idle");
						// }
						break;
					case "idle with element(s) selected":
						if (leftMousedownOnCanvas) {
							keyboardMouseStatus = "deselect selected or rect start with element(s) selected";
							// console.log("deselect selected or rect start with element(s) selected");
							deselectAll();
						} else if (leftMousedownOnObject && listOfObjectsPressed[0].getSelected()) {
							keyboardMouseStatus = "selected drag";
							// console.log("selected drag");
							for (var i = 0; i < selectedElements.length; i++) {
								if (selectedElements[i].type === "object") {
									mousemoveDeltas.push([selectedElements[i].element.getPosition()[0] - mousemoveCoords[0], selectedElements[i].element.getPosition()[1] - mousemoveCoords[1]]);
								}
							}
							state.createState("dragSelected", selectedElements);
						} else if (leftMousedownOnEndomorphism && listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "selected drag";
							// console.log("selected drag");
							for (var i = 0; i < selectedElements.length; i++) {
								if (selectedElements[i].type === "object") {
									mousemoveDeltas.push([selectedElements[i].element.getPosition()[0] - mousemoveCoords[0], selectedElements[i].element.getPosition()[1] - mousemoveCoords[1]]);
								}
							}
							state.createState("dragSelected", selectedElements);
						} else if (leftMousedownOnMorphism && listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "selected drag";
							// console.log("selected drag");
							for (var i = 0; i < selectedElements.length; i++) {
								if (selectedElements[i].type === "object") {
									mousemoveDeltas.push([selectedElements[i].element.getPosition()[0] - mousemoveCoords[0], selectedElements[i].element.getPosition()[1] - mousemoveCoords[1]]);
								}
							}
							state.createState("dragSelected", selectedElements);
						} else if (leftMousedownOnObject && !listOfObjectsPressed[0].getSelected()) {
							keyboardMouseStatus = "deselect all";
							// console.log("deselect all");
							deselectAll();
							keyboardMouseStatus = "object update";
							// console.log("object update");
							mousemoveDeltas.push([listOfObjectsPressed[0].getPosition()[0] - mousemoveCoords[0], listOfObjectsPressed[0].getPosition()[1] - mousemoveCoords[1]]);
							view.selectCircle(listOfObjectsPressed[0]);
							listOfObjectsPressed[0].setSelected(true);
							var objectEndomorphisms = listOfObjectsPressed[0].getEndomorphisms();
							for (var i = 0; i < objectEndomorphisms.length; i++) {
								view.selectEndomorphism(objectEndomorphisms[i]);
								objectEndomorphisms[i].setSelected(true);
							}
							// state.createState("moveObject");
						} else if (leftMousedownOnEndomorphism && !listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "deselect all";
							// console.log("deselect all");
							deselectAll();
							keyboardMouseStatus = "endomorphism update";
							// console.log("endomorphism update");
							var ptr = view.updateEndomorphism(listOfMorphismsPressed[0], mousedownCoords);
							view.updateEndomorphismLabel(listOfMorphismsPressed[0], mousedownCoords);
							view.selectEndomorphism(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
							listOfMorphismsPressed[0].setSelected(true);
							// state.createState("updateEndomorphism");
						} else if (leftMousedownOnMorphism && !listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "deselect all";
							// console.log("deselect all");
							deselectAll();
							keyboardMouseStatus = "morphism update";
							// console.log("morphism update");
							var ptr = view.updateBezier(listOfMorphismsPressed[0], mousedownCoords);
							view.updateBezierLabel(listOfMorphismsPressed[0], mousedownCoords);
							view.selectBezier(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setPoints([ptr.p0, ptr.p1, ptr.p2]);
							listOfMorphismsPressed[0].setCurvePath(ptr.curve.attr("d"));
							listOfMorphismsPressed[0].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
							listOfMorphismsPressed[0].setSelected(true);
							// state.createState("moveMorphism");
						}
						break;
					case "ctrl with element(s) selected":
						if (leftMousedownOnObject && !listOfObjectsPressed[0].getSelected()) {
							keyboardMouseStatus = "object select start with element(s) selected";
							// console.log("object select start with element(s) selected");
							selectedElements.push({type: "object", element: listOfObjectsPressed[0]});
							view.selectCircle(listOfObjectsPressed[0]);
							listOfObjectsPressed[0].setSelected(true);
							var idEndomorphism = listOfObjectsPressed[0].getEndomorphism(0);
							selectedElements.push({type: "endomorphism", element: idEndomorphism});
							view.selectEndomorphism(idEndomorphism);
							idEndomorphism.setSelected(true);
						} else if (leftMousedownOnEndomorphism && !listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "endomorphism select start with element(s) selected";
							// console.log("endomorphism select start with element(s) selected");
							selectedElements.push({type: "endomorphism", element: listOfMorphismsPressed[0]});
							view.selectEndomorphism(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(true);
						} else if (leftMousedownOnMorphism && !listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "morphism select start with element(s) selected";
							// console.log("morphism select start with element(s) selected");
							selectedElements.push({type: "morphism", element: listOfMorphismsPressed[0]});
							view.selectBezier(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(true);
						} else if (leftMousedownOnObject && listOfObjectsPressed[0].getSelected()) {
							keyboardMouseStatus = "object deselect start with element(s) selected";
							// console.log("object deselect start with element(s) selected");
							console.log(selectedElements);
							selectedElements.remove(listOfObjectsPressed[0]);
							console.log(selectedElements);
							view.deselectCircle(listOfObjectsPressed[0]);
							listOfObjectsPressed[0].setSelected(false);
							var idEndomorphism = listOfObjectsPressed[0].getEndomorphism(0);
							selectedElements.remove(idEndomorphism);
							view.deselectEndomorphism(idEndomorphism);
							idEndomorphism.setSelected(false);
						} else if (leftMousedownOnEndomorphism && listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "endomorphism deselect start with element(s) selected";
							// console.log("endomorphism deselect start with element(s) selected");
							selectedElements.remove(listOfMorphismsPressed[0]);
							view.deselectEndomorphism(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(false);
						} else if (leftMousedownOnMorphism && listOfMorphismsPressed[0].getSelected()) {
							keyboardMouseStatus = "morphism deselect start with element(s) selected";
							console.log("morphism deselect start with element(s) selected");
							selectedElements.remove(listOfMorphismsPressed[0]);
							view.deselectBezier(listOfMorphismsPressed[0]);
							listOfMorphismsPressed[0].setSelected(false);
						}
						break;
					case "tab with element(s) selected":
						keyboardMouseStatus = "drawing start with element(s) selected";
						console.log("drawing start with element(s) selected");
						break;
				}
			}
		}
	}
});

window.addEventListener("mousemove", function(e) {
	if (focused) {
		mousemoveCoords = [e.pageX-8, e.pageY-8];
		
		if (e.which === 1) {
			switch (keyboardMouseStatus) {
				case "drawing start":
					keyboardMouseStatus = "drawing update";
					// console.log("drawing update");
					drawing.updateDrawing(mousemoveCoords);
					break;
				case "drawing update":
					keyboardMouseStatus = "drawing update";
					// console.log("drawing update");
					drawing.updateDrawing(mousemoveCoords);
					break;
				case "rect start":
					keyboardMouseStatus = "rect update";
					// console.log("rect update");
					view.updateSelectionRectangle(mousedownCoords, mousemoveCoords);
					break;
				case "rect update":
					keyboardMouseStatus = "rect update";
					// console.log("rect update");
					view.updateSelectionRectangle(mousedownCoords, mousemoveCoords);
					break;
				case "deselect selected or rect start with element(s) selected":
					keyboardMouseStatus = "rect start with element(s) selected";
					// console.log("rect start with element(s) selected");
					view.createSelectionRectangle(mousedownCoords);
					break;
				case "endomorphism select start":
					keyboardMouseStatus = "ctrl";
					// console.log("ctrl");
					selectedElements.remove(listOfMorphismsPressed[0]);
					view.deselectEndomorphism(listOfMorphismsPressed[0]);
					listOfMorphismsPressed[0].setSelected(false);
					break;
				case "morphism select start":
					keyboardMouseStatus = "ctrl";
					// console.log("ctrl");
					selectedElements.remove(listOfMorphismsPressed[0]);
					view.deselectBezier(listOfMorphismsPressed[0]);
					listOfMorphismsPressed[0].setSelected(false);
					break;
				case "endomorphism update":
					keyboardMouseStatus = "endomorphism update";
					// console.log("endomorphism update");
					mousemoveCoords[0] += mousemoveDeltas[0][0];
					mousemoveCoords[1] += mousemoveDeltas[0][1];
					var ptr = view.updateEndomorphism(listOfMorphismsPressed[0], mousemoveCoords);
					view.updateEndomorphismLabel(listOfMorphismsPressed[0], mousemoveCoords);
					listOfMorphismsPressed[0].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
					// state.createState("updateEndomorphism");
					break;
				case "morphism update":
					keyboardMouseStatus = "morphism update";
					// console.log("morphism update");
					var collides = false;
					if (CHECK_COLLISION_ON_MOUSE_MOVE) {
						for (var i = 0; i < objects.length; i++) {
							if (collider.circlesIntersect(mousemoveCoords[0], mousemoveCoords[1], DEFAULT_HANDLE_RADIUS, objects[i].getX(), objects[i].getY(), objects[i].getRadius())) {
								collides = true;
								break;
							}
						}
						if (!collides) {
							for (var i = 0; i < morphisms.length; i++) {
								if (collider.circlesIntersect(mousemoveCoords[0], mousemoveCoords[1], DEFAULT_HANDLE_RADIUS, morphisms[i].getHandlePosition()[0], morphisms[i].getHandlePosition()[1], DEFAULT_HANDLE_RADIUS)) {
									collides = true;
									break;
								}
							}
						}
					}
					if (!collides) {
						mousemoveCoords[0] += mousemoveDeltas[0][0];
						mousemoveCoords[1] += mousemoveDeltas[0][1];
						if (mousemoveCoords[0] < SELECTED_HANDLE_RADIUS) mousemoveCoords[0] = SELECTED_HANDLE_RADIUS;
						if (mousemoveCoords[1] < SELECTED_HANDLE_RADIUS) mousemoveCoords[1] = SELECTED_HANDLE_RADIUS;
						if (mousemoveCoords[0] > view.canvasWidth - SELECTED_HANDLE_RADIUS) mousemoveCoords[0] = view.canvasWidth - SELECTED_HANDLE_RADIUS;
						if (mousemoveCoords[1] > view.canvasHeight - SELECTED_HANDLE_RADIUS) mousemoveCoords[1] = view.canvasHeight - SELECTED_HANDLE_RADIUS;
						var ptr = view.updateBezier(listOfMorphismsPressed[0], mousemoveCoords);
						view.updateBezierLabel(listOfMorphismsPressed[0], mousemoveCoords);
						listOfMorphismsPressed[0].setPoints([ptr.p0, ptr.p1, ptr.p2]);
						listOfMorphismsPressed[0].setCurvePath(ptr.curve.attr("d"));
						listOfMorphismsPressed[0].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
						// state.createState("moveMorphism");
					}
					break;
				case "object create start":
					keyboardMouseStatus = "idle";
					// console.log("idle");
					break;
				case "object select start":
					keyboardMouseStatus = "ctrl";
					// console.log("ctrl");
					selectedElements.remove(listOfObjectsPressed[0]);
					view.deselectCircle(listOfObjectsPressed[0]);
					listOfObjectsPressed[0].setSelected(false);
					var endomorphisms = listOfObjectsPressed[0].getEndomorphisms();
					for (var i = 0; i < endomorphisms.length; i++) {
						selectedElements.remove(endomorphisms[i]);
						view.deselectEndomorphism(endomorphisms[i]);
						endomorphisms[i].setSelected(false);
					}
					break;
				case "object update":
					keyboardMouseStatus = "object update";
					// console.log("object update");
					var objectPreviousPosition = listOfObjectsPressed[0].getPosition();
					mousemoveCoords[0] += mousemoveDeltas[0][0];
					mousemoveCoords[1] += mousemoveDeltas[0][1];
					if (mousemoveCoords[0] < LIMIT) mousemoveCoords[0] = LIMIT;
					if (mousemoveCoords[1] < LIMIT) mousemoveCoords[1] = LIMIT;
					if (mousemoveCoords[0] > view.canvasWidth - LIMIT) mousemoveCoords[0] = view.canvasWidth - LIMIT;
					if (mousemoveCoords[1] > view.canvasHeight - LIMIT) mousemoveCoords[1] = view.canvasHeight - LIMIT;
					view.updateCircle(listOfObjectsPressed[0], mousemoveCoords);
					view.updateCircleLabel(listOfObjectsPressed[0], mousemoveCoords);
					listOfObjectsPressed[0].setPosition(mousemoveCoords);
					view.selectCircle(listOfObjectsPressed[0], mousemoveCoords);
					var objectMorphisms = listOfObjectsPressed[0].getMorphisms();
					for (var i = 0; i < objectMorphisms.length; i++) {
						var source = getObjectById(objectMorphisms[i].getSource());
						var target = getObjectById(objectMorphisms[i].getTarget());
						var ptr = view.translateBezier(objectMorphisms[i]);
						console.log(objectMorphisms[i].getId());
						view.translateBezierLabel(objectMorphisms[i]);
						for (var j = 0; j < objectMorphisms.length; j++) {
							if (objectMorphisms[j] === objectMorphisms[i]) {
								var m = [0.5 * (source.getX() + target.getX()), 0.5 * (source.getY() + target.getY())];
								var realAngleBetweenObjects = Math.realAngle(source.getPosition(), target.getPosition());
								var sign = Math.pow(-1, source.getId() > target.getId());
								// var r = [m[0] - 2 * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var r = [m[0] - 2 * sign * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
								var ptr = view.updateBezier(objectMorphisms[j], r);
								view.updateBezierLabel(objectMorphisms[j], r);
								view.deselectBezier(objectMorphisms[j]);
								objectMorphisms[j].setPoints([ptr.p0, ptr.p1, ptr.p2]);
								objectMorphisms[j].setCurvePath(ptr.curve.attr("d"));
								objectMorphisms[j].setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
								break;
							}
						}
					}
					var objectEndomorphisms = listOfObjectsPressed[0].getEndomorphisms();
					for (var i = 0; i < objectEndomorphisms.length; i++) {
						view.translateEndomorphism(objectEndomorphisms[i], mousemoveCoords, objectPreviousPosition);
						view.translateEndomorphismLabel(objectEndomorphisms[i]);
					}
					// state.createState("moveObject");
					break;
				case "selected drag":
					keyboardMouseStatus = "selected drag";
					// console.log("selected drag");
					dragSelected(mousemoveDeltas);
					break;
				case "drawing start with element(s) selected":
					keyboardMouseStatus = "drawing update with element(s) selected";
					// console.log("drawing update with element(s) selected");
					drawing.updateDrawing(mousemoveCoords);
					break;
				case "drawing update with element(s) selected":
					keyboardMouseStatus = "drawing update with element(s) selected";
					// console.log("drawing update with element(s) selected");
					drawing.updateDrawing(mousemoveCoords);
					break;
				case "rect start with element(s) selected":
					keyboardMouseStatus = "rect update with element(s) selected";
					// console.log("rect update with element(s) selected");
					view.updateSelectionRectangle(mousedownCoords, mousemoveCoords);
					break;
				case "rect update with element(s) selected":
					keyboardMouseStatus = "rect update with element(s) selected";
					// console.log("rect update with element(s) selected");
					view.updateSelectionRectangle(mousedownCoords, mousemoveCoords);
					break;
				case "object select start with element(s) selected":
					keyboardMouseStatus = "ctrl with element(s) selected";
					console.log("ctrl with element(s) selected");
					if (listOfObjectsPressed[0].getSelected()) {
						selectedElements.remove(listOfObjectsPressed[0]);
						view.deselectCircle(listOfObjectsPressed[0]);
						listOfObjectsPressed[0].setSelected(false);
					} else {
						selectedElements.push({type: "object", element: listOfObjectsPressed[0]});
						view.selectCircle(listOfObjectsPressed[0]);
						listOfObjectsPressed[0].setSelected(true);
					}
					break;
				case "endomorphism select start with element(s) selected":
					keyboardMouseStatus = "ctrl with element(s) selected";
					console.log("ctrl with element(s) selected");
					if (listOfMorphismsPressed[0].getSelected()) {
						selectedElements.remove(listOfMorphismsPressed[0]);
						view.deselectEndomorphism(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(false);
					} else {
						selectedElements.push({type: "endomorphism", element: listOfMorphismsPressed[0]});
						view.selectEndomorphism(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(true);
					}
					break;
				case "morphism select start with element(s) selected":
					keyboardMouseStatus = "ctrl with element(s) selected";
					console.log("ctrl with element(s) selected");
					if (listOfMorphismsPressed[0].getSelected()) {
						selectedElements.remove(listOfMorphismsPressed[0]);
						view.deselectBezier(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(false);
					} else {
						selectedElements.push({type: "morphism", element: listOfMorphismsPressed[0]});
						view.selectBezier(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(true);
					}
					break;
				case "object deselect start with element(s) selected":
					keyboardMouseStatus = "ctrl with element(s) selected";
					console.log("ctrl with element(s) selected");
					if (listOfObjectsPressed[0].getSelected()) {
						selectedElements.remove(listOfObjectsPressed[0]);
						view.deselectCircle(listOfObjectsPressed[0]);
						listOfObjectsPressed[0].setSelected(false);
					} else {
						selectedElements.push({type: "object", element: listOfObjectsPressed[0]});
						view.selectCircle(listOfObjectsPressed[0]);
						listOfObjectsPressed[0].setSelected(true);
					}
					break;
				case "endomorphism deselect start with element(s) selected":
					keyboardMouseStatus = "ctrl with element(s) selected";
					console.log("ctrl with element(s) selected");
					if (listOfMorphismsPressed[0].getSelected()) {
						selectedElements.remove(listOfMorphismsPressed[0]);
						view.deselectEndomorphism(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(false);
					} else {
						selectedElements.push({type: "endomorphism", element: listOfMorphismsPressed[0]});
						view.selectEndomorphism(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(true);
					}
					break;
				case "morphism deselect start with element(s) selected":
					keyboardMouseStatus = "ctrl with element(s) selected";
					console.log("ctrl with element(s) selected");
					if (listOfMorphismsPressed[0].getSelected()) {
						selectedElements.remove(listOfMorphismsPressed[0]);
						view.deselectBezier(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(false);
					} else {
						selectedElements.push({type: "morphism", element: listOfMorphismsPressed[0]});
						view.selectBezier(listOfMorphismsPressed[0]);
						listOfMorphismsPressed[0].setSelected(true);
					}
					break;
			}
		}
	}
});

window.addEventListener("mouseup", function(e) {
	if (focused) {
		mouseupCoords = [e.pageX-8, e.pageY-8];
		
		if (e.which === 1) {
			switch (keyboardMouseStatus) {
				case "drawing start":
					keyboardMouseStatus = "tab";
					console.log("tab");
					break;
				case "drawing update":
					keyboardMouseStatus = "drawing stop";
					// console.log("drawing stop");
					drawing.stopDrawing();
					keyboardMouseStatus = "tab";
					// console.log("tab");
					break;
				case "rect start":
					keyboardMouseStatus = "rect stop";
					// console.log("rect stop");
					view.deleteSelectionRectangle();
					var objectsSelected = collider.getAllCirclesInsideArea(mousedownCoords, mouseupCoords);
					var morphismsSelected = collider.getAllHandlesInsideArea(mousedownCoords, mouseupCoords);
					for (var i = 0; i < objectsSelected.length; i++) {
						selectedElements.push({type: "object", element: objectsSelected[i]});
						view.selectCircle(objectsSelected[i]);
						objectsSelected[i].setSelected(true);
					}
					for (var i = 0; i < morphismsSelected.length; i++) {
						if (morphismsSelected[i].getType() !== "endomorphism") {
							selectedElements.push({type: "morphism", element: morphismsSelected[i]});
							view.selectBezier(morphismsSelected[i]);
						} else {
							selectedElements.push({type: "endomorphism", element: morphismsSelected[i]});
							view.selectEndomorphism(morphismsSelected[i]);
						}
						morphismsSelected[i].setSelected(true);
					}
					if (selectedElements.length > 0) {
						keyboardMouseStatus = "idle with element(s) selected";
						// console.log("idle with element(s) selected");
					} else {
						keyboardMouseStatus = "idle";
						// console.log("idle");
					}
					break;
				case "rect update":
					keyboardMouseStatus = "rect stop";
					// console.log("rect stop");
					view.deleteSelectionRectangle();
					var objectsSelected = collider.getAllCirclesInsideArea(mousedownCoords, mouseupCoords);
					var morphismsSelected = collider.getAllHandlesInsideArea(mousedownCoords, mouseupCoords);
					for (var i = 0; i < objectsSelected.length; i++) {
						selectedElements.push({type: "object", element: objectsSelected[i]});
						view.selectCircle(objectsSelected[i]);
						objectsSelected[i].setSelected(true);
					}
					for (var i = 0; i < morphismsSelected.length; i++) {
						if (morphismsSelected[i].getType() !== "endomorphism") {
							selectedElements.push({type: "morphism", element: morphismsSelected[i]});
							view.selectBezier(morphismsSelected[i]);
						} else {
							selectedElements.push({type: "endomorphism", element: morphismsSelected[i]});
							view.selectEndomorphism(morphismsSelected[i]);
						}
						morphismsSelected[i].setSelected(true);
					}
					if (selectedElements.length > 0) {
						keyboardMouseStatus = "idle with element(s) selected";
						// console.log("idle with element(s) selected");
					} else {
						keyboardMouseStatus = "idle";
						// console.log("idle");
					}
					break;
				case "deselect selected or rect start with element(s) selected":
					keyboardMouseStatus = "deselect selected";
					// console.log("deselect selected");
					for (var i = 0; i < selectedElements.length; i++) {
						if (selectedElements[i].type === "object") {
							view.deselectCircle(selectedElements[i].element);
							selectedElements[i].element.setSelected(false);
						} else if (selectedElements[i].type === "morphism") {
							view.deselectBezier(selectedElements[i].element);
							selectedElements[i].element.setSelected(false);
						}
					}
					selectedElements = [];
					keyboardMouseStatus = "idle";
					// console.log("idle");
					break;
				case "endomorphism or morphism create start":
					keyboardMouseStatus = "endomorphism or morphism create stop";
					// console.log("endomorphism or morphism create stop");
					var sources = collider.getAllCirclesWithPointInside(mousedownCoords);
					var targets = collider.getAllCirclesWithPointInside(mouseupCoords);
					if (sources.length === 1 && targets.length === 1) {
						if (sources[0] === targets[0]) {
							var now = new Date().getTime();
							if (now > lastCreatedEndomorphismTimestamp + DOUBLE_CLICK_TOLERANCE && now > lastCreatedObjectTimestamp + DOUBLE_CLICK_TOLERANCE) {
								// console.log("endomorphism create");
								var ptr = view.createEndomorphism(sources[0], targets[0].getRadius(), 270);
								view.createEndomorphismLabel(ptr.handle);
								var newMorphism = new Morphism(sources[0].getId(), targets[0].getId(), "endomorphism", false, ptr);
								morphisms.push(newMorphism);
								sources[0].addEndomorphism(newMorphism);
								morphismsCounter++;
								var endomorphismsArray = sources[0].getEndomorphisms();
								var endosToRemove = [];
								for (var i = 0; i < endomorphismsArray.length; i++) {
									if (!endomorphismsArray[i].getVisible()) {
										endosToRemove.push(endomorphismsArray[i]);
									}
								}
								for (var i = 0; i < endosToRemove.length; i++) {
									var id = endosToRemove[i].getId();
									view.deleteEndomorphism(id);
									view.deleteEndomorphismLabel(id);
									endomorphismsArray.remove(endosToRemove[i]);
								}
								var angle = 360 / endomorphismsArray.length;
								for (var i = 0; i < endomorphismsArray.length; i++) {
									var x = sources[0].getX() + Math.degCos(90 + i * angle);
									var y = sources[0].getY() - Math.degSin(90 + i * angle);
									view.updateEndomorphism(endomorphismsArray[i], [x, y]);
									view.updateEndomorphismLabel(endomorphismsArray[i], [x, y]);
								}
								state.createState("createEndomorphism", [newMorphism]);
								lastCreatedEndomorphismTimestamp = new Date().getTime();
							} else {
								if (listOfObjectsPressed[0].getEndomorphisms().length > 1) {
									var id = listOfObjectsPressed[0].getId();
									keyboardMouseStatus = "endomorphism delete";
									// console.log("endomorphism delete");
									morphismsCounter--;
									view.deleteEndomorphism(morphismsCounter);
									view.deleteEndomorphismLabel(morphismsCounter);
									morphisms.pop();
									listOfObjectsPressed[0].popEndomorphism();
									var endomorphismsArray = sources[0].getEndomorphisms();
									var angle = 360 / endomorphismsArray.length;
									for (var i = 0; i < endomorphismsArray.length; i++) {
										var x = sources[0].getX() + Math.degCos(90 + i * angle);
										var y = sources[0].getY() - Math.degSin(90 + i * angle);
										view.updateEndomorphism(endomorphismsArray[i], [x, y]);
										view.updateEndomorphismLabel(endomorphismsArray[i], [x, y]);
									}
									state.createState("deleteEndomorphism");
									lastCreatedEndomorphismTimestamp = new Date().getTime();
								}
							}
						} else {
							var newMorphism = new Morphism(sources[0].getId(), targets[0].getId(), currentMorphismType, false, ptr);
							newMorphism = morphismCreate(sources[0], targets[0], newMorphism.getType());
							state.createState("createMorphism", [newMorphism]);
						}
					}
					keyboardMouseStatus = "shift";
					// console.log("shift");
					break;
				case "endomorphism select start":
					keyboardMouseStatus = "endomorphism select stop";
					// console.log("endomorphism select stop");
					keyboardMouseStatus = "ctrl with element(s) selected";
					// console.log("ctrl with element(s) selected");
					break;
				case "morphism select start":
					keyboardMouseStatus = "morphism select stop";
					// console.log("morphism select stop");
					keyboardMouseStatus = "ctrl with element(s) selected";
					// console.log("ctrl with element(s) selected");
					break;
				case "endomorphism update":
					keyboardMouseStatus = "idle";
					// console.log("idle");
					view.deselectEndomorphism(listOfMorphismsPressed[0]);
					listOfMorphismsPressed[0].setSelected(false);
					if (!listOfMorphismsPressed[0].getHandlePosition().equals(movingMorphismLastPosition)) {
						state.createState("moveMorphism", listOfMorphismsPressed[0]);
					}
					break;
				case "morphism update":
					keyboardMouseStatus = "idle";
					// console.log("idle");
					view.deselectBezier(listOfMorphismsPressed[0]);
					listOfMorphismsPressed[0].setSelected(false);
					if (!listOfMorphismsPressed[0].getHandlePosition().equals(movingMorphismLastPosition)) {
						state.createState("moveMorphism", listOfMorphismsPressed[0]);
					}
					break;
				case "object create start":
					keyboardMouseStatus = "object create stop";
					// console.log("object create stop");
					objectCreate(mouseupCoords);
					keyboardMouseStatus = "idle";
					// console.log("idle");
					break;
				case "object select start":
					keyboardMouseStatus = "morphism select stop";
					// console.log("morphism select stop");
					keyboardMouseStatus = "ctrl with element(s) selected";
					// console.log("ctrl with element(s) selected");
					break;
				case "object update":
					keyboardMouseStatus = "idle";
					// console.log("idle");
					view.deselectCircle(listOfObjectsPressed[0]);
					listOfObjectsPressed[0].setSelected(false);
					var objectEndomorphisms = listOfObjectsPressed[0].getEndomorphisms();
					for (var i = 0; i < objectEndomorphisms.length; i++) {
						view.deselectEndomorphism(objectEndomorphisms[i]);
						objectEndomorphisms[i].setSelected(false);
						console.log(objectEndomorphisms[i].getSelected());
					}
					state.createState("moveObject", listOfObjectsPressed[0]);
					mousemoveDeltas.pop();
					movingObjectLastPosition = null;
					break;
				case "selected drag":
					keyboardMouseStatus = "idle with element(s) selected";
					// console.log("idle with element(s) selected");
					mousemoveDeltas = [];
					break;
				case "drawing start with element(s) selected":
					keyboardMouseStatus = "tab with element(s) selected";
					console.log("tab with element(s) selected");
					break;
				case "drawing update with element(s) selected":
					keyboardMouseStatus = "drawing stop with element(s) selected";
					// console.log("drawing stop with element(s) selected");
					drawing.stopDrawing();
					keyboardMouseStatus = "tab with element(s) selected";
					// console.log("tab with element(s) selected");
					break;
				case "rect start with element(s) selected":
					keyboardMouseStatus = "rect stop with element(s) selected";
					console.log("rect stop with element(s) selected");
					view.deleteSelectionRectangle();
					var objectsSelected = collider.getAllCirclesInsideArea(mousedownCoords, mouseupCoords);
					var morphismsSelected = collider.getAllHandlesInsideArea(mousedownCoords, mouseupCoords);
					for (var i = 0; i < objectsSelected.length; i++) {
						selectedElements.push({type: "object", element: objectsSelected[i]});
						view.selectCircle(objectsSelected[i]);
						objectsSelected[i].setSelected(true);
					}
					for (var i = 0; i < morphismsSelected.length; i++) {
						if (morphismsSelected[i].getType() !== "endomorphism") {
							selectedElements.push({type: "morphism", element: morphismsSelected[i]});
							view.selectBezier(morphismsSelected[i]);
						} else {
							selectedElements.push({type: "endomorphism", element: morphismsSelected[i]});
							view.selectEndomorphism(morphismsSelected[i]);
						}
						morphismsSelected[i].setSelected(true);
					}
					if (selectedElements.length > 0) {
						keyboardMouseStatus = "idle with element(s) selected";
						// console.log("idle with element(s) selected");
					} else {
						keyboardMouseStatus = "idle";
						// console.log("idle");
					}
					break;
				case "rect update with element(s) selected":
					keyboardMouseStatus = "rect stop with element(s) selected";
					// console.log("rect stop with element(s) selected");
					view.deleteSelectionRectangle();
					var objectsSelected = collider.getAllCirclesInsideArea(mousedownCoords, mouseupCoords);
					var morphismsSelected = collider.getAllHandlesInsideArea(mousedownCoords, mouseupCoords);
					for (var i = 0; i < objectsSelected.length; i++) {
						selectedElements.push({type: "object", element: objectsSelected[i]});
						view.selectCircle(objectsSelected[i]);
						objectsSelected[i].setSelected(true);
					}
					for (var i = 0; i < morphismsSelected.length; i++) {
						if (morphismsSelected[i].getType() !== "endomorphism") {
							selectedElements.push({type: "morphism", element: morphismsSelected[i]});
							view.selectBezier(morphismsSelected[i]);
						} else {
							selectedElements.push({type: "endomorphism", element: morphismsSelected[i]});
							view.selectEndomorphism(morphismsSelected[i]);
						}
						morphismsSelected[i].setSelected(true);
					}
					if (selectedElements.length > 0) {
						keyboardMouseStatus = "idle with element(s) selected";
						// console.log("idle with element(s) selected");
					} else {
						keyboardMouseStatus = "idle";
						// console.log("idle");
					}
					break;
				case "object select start with element(s) selected":
					keyboardMouseStatus = "object select stop with element(s) selected";
					// console.log("object select stop with element(s) selected");
					keyboardMouseStatus = "ctrl with element(s) selected";
					// console.log("ctrl with element(s) selected");
					break;
				case "endomorphism select start with element(s) selected":
					keyboardMouseStatus = "endomorphism select stop with element(s) selected";
					// console.log("endomorphism select stop with element(s) selected");
					keyboardMouseStatus = "ctrl with element(s) selected";
					// console.log("ctrl with element(s) selected");
					break;
				case "morphism select start with element(s) selected":
					keyboardMouseStatus = "morphism select stop with element(s) selected";
					// console.log("morphism select stop with element(s) selected");
					keyboardMouseStatus = "ctrl with element(s) selected";
					// console.log("ctrl with element(s) selected");
					break;
				case "object deselect start with element(s) selected":
					keyboardMouseStatus = "object deselect stop with element(s) selected";
					console.log("object deselect stop with element(s) selected");
					if (selectedElements.length > 0) {
						keyboardMouseStatus = "ctrl with element(s) selected";
						console.log("ctrl with element(s) selected");
					} else {
						keyboardMouseStatus = "ctrl";
						console.log("ctrl");
					}
					break;
				case "endomorphism deselect start with element(s) selected":
					keyboardMouseStatus = "endomorphism deselect stop with element(s) selected";
					console.log("endomorphism deselect stop with element(s) selected");
					if (selectedElements.length > 0) {
						keyboardMouseStatus = "ctrl with element(s) selected";
						console.log("ctrl with element(s) selected");
					} else {
						keyboardMouseStatus = "ctrl";
						console.log("ctrl");
					}
					break;
				case "morphism deselect start with element(s) selected":
					keyboardMouseStatus = "morphism deselect stop with element(s) selected";
					console.log("morphism deselect stop with element(s) selected");
					if (selectedElements.length > 0) {
						keyboardMouseStatus = "ctrl with element(s) selected";
						console.log("ctrl with element(s) selected");
					} else {
						keyboardMouseStatus = "ctrl";
						console.log("ctrl");
					}
					break;
			}
		} else if (e.which === 3) {
			switch (keyboardMouseStatus) {
				case "idle":
					keyboardMouseStatus = "menu open";
					// console.log("menu open");
					if (rightMousedownOnCanvas) {
						menuOpen = true;
						menuCode = CANVAS_MENU;
						$("#canvasMenu").css("left", e.pageX);
						$("#canvasMenu").css("top", e.pageY);
						var x = Number($("#canvasMenu").css("left").slice(0, -2));
						var y = Number($("#canvasMenu").css("top").slice(0, -2));
						var w = Number($("#canvasMenu").css("width").slice(0, -2));
						var h = Number($("#canvasMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						console.log(x, y, w, h);
						$("#canvasMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#canvasMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle";
									// console.log("idle");
								}
							}
						});
						rightMousedownOnCanvas = false;
					} else if (rightMousedownOnObject) {
						menuOpen = true;
						menuCode = OBJECT_MENU;
						$("#objectMenu").css("left", e.pageX);
						$("#objectMenu").css("top", e.pageY);
						var x = Number($("#objectMenu").css("left").slice(0, -2));
						var y = Number($("#objectMenu").css("top").slice(0, -2));
						var w = Number($("#objectMenu").css("width").slice(0, -2));
						var h = Number($("#objectMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						$("#objectMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#objectMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle";
									// console.log("idle");
								}
							}
						});
						rightMousedownOnObject = false;
					} else if (rightMousedownOnEndoMorphism) {
						menuOpen = true;
						menuCode = MORPHISM_MENU;
						$("#morphismMenu").css("left", e.pageX);
						$("#morphismMenu").css("top", e.pageY);
						var x = Number($("#morphismMenu").css("left").slice(0, -2));
						var y = Number($("#morphismMenu").css("top").slice(0, -2));
						var w = Number($("#morphismMenu").css("width").slice(0, -2));
						var h = Number($("#morphismMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						$("#morphismMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#morphismMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle";
									// console.log("idle");
								}
							}
						});
						rightMousedownOnEndoMorphism = false;
					} else if (rightMousedownOnMorphism) {
						menuOpen = true;
						menuCode = MORPHISM_MENU;
						$("#morphismMenu").css("left", e.pageX);
						$("#morphismMenu").css("top", e.pageY);
						var x = Number($("#morphismMenu").css("left").slice(0, -2));
						var y = Number($("#morphismMenu").css("top").slice(0, -2));
						var w = Number($("#morphismMenu").css("width").slice(0, -2));
						var h = Number($("#morphismMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						$("#morphismMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#morphismMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle";
									// console.log("idle");
								}
							}
						});
						rightMousedownOnMorphism = false;
					}
					break;
				case "idle with element(s) selected":
					var objs = [];
					var morphs = [];
					var endos = [];
					for (var i = 0; i < selectedElements.length; i++) {
						if (selectedElements[i].type === "object") {
							objs.push(selectedElements[i].element);
						} else if (selectedElements[i].type !== "endomorphism") {
							morphs.push(selectedElements[i].element);
						} else if (selectedElements[i].type === "endomorphism") {
							endos.push(selectedElements[i].element);
						}
					}
					endos = endos.slice(objs.length, endos.length);
					d3.selectAll("#multipleItems li").remove();
					$("#multipleItems").append('<li onclick="menu.openInputDialog(CUT_SELECTED)">C<u>u</u>t selected</li>');
					$("#multipleItems").append('<li onclick="menu.openInputDialog(COPY_SELECTED)">C<u>o</u>py selected</li>');
					if (objs.length === 0 && morphs.length === 1 && endos.length === 0) {
						$("#multipleItems").append('<li onclick="menu.openInputDialog(DUPLICATE_MORPHISM)"><u>D</u>uplicate morphism</li>');
					} else if (objs.length === 1 && morphs.length === 1 && endos.length === 0) {
						if (objs[0].getId() === morphs[0].getSource()) {
							$("#multipleItems").append('<li onclick="menu.openInputDialog(DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_SOURCE)">Duplicate object and morphism with same <u>s</u>ource</li>');
						} else if (objs[0].getId() === morphs[0].getTarget()) {
							$("#multipleItems").append('<li onclick="menu.openInputDialog(DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_TARGET)">Duplicate object and morphism with same <u>t</u>arget</li>');
						}
					}
					keyboardMouseStatus = "menu open with element(s) selected";
					// console.log("menu open with element(s) selected");
					if (rightMousedownOnCanvas) {
						menuOpen = true;
						menuCode = MULTIPLE_MENU;
						$("#multipleMenu").css("left", e.pageX);
						$("#multipleMenu").css("top", e.pageY);
						var x = Number($("#multipleMenu").css("left").slice(0, -2));
						var y = Number($("#multipleMenu").css("top").slice(0, -2));
						var w = Number($("#multipleMenu").css("width").slice(0, -2));
						var h = Number($("#multipleMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						$("#multipleMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#multipleMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle with element(s) selected";
									// console.log("idle with element(s) selected");
								}
							}
						});
						rightMousedownOnCanvas = false;
					} else if (rightMousedownOnObject) {
						menuOpen = true;
						menuCode = MULTIPLE_MENU;
						$("#multipleMenu").css("left", e.pageX);
						$("#multipleMenu").css("top", e.pageY);
						var x = Number($("#multipleMenu").css("left").slice(0, -2));
						var y = Number($("#multipleMenu").css("top").slice(0, -2));
						var w = Number($("#multipleMenu").css("width").slice(0, -2));
						var h = Number($("#multipleMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						$("#multipleMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#multipleMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle with element(s) selected";
									// console.log("idle with element(s) selected");
								}
							}
						});
						rightMousedownOnObject = false;
					} else if (rightMousedownOnEndoMorphism) {
						menuOpen = true;
						menuCode = MULTIPLE_MENU;
						$("#multipleMenu").css("left", e.pageX);
						$("#multipleMenu").css("top", e.pageY);
						var x = Number($("#multipleMenu").css("left").slice(0, -2));
						var y = Number($("#multipleMenu").css("top").slice(0, -2));
						var w = Number($("#multipleMenu").css("width").slice(0, -2));
						var h = Number($("#multipleMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						$("#multipleMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#multipleMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle with element(s) selected";
									// console.log("idle with element(s) selected");
								}
							}
						});
						rightMousedownOnEndoMorphism = false;
					} else if (rightMousedownOnMorphism) {
						menuOpen = true;
						menuCode = MULTIPLE_MENU;
						$("#multipleMenu").css("left", e.pageX);
						$("#multipleMenu").css("top", e.pageY);
						var x = Number($("#multipleMenu").css("left").slice(0, -2));
						var y = Number($("#multipleMenu").css("top").slice(0, -2));
						var w = Number($("#multipleMenu").css("width").slice(0, -2));
						var h = Number($("#multipleMenu").css("height").slice(0, -2));
						if (x > view.canvasWidth - w)
							$("#multipleMenu").css("left", view.canvasWidth - w);
						if (y > view.canvasHeight - h)
							$("#multipleMenu").css("top", view.canvasHeight + h);
						$("#multipleMenu").show();
						$(document).on("click", function(e) {
							if (e.which !== 3) {
								menuOpen = false;
								menuCode = -1;
								$("#multipleMenu").hide();
								$(document).off("click");
								if (keyboardMouseStatus !== "input open") {
									keyboardMouseStatus = "idle with element(s) selected";
									// console.log("idle with element(s) selected");
								}
							}
						});
						rightMousedownOnMorphism = false;
					}
					break;
			}
		}
	}
});
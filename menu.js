function Menu() {
	//Eric Martin's SimpleModal library and jQuery UI did not work when this project was upgraded to OOP
	//http://www.ericmmartin.com/projects/ and https://jqueryui.com/
	
	$("body").prepend('\
		<div id="canvasMenu">\
			<ul id="canvasItems">\
			</ul>\
		</div>\
		<div id="objectMenu">\
			<ul id="objectItems">\
			</ul>\
		</div>\
		<div id="morphismMenu">\
			<ul id="morphismItems">\
			</ul>\
		</div>\
		<div id="multipleMenu">\
			<ul id="multipleItems">\
			</ul>\
		</div>\
	');
	
	$("#canvasItems").append('<li onclick="menu.openInputDialog(CREATE_OBJECT)"><u>C</u>reate object</li>');
	$("#canvasItems").append('<li onclick="menu.openInputDialog(SELECT_ALL)">Select <u>a</u>ll</li>');
	$("#canvasItems").append('<li onclick="menu.openInputDialog(SELECT_OBJECTS)">Select <u>o</u>bjects</li>');
	$("#canvasItems").append('<li onclick="menu.openInputDialog(SELECT_MORPHISMS)">Select <u>m</u>orphisms</li>');
	$("#canvasItems").append('<li onclick="menu.openInputDialog(SELECT_ENDOMORPHISMS)">Select <u>e</u>ndomorphisms</li>');
	
	$("#objectItems").append('<li onclick="menu.openInputDialog(CREATE_MORPHISM_TO)">Create morphism <u>t</u>o</li>');
	$("#objectItems").append('<li onclick="menu.openInputDialog(CREATE_MORPHISM_FROM)">Create morphism <u>f</u>rom</li>');
	$("#objectItems").append('<li onclick="menu.openInputDialog(READ_OBJECT)"><u>R</u>ead object</li>');
	$("#objectItems").append('<li onclick="menu.openInputDialog(UPDATE_OBJECT)"><u>U</u>pdate object</li>');
	$("#objectItems").append('<li onclick="menu.openInputDialog(DELETE_OBJECT)"><u>D</u>elete object</li>');
	$("#objectItems").append('<li onclick="menu.openInputDialog(SELECT_OBJECT)"><u>S</u>elect object</li>');
	
	$("#morphismItems").append('<li onclick="menu.openInputDialog(CHANGE_TYPE)"><u>C</u>hange type</li>');
	$("#morphismItems").append('<li onclick="menu.openInputDialog(READ_MORPHISM)"><u>R</u>ead morphism</li>');
	$("#morphismItems").append('<li onclick="menu.openInputDialog(UPDATE_MORPHISM)"><u>U</u>pdate morphism</li>');
	$("#morphismItems").append('<li onclick="menu.openInputDialog(DELETE_MORPHISM)"><u>D</u>elete morphism</li>');
	$("#morphismItems").append('<li onclick="menu.openInputDialog(SELECT_MORPHISM)"><u>S</u>elect morphism</li>');
	
	//https://stackoverflow.com/questions/12065329/jquery-adding-event-listeners-to-dynamically-added-elements
	//https://forums.asp.net/t/1754431.aspx?Change+Background+color+of+an+item+selected+in+Select
	$("body").prepend('\
		<div id="objectInput">\
			<form>\
			<label>id</label><input class="menuObjectInput" type="text" name="id" value="id" required disabled><br>\
			<label>label</label><input class="menuObjectInput" type="text" name="label" value="label" required disabled><br>\
			<label>x</label><input class="menuObjectInput" type="number" name="x" value="x" min="0" required disabled><br>\
			<label>y</label><input class="menuObjectInput" type="number" name="y" value="y" min="0" required disabled><br>\
			<label>radius</label><input class="menuObjectInput" type="number" name="radius" value="radius" min="0" required disabled><br>\
			<button id="ok" type="button" onclick="menu.executeInputDialog()">OK</button>\
			<button id="quit" type="button" onclick="menu.closeObjectInputDialog()">QUIT</button>\
			<button id="reset" type="button" onclick="menu.resetInputDialog()">RESET</button>\
			</form>\
		</div>\
		<div id="morphismInput">\
			<form>\
			<label>id</label><input class="menuMorphismInput" type="text" name="id" value="id" required disabled><br>\
			<label>label</label><input class="menuMorphismInput" type="text" name="label" value="label" required disabled><br>\
			<label>source</label><input class="menuMorphismInput" type="number" name="source" value="source" min="0" required disabled><br>\
			<label>target</label><input class="menuMorphismInput" type="number" name="target" value="target" min="0" required disabled><br>\
			<label>width</label><input class="menuMorphismInput" type="number" name="width" value="width" min="0" required disabled><br>\
			<label>type</label>\
			<select class="menuMorphismInput" name="types" disabled>\
				<option value="morphism">Morphism</option>\
				<option value="monomorphism">Monomorphism</option>\
				<option value="epimorphism">Epimorphism</option>\
				<option value="monoepimorphism">Monoepimorphism</option>\
				<option value="isomorphism">Isomorphism</option>\
			</select>\
			<button id="ok" type="button" onclick="menu.executeInputDialog()">OK</button>\
			<button id="quit" type="button" onclick="menu.closeMorphismInputDialog()">QUIT</button>\
			<button id="reset" type="button" onclick="menu.resetInputDialog()">RESET</button>\
			</form>\
		</div>\
		<script>\
		$("#morphismInput form select").on("focus", function() {\
			$(this).css("backgroundColor", SELECTED_MORPHISM_INPUT_DROPDOWN_LIST_BACKGROUND_COLOR);\
			$(this).css("color", SELECTED_MORPHISM_INPUT_DROPDOWN_LIST_COLOR);\
		}).on("blur", function() {\
			$(this).css("backgroundColor", DEFAULT_MORPHISM_INPUT_DROPDOWN_LIST_BACKGROUND_COLOR);\
			$(this).css("color", DEFAULT_MORPHISM_INPUT_DROPDOWN_LIST_COLOR);\
		});\
		</script>\
	');
	// $("#objectInput").children()[0][2].min = LIMIT;
	// $("#objectInput").children()[0][3].min = LIMIT;
	// $("#objectInput").children()[0][2].max = view.canvasWidth - LIMIT;
	// $("#objectInput").children()[0][3].max = view.canvasHeight - LIMIT;
	
	/*
	Open input dialog
	*/
	this.openInputDialog = function (opt) {
		if (keyboardMouseStatus === "menu open") {
			keyboardMouseStatus = "input open";
			// console.log("input open");
		} else if (keyboardMouseStatus === "menu open with element(s) selected") {
			keyboardMouseStatus = "input open with element(s) selected";
			// console.log("input open with element(s) selected");
		}
		$(document).click();//to close menu
		switch (opt) {
			case CREATE_OBJECT:
				// console.log("Create object");
				inputOpen = true;
				inputCode = CREATE_OBJECT;
				var fields = $("#objectInput").children()[0];
				fields[0].value = objectsCounter;
				fields[1].value = currentObjectLabel();
				fields[2].value = Number($("#canvasMenu").css("left").slice(0, -2));
				fields[3].value = Number($("#canvasMenu").css("top").slice(0, -2));
				fields[4].value = DEFAULT_CIRCLE_RADIUS;
				for (var i = 0; i < 5; i++) {fields[i].disabled = true;}
				fields[1].disabled = false;
				fields[2].disabled = false;
				fields[3].disabled = false;
				labelString = fields[1].value;
				xString = fields[2].value;
				yString = fields[3].value;
				$("#objectInput").css("left", $("#canvasMenu").css("left"));
				$("#objectInput").css("top", $("#canvasMenu").css("top"));
				$("#objectInput").css("background", DEFAULT_CIRCLE_COLOR);
				$("#objectInput > form > input").css("background", DEFAULT_OBJECT_INPUT_COLOR);
				$("#objectInput > form > input").css("color", "#000000");
				$("#objectInput").show();
				break;
			case SELECT_ALL:
				// console.log("Select all");
				selectAll();
				if (selectedElements.length > 0) {
					keyboardMouseStatus = "idle with element(s) selected";
					// console.log("idle with element(s) selected");
				} else {
					keyboardMouseStatus = "idle";
					// console.log("idle");
				}
				break;
			case SELECT_OBJECTS:
				// console.log("Select objects");
				selectObjects();
				if (selectedElements.length > 0) {
					keyboardMouseStatus = "idle with element(s) selected";
					// console.log("idle with element(s) selected");
				} else {
					keyboardMouseStatus = "idle";
					// console.log("idle");
				}
				break;
			case SELECT_MORPHISMS:
				// console.log("Select morphisms");
				selectMorphisms();
				if (selectedElements.length > 0) {
					keyboardMouseStatus = "idle with element(s) selected";
					// console.log("idle with element(s) selected");
				} else {
					keyboardMouseStatus = "idle";
					// console.log("idle");
				}
				break;
			case SELECT_ENDOMORPHISMS:
				// console.log("Select morphisms");
				selectEndomorphisms();
				if (selectedElements.length > 0) {
					keyboardMouseStatus = "idle with element(s) selected";
					// console.log("idle with element(s) selected");
				} else {
					keyboardMouseStatus = "idle";
					// console.log("idle");
				}
				break;
			case CREATE_MORPHISM_TO:
				// console.log("Create morphism to");
				inputOpen = true;
				inputCode = CREATE_MORPHISM_TO;
				var object = listOfObjectsPressed[0];
				var fields = $("#morphismInput").children()[0];
				fields[0].value = morphismsCounter;
				fields[1].value = currentMorphismLabel();
				fields[2].value = object.getId();
				fields[3].value = object.getId();
				fields[4].value = DEFAULT_CURVE_WIDTH;
				fields[5].options[0].selected = true;
				for (var i = 0; i < 6; i++) {fields[i].disabled = true;}
				fields[1].disabled = false;
				fields[3].disabled = false;
				fields[5].disabled = false;
				labelString = fields[1].value;
				targetString = fields[3].value;
				typesString = fields[5].value;
				$("#morphismInput").css("left", $("#objectMenu").css("left"));
				$("#morphismInput").css("top", $("#objectMenu").css("top"));
				$("#morphismInput").css("background", DEFAULT_CURVE_COLOR);
				$("#morphismInput > form > input").css("background", DEFAULT_MORPHISM_INPUT_COLOR);
				$("#morphismInput > form > input").css("color", "#000000");
				$("#morphismInput").show();
				break;
			case CREATE_MORPHISM_FROM:
				// console.log("Create morphism from");
				inputOpen = true;
				inputCode = CREATE_MORPHISM_FROM;
				var object = listOfObjectsPressed[0];
				var fields = $("#morphismInput").children()[0];
				fields[0].value = morphismsCounter;
				fields[1].value = currentMorphismLabel();
				fields[2].value = object.getId();
				fields[3].value = object.getId();
				fields[4].value = DEFAULT_CURVE_WIDTH;
				fields[5].options[0].selected = true;
				for (var i = 0; i < 6; i++) {fields[i].disabled = true;}
				fields[1].disabled = false;
				fields[2].disabled = false;
				fields[5].disabled = false;
				labelString = fields[1].value;
				sourceString = fields[2].value;
				typesString = fields[5].value;
				$("#morphismInput").css("left", $("#objectMenu").css("left"));
				$("#morphismInput").css("top", $("#objectMenu").css("top"));
				$("#morphismInput").css("background", DEFAULT_CURVE_COLOR);
				$("#morphismInput > form > input").css("background", DEFAULT_MORPHISM_INPUT_COLOR);
				$("#morphismInput > form > input").css("color", "#000000");
				$("#morphismInput").show();
				break;
			case READ_OBJECT:
				//console.log("Read object");
				inputOpen = true;
				inputCode = READ_OBJECT;
				var fields = $("#objectInput").children()[0];
				var object = listOfObjectsPressed[0];
				var allAtributes = object.getAll();
				for (var i = 0; i < 5; i++) {
					fields[i].value = allAtributes[i];
				}
				for (var i = 0; i < 5; i++) {fields[i].disabled = true;}
				$("#objectInput").css("left", $("#objectMenu").css("left"));
				$("#objectInput").css("top", $("#objectMenu").css("top"));
				$("#objectInput").css("background", DEFAULT_CIRCLE_COLOR);
				$("#objectInput > form > input").css("background", DEFAULT_OBJECT_INPUT_COLOR);
				$("#objectInput > form > input").css("color", "#000000");
				$("#objectInput").show();
				break;
			case UPDATE_OBJECT:
				// console.log("Update object");
				inputOpen = true;
				inputCode = UPDATE_OBJECT;
				var object = listOfObjectsPressed[0];
				var fields = $("#objectInput").children()[0];
				fields[0].value = object.getId();
				fields[1].value = object.getLabel();
				fields[2].value = object.getX();
				fields[3].value = object.getY();
				fields[4].value = object.getRadius();
				for (var i = 0; i < 5; i++) {fields[i].disabled = true;}
				fields[1].disabled = false;
				fields[2].disabled = false;
				fields[3].disabled = false;
				labelString = fields[1].value;
				xString = fields[2].value;
				yString = fields[3].value;
				$("#objectInput").css("left", $("#objectMenu").css("left"));
				$("#objectInput").css("top", $("#objectMenu").css("top"));
				$("#objectInput").css("background", DEFAULT_CIRCLE_COLOR);
				$("#objectInput > form > input").css("background", DEFAULT_OBJECT_INPUT_COLOR);
				$("#objectInput > form > input").css("color", "#000000");
				$("#objectInput").show();
				break;
			case DELETE_OBJECT:
				// console.log("Delete object");
				var object = listOfObjectsPressed[0];
				var morphismsArray = object.getMorphisms();
				var endomorphismsArray = object.getEndomorphisms();
				view.hideCircle(object);
				object.setVisible(false);
				for (var i = 0; i < morphismsArray.length; i++) {
					view.hideBezier(morphismsArray[i]);
					morphismsArray[i].setVisible(false);
				}
				for (var i = 0; i < endomorphismsArray.length; i++) {
					view.hideEndomorphism(endomorphismsArray[i]);
					endomorphismsArray[i].setVisible(false);
				}
				state.createState("deleteObject", object);
				keyboardMouseStatus = "idle";
				// console.log("idle");
				break;
			case SELECT_OBJECT:
				// console.log("Select object");
				selectedElements.push({type: "object", element: listOfObjectsPressed[0]});
				view.selectCircle(listOfObjectsPressed[0]);
				listOfObjectsPressed[0].setSelected(true);
				var idEndomorphism = listOfObjectsPressed[0].getEndomorphism(0);
				selectedElements.push({type: "endomorphism", element: idEndomorphism});
				view.selectEndomorphism(idEndomorphism);
				idEndomorphism.setSelected(true);
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
				break;
			case CHANGE_TYPE:
				// console.log("Change type");
				inputOpen = true;
				inputCode = CHANGE_TYPE;
				var morphism = listOfMorphismsPressed[0];
				var fields = $("#morphismInput").children()[0];
				var allAtributes = morphism.getAll();
				for (var i = 0; i < 5; i++) {
					fields[i].value = allAtributes[i];
				}
				for (var i = 0; i < fields[5].options.length; i++) {
					if (morphism.getType() === "morphism") {
						if (fields[5].options[i].value === morphism.getType()) {
							fields[5].options[i].selected = true;
						}
					} else if (morphism.getType() === "endomorphism") {
						if (fields[5].options[i].value === morphism.getType().substring(4)) {
							fields[5].options[i].selected = true;
						}
					}
				}
				for (var i = 0; i < 6; i++) {fields[i].disabled = true;}
				if (morphism.getType() !== "endomorphism") {
					fields[5].disabled = false;
					typesString = fields[5].value;
				} else {
					fields[6].disabled = true;
					fields[8].disabled = true;
				}
				$("#morphismInput").css("left", $("#morphismMenu").css("left"));
				$("#morphismInput").css("top", $("#morphismMenu").css("top"));
				$("#morphismInput").css("background", DEFAULT_CURVE_COLOR);
				$("#morphismInput > form > input").css("background", DEFAULT_MORPHISM_INPUT_COLOR);
				$("#morphismInput > form > input").css("color", "#000000");
				$("#morphismInput").show();
				break;
			case READ_MORPHISM:
				// console.log("Read morphism");
				inputOpen = true;
				inputCode = READ_MORPHISM;
				var fields = $("#morphismInput").children()[0];
				var morphism = listOfMorphismsPressed[0];
				var allAtributes = morphism.getAll();
				for (var i = 0; i < 6; i++) {
					fields[i].value = allAtributes[i];
				}
				for (var i = 0; i < 6; i++) {fields[i].disabled = true;}
				$("#morphismInput").css("left", $("#morphismMenu").css("left"));
				$("#morphismInput").css("top", $("#morphismMenu").css("top"));
				$("#morphismInput").css("background", DEFAULT_CURVE_COLOR);
				$("#morphismInput > form > input").css("background", DEFAULT_MORPHISM_INPUT_COLOR);
				$("#morphismInput > form > input").css("color", "#000000");
				$("#morphismInput").show();
				break;
			case UPDATE_MORPHISM:
				// console.log("Update morphism");
				inputOpen = true;
				inputCode = UPDATE_MORPHISM;
				var morphism = listOfMorphismsPressed[0];
				var fields = $("#morphismInput").children()[0];
				fields[0].value = morphism.getId();
				fields[1].value = morphism.getLabel();
				fields[2].value = morphism.getSource();
				fields[3].value = morphism.getTarget();
				fields[4].value = morphism.getWidth();
				fields[5].value = morphism.getType();
				for (var i = 0; i < 6; i++) {fields[i].disabled = true;}
				fields[1].disabled = false;
				fields[2].disabled = false;
				fields[3].disabled = false;
				fields[5].disabled = false;
				labelString = fields[1].value;
				sourceString = fields[2].value;
				targetString = fields[3].value;
				typesString = fields[5].value;
				$("#morphismInput").css("left", $("#morphismMenu").css("left"));
				$("#morphismInput").css("top", $("#morphismMenu").css("top"));
				$("#morphismInput").css("background", DEFAULT_CURVE_COLOR);
				$("#morphismInput > form > input").css("background", DEFAULT_MORPHISM_INPUT_COLOR);
				$("#morphismInput > form > input").css("color", "#000000");
				$("#morphismInput").show();
				break;
			case DELETE_MORPHISM:
				// console.log("Delete morphism");
				var morphism = listOfMorphismsPressed[0];
				if (morphism.getType() !== "endomorphism") {
					view.hideBezier(morphism);
					morphism.setVisible(false);
				} else {
					view.hideEndomorphism(morphism);
					morphism.setVisible(false);
				}
				state.createState("deleteMorphism", morphism);
				keyboardMouseStatus = "idle";
				// console.log("idle");
				break;
			case SELECT_MORPHISM:
				// console.log("Select morphism");
				if (listOfMorphismsPressed[0].getSource() !== listOfMorphismsPressed[0].getTarget()) {
					selectedElements.push({type: "morphism", element: listOfMorphismsPressed[0]});
					view.selectBezier(listOfMorphismsPressed[0]);
				} else {
					selectedElements.push({type: "endomorphism", element: listOfMorphismsPressed[0]});
					view.selectEndomorphism(listOfMorphismsPressed[0]);
				}
				listOfMorphismsPressed[0].setSelected(true);
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
				break;
			case CUT_SELECTED:
				// console.log("Cut selected");
				cutSelected();
				state.createState("cutSelected", hiddenElements);
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
				break;
			case COPY_SELECTED:
				// console.log("Copy selected");
				copySelected();
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
				break;
			case DUPLICATE_MORPHISM:
				console.log("Duplicate morphism");
				var morphism = selectedElements[0].element;
				var source = getObjectById(morphism.getSource());
				var target = getObjectById(morphism.getTarget());
				morphismCreate(source, target, morphism.getType());
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
				break;
			case DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_SOURCE:
				console.log("Duplicate object and morphism with same source");
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
				var object = objs[0];
				var morphism = morphs[0];
				if (lastDuplicateObjectAndMorphism.object !== null && lastDuplicateObjectAndMorphism.morphism !== null) {
					if (lastDuplicateObjectAndMorphism.object !== object || lastDuplicateObjectAndMorphism.morphism !== morphism) {
						lastDuplicateObjectAndMorphism = {object: object, morphism: morphism};
						duplicateWithSameSourceCounter = 0;
					}
				}
				duplicateWithSameSourceCounter++;
				var x = object.getX() + 2 * (Math.floor(duplicateWithSameSourceCounter / 8) + 1) * Math.degCos(PASTE_ANGLE * duplicateWithSameSourceCounter) * (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS);
				var y = object.getY() - 2 * (Math.floor(duplicateWithSameSourceCounter / 8) + 1) * Math.degSin(PASTE_ANGLE * duplicateWithSameSourceCounter) * (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS);
				if (x < LIMIT) x = LIMIT;
				if (y < LIMIT) y = LIMIT;
				if (x > view.canvasWidth - LIMIT) x = view.canvasWidth - LIMIT;
				if (y > view.canvasHeight - LIMIT) y = view.canvasHeight - LIMIT;
				var source = getObjectById(morphism.getSource());
				var newObject = objectCreate([x, y]);
				morphismCreate(source, newObject, morphism.getType());
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
				break;
			case DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_TARGET:
				console.log("Duplicate object and morphism with same target");
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
				var object = objs[0];
				var morphism = morphs[0];
				if (lastDuplicateObjectAndMorphism.object !== null && lastDuplicateObjectAndMorphism.morphism !== null) {
					if (lastDuplicateObjectAndMorphism.object !== object || lastDuplicateObjectAndMorphism.morphism !== morphism) {
						lastDuplicateObjectAndMorphism = {object: object, morphism: morphism};
						duplicateWithSameTargetCounter = 0;
					}
				}
				duplicateWithSameTargetCounter++;
				var x = object.getX() + 2 * (Math.floor(duplicateWithSameTargetCounter / 8) + 1) * Math.degCos(PASTE_ANGLE * duplicateWithSameTargetCounter) * (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS);
				var y = object.getY() - 2 * (Math.floor(duplicateWithSameTargetCounter / 8) + 1) * Math.degSin(PASTE_ANGLE * duplicateWithSameTargetCounter) * (DEFAULT_CIRCLE_RADIUS + 4 * DEFAULT_HANDLE_RADIUS);
				if (x < LIMIT) x = LIMIT;
				if (y < LIMIT) y = LIMIT;
				if (x > view.canvasWidth - LIMIT) x = view.canvasWidth - LIMIT;
				if (y > view.canvasHeight - LIMIT) y = view.canvasHeight - LIMIT;
				var target = getObjectById(morphism.getTarget());
				var newObject = objectCreate([x, y]);
				morphismCreate(newObject, target, morphism.getType());
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
				break;
		}
		$('.menuObjectInput:enabled:visible:first').focus();
		$('.menuMorphismInput:enabled:visible:first').focus();
	}
	
	/*
	Execute input dialog
	*/
	this.executeInputDialog = function() {
		var invalidForm = false;
		var inputs = null;
		if ([CREATE_OBJECT, READ_OBJECT, UPDATE_OBJECT].has(inputCode)) {
			inputs = document.getElementsByClassName("menuObjectInput");
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].value.length === 0) {
					invalidForm = true;
					break;
				}
			}
			if (inputs[2].value < LIMIT) {
				invalidForm = true;
			} else if (inputs[2].value > view.canvasWidth - LIMIT) {
				invalidForm = true;
			}
			if (inputs[3].value < LIMIT) {
				invalidForm = true;
			} else if (inputs[3].value > view.canvasHeight - LIMIT) {
				invalidForm = true;
			}
		} else if ([CREATE_MORPHISM_TO, CREATE_MORPHISM_FROM, CHANGE_TYPE, READ_MORPHISM, UPDATE_MORPHISM].has(inputCode)) {
			inputs = document.getElementsByClassName("menuMorphismInput");
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].value.length === 0) {
					invalidForm = true;
					break;
				}
			}
			var ids = objects.map(function(o) {return o.getId();});
			if (!ids.has(Number(inputs[2].value)))
				invalidForm = true;
			if (!ids.has(Number(inputs[3].value)))
				invalidForm = true;
			// var morphism = listOfMorphismsPressed[0];
			// if (morphism.getSource() !== morphism.getTarget() && Number(inputs[2].value) === Number(inputs[3].value))
				// invalidForm = true;
			// else if (morphism.getSource() === morphism.getTarget() && Number(inputs[2].value) !== Number(inputs[3].value))
				// invalidForm = true;
			// console.log(inputs[5].value);
		}
		if (!invalidForm) {
			if (keyboardMouseStatus === "input open") {
				keyboardMouseStatus = "input execute";
				// console.log("input execute");
			} else if (keyboardMouseStatus === "input open with element(s) selected") {
				keyboardMouseStatus = "input execute with element(s) selected";
				// console.log("input execute with element(s) selected");
			}
			switch (inputCode) {
				case CREATE_OBJECT:
					inputOpen = false;
					inputCode = -1;
					$("#objectInput").hide();
					var fields = $("#objectInput").children()[0];
					var id = fields[0].value;
					var label = fields[1].value;
					var x = Number(fields[2].value);
					var y = Number(fields[3].value);
					var radius = Number(fields[4].value);
					var position = [x, y];
					view.createCircle(position);
					view.createCircleLabel(position);
					var newObject = new Object(position);
					objects.push(newObject);
					var ptr = view.createIdEndomorphism(newObject, radius);
					view.createIdEndomorphismLabel(ptr.handle, radius);
					var newMorphism = new Morphism(objectsCounter, objectsCounter, "endomorphism", true, ptr);
					morphisms.push(newMorphism);
					newObject.addEndomorphism(newMorphism);
					objectsCounter++;
					morphismsCounter++;
					state.createState("createObject", [newObject, newMorphism]);
					lastCreatedObjectTimestamp = new Date().getTime();
					lastCreatedEndomorphismTimestamp = new Date().getTime();
					console.log("last operation: "+"createObject");
					break;
				case CREATE_MORPHISM_TO:
					inputOpen = false;
					inputCode = -1;
					$("#morphismInput").hide();
					var fields = $("#morphismInput").children()[0];
					var src = Number(fields[2].value);
					var tgt = Number(fields[3].value);
					var source = getObjectById(src);
					var target = getObjectById(tgt);
					if (source !== null && target !== null) {
						var type = fields[5].value;
						var ptr = null;
						if (src !== tgt) {
							morphismCreate(source, target, type);
							var newMorphism = morphisms.last();
							var position = newMorphism.getHandlePosition();
							view.changeBezierType(newMorphism);
							var ptr = view.updateBezier(newMorphism, position);
							view.updateBezierLabel(newMorphism, position);
							newMorphism.setPoints([ptr.p0, ptr.p1, ptr.p2]);
							newMorphism.setCurvePath(ptr.curve.attr("d"));
							newMorphism.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
						} else {
							var newMorphism = new Morphism(src, tgt, type, false, ptr);
							morphisms.push(newMorphism);
							ptr = view.createEndomorphism(source, target.getRadius(), 270);
							view.createEndomorphismLabel(ptr.handle);
							source.addEndomorphism(newMorphism);
						}
						morphismsCounter++;
						state.createState("createMorphismTo", newMorphism);
					}
					break;
				case CREATE_MORPHISM_FROM:
					inputOpen = false;
					inputCode = -1;
					$("#morphismInput").hide();
					var fields = $("#morphismInput").children()[0];
					var src = Number(fields[2].value);
					var tgt = Number(fields[3].value);
					var source = getObjectById(src);
					var target = getObjectById(tgt);
					if (source !== null && target !== null) {
						var type = fields[5].value;
						var ptr = null;
						if (src !== tgt) {
							morphismCreate(source, target, type);
							var newMorphism = morphisms.last();
							var position = newMorphism.getHandlePosition();
							view.changeBezierType(newMorphism);
							var ptr = view.updateBezier(newMorphism, position);
							view.updateBezierLabel(newMorphism, position);
							newMorphism.setPoints([ptr.p0, ptr.p1, ptr.p2]);
							newMorphism.setCurvePath(ptr.curve.attr("d"));
							newMorphism.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
						} else {
							var newMorphism = new Morphism(src, tgt, type, false, ptr);
							morphisms.push(newMorphism);
							ptr = view.createEndomorphism(source, target.getRadius(), 270);
							view.createEndomorphismLabel(ptr.handle);
							source.addEndomorphism(newMorphism);
						}
						morphismsCounter++;
						state.createState("createMorphismFrom", newMorphism);
					}
					break;
				case READ_OBJECT:
					inputOpen = false;
					inputCode = -1;
					$("#objectInput").hide();
					console.log("last operation: "+"readObject");
					break;
				case UPDATE_OBJECT:
					inputOpen = false;
					inputCode = -1;
					$("#objectInput").hide();
					var object = listOfObjectsPressed[0];
					var prevAttr = object.getAll();
					var fields = $("#objectInput").children()[0];
					var label = fields[1].value;
					var x = Number(fields[2].value);
					var y = Number(fields[3].value);
					var radius = Number(fields[4].value);
					object.setLabel(label);
					object.setX(x);
					object.setY(y);
					object.setRadius(radius);
					var currAttr = object.getAll();
					var diffs = [];
					for (var i = 0; i < currAttr.length; i++) {
						if (currAttr[i] !== prevAttr[i]) {
							diffs.push([i, currAttr[i]]);
						}
					}
					if (diffs.length > 0) {
						var changedLabel = false;
						var changedPosition = false;
						for (var i = 0; i < diffs.length; i++) {
							if (diffs[i][0] === 1) {
								changedLabel = true;
							} else if (diffs[i][0] === 2 || diffs[i][0] === 3) {
								changedPosition = true;
							}
						}
						if (changedLabel) {
							view.changeCircleLabel(object);
							var endo = object.getEndomorphism(0);
							endo.setLabel("id" + object.getLabel());
							var pos = endo.getHandlePosition();
							view.changeEndomorphismLabel(endo, pos);
						}
						if (changedPosition) {
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
						}
						state.createState("updateObject", [object, prevAttr]);
					}
					break;
				case CHANGE_TYPE:
					inputOpen = false;
					inputCode = -1;
					$("#morphismInput").hide();
					var morphism = listOfMorphismsPressed[0];
					var prevType = morphism.getType();
					if (prevType !== "endomorphism") {
						var fields = $("#morphismInput").children()[0];
						var newType = fields[5].value;
						if (prevType !== newType) {
							morphism.setType(newType);
							var position = morphism.getHandlePosition();
							view.changeBezierType(morphism);
							var ptr = view.updateBezier(morphism, position);
							view.updateBezierLabel(morphism, position);
							morphism.setPoints([ptr.p0, ptr.p1, ptr.p2]);
							morphism.setCurvePath(ptr.curve.attr("d"));
							morphism.setHandlePosition([ptr.handle.attr("cx"), ptr.handle.attr("cy")]);
							state.createState("changeType", [morphism, prevType]);
						}
					}
					break;
				case READ_MORPHISM:
					inputOpen = false;
					inputCode = -1;
					$("#morphismInput").hide();
					console.log("last operation: "+"readMorphism");
					break;
				case UPDATE_MORPHISM:
					inputOpen = false;
					inputCode = -1;
					$("#morphismInput").hide();
					var morphism = listOfMorphismsPressed[0];
					var prevAttr = morphism.getAll();
					var fields = $("#morphismInput").children()[0];
					var label = fields[1].value;
					var source = Number(fields[2].value);
					var target = Number(fields[3].value);
					var width = Number(fields[4].value);
					var type = fields[5].value;
					morphism.setLabel(label);
					morphism.setSource(source);
					morphism.setTarget(target);
					morphism.setWidth(width);
					morphism.setType(type);
					var currAttr = morphism.getAll();
					var diffs = [];
					for (var i = 0; i < currAttr.length; i++) {
						if (currAttr[i] !== prevAttr[i]) {
							diffs.push([i, currAttr[i]]);
						}
					}
					if (diffs.length > 0) {
						var changedLabel = false;
						var changedSourceOrTarget = false;
						var changedType = false;
						for (var i = 0; i < diffs.length; i++) {
							if (diffs[i][0] === 1) {
								changedLabel = true;
							} else if (diffs[i][0] === 2 || diffs[i][0] === 3) {
								changedSourceOrTarget = true;
							} else if (diffs[i][0] === 5) {
								changedType = true;
							}
						}
						if (changedLabel) {
							var source = getObjectById(morphism.getSource());
							var target = getObjectById(morphism.getTarget());
							var m = [0.5 * (source.getX() + target.getX()), 0.5 * (source.getY() + target.getY())];
							var realAngleBetweenObjects = Math.realAngle(source.getPosition(), target.getPosition());
							var sign = Math.pow(-1, source.getId() > target.getId());
							// var r = [m[0] - 2 * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
							var r = [m[0] - 2 * sign * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
							view.changeBezierLabel(morphism, r);
						}
						if (changedSourceOrTarget) {
							var source = getObjectById(morphism.getSource());
							var target = getObjectById(morphism.getTarget());
							var m = [0.5 * (source.getX() + target.getX()), 0.5 * (source.getY() + target.getY())];
							var realAngleBetweenObjects = Math.realAngle(source.getPosition(), target.getPosition());
							var sign = Math.pow(-1, source.getId() > target.getId());
							// var r = [m[0] - 2 * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
							var r = [m[0] - 2 * sign * (m[0] + i * DEFAULT_HANDLE_RADIUS * Math.degCos(realAngleBetweenObjects+90) - m[0]), m[1] + 2 * sign * (m[1] + i * DEFAULT_HANDLE_RADIUS * Math.degSin(realAngleBetweenObjects+90) - m[1])];
							var ptr = view.changeBezier(morphism, r);
							view.changeBezierLabel(morphism, r);
							morphism.setHandle(ptr.handle);
						}
						if (changedType) {
							view.changeBezierType(morphism);
						}
						state.createState("updateMorphism", [morphism, prevAttr]);
					}
					break;
			}
			menu.closeInputDialog();
			if (keyboardMouseStatus === "input execute") {
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if (keyboardMouseStatus === "input execute with element(s) selected") {
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
			}
		}
	}
	
	/*
	Close object input dialog
	*/
	this.closeObjectInputDialog = function () {
		if (keyboardMouseStatus === "input open") {
			keyboardMouseStatus = "idle";
			console.log("idle");
		} else if (keyboardMouseStatus === "input open with element(s) selected") {
			keyboardMouseStatus = "idle with element(s) selected";
			console.log("idle with element(s) selected");
		}
		inputOpen = false;inputCode = -1;$("#objectInput").hide();
	}
	
	/*
	Close morphism input dialog
	*/
	this.closeMorphismInputDialog = function () {
		if (keyboardMouseStatus === "input open") {
			keyboardMouseStatus = "idle";
			// console.log("idle");
		} else if (keyboardMouseStatus === "input open with element(s) selected") {
			keyboardMouseStatus = "idle with element(s) selected";
			console.log("idle with element(s) selected");
		}
		inputOpen = false;inputCode = -1;$("#morphismInput").hide();
	}
	
	/*
	Reset input dialog
	*/
	this.resetInputDialog = function() {
		if (keyboardMouseStatus === "input open") {
			keyboardMouseStatus = "input open";
			// console.log("input open");
		} else if (keyboardMouseStatus === "input open with element(s) selected") {
			keyboardMouseStatus = "input open with element(s) selected";
			console.log("input open with element(s) selected");
		}
		switch (inputCode) {
			case CREATE_OBJECT:
				var fields = $("#objectInput").children()[0];
				fields[0].value = objectsCounter;
				fields[1].value = currentObjectLabel();
				fields[2].value = Number($("#canvasMenu").css("left").slice(0, -2));
				fields[3].value = Number($("#canvasMenu").css("top").slice(0, -2));
				fields[4].value = DEFAULT_CIRCLE_RADIUS;
				labelString = fields[1].value;
				xString = fields[2].value;
				yString = fields[3].value;
				break;
			case CREATE_MORPHISM_TO:
				var object = listOfObjectsPressed[0];
				var fields = $("#morphismInput").children()[0];
				fields[0].value = morphismsCounter;
				fields[1].value = currentMorphismLabel();
				fields[2].value = object.getId();
				fields[3].value = object.getId();
				fields[4].value = DEFAULT_CURVE_WIDTH;
				fields[5].options[0].selected = true;
				labelString = fields[1].value;
				targetString = fields[3].value;
				typesString = fields[5].value;
				break;
			case CREATE_MORPHISM_FROM:
				var object = listOfObjectsPressed[0];
				var fields = $("#morphismInput").children()[0];
				fields[0].value = morphismsCounter;
				fields[1].value = currentMorphismLabel();
				fields[2].value = object.getId();
				fields[3].value = object.getId();
				fields[4].value = DEFAULT_CURVE_WIDTH;
				fields[5].options[0].selected = true;
				labelString = fields[1].value;
				sourceString = fields[2].value;
				typesString = fields[5].value;
				break;
			case UPDATE_OBJECT:
				var object = listOfObjectsPressed[0];
				var fields = $("#objectInput").children()[0];
				fields[0].value = object.getId();
				fields[1].value = object.getLabel();
				fields[2].value = object.getX();
				fields[3].value = object.getY();
				fields[4].value = object.getRadius();
				labelString = fields[1].value;
				xString = fields[2].value;
				yString = fields[3].value;
				break;
			case CHANGE_TYPE:
				var morphism = listOfMorphismsPressed[0];
				var fields = $("#morphismInput").children()[0];
				var allAtributes = morphism.getAll();
				for (var i = 0; i < 5; i++) {
					fields[i].value = allAtributes[i];
				}
				switch (allAtributes[5]) {
					case "morphism":
						fields[5].selectedIndex = 0;
						break;
					case "monomorphism":
						fields[5].selectedIndex = 1;
						break;
					case "epimorphism":
						fields[5].selectedIndex = 2;
						break;
					case "monoepimorphism":
						fields[5].selectedIndex = 3;
						break;
					case "isomorphism":
						fields[5].selectedIndex = 4;
						break;
					default:
						fields[5].selectedIndex = 1;
						break;
				}
				typesString = "";
				break;
			case UPDATE_MORPHISM:
				var morphism = listOfMorphismsPressed[0];
				var fields = $("#objectInput").children()[0];
				fields[0].value = morphism.getId();
				fields[1].value = morphism.getLabel();
				fields[2].value = morphism.getSource();
				fields[3].value = morphism.getTarget();
				fields[4].value = morphism.getWidth();
				fields[5].value = morphism.getType();
				labelString = fields[1].value;
				sourceString = fields[2].value;
				targetString = fields[3].value;
				typesString = fields[5].value;
				break;
		}
	}
	
	/*
	Close input dialog
	*/
	this.closeInputDialog = function() {
		if ($("#objectInput").is(":visible")) {
			$("#objectInput").hide();
		} else if ($("#morphismInput").is(":visible")) {
			$("#morphismInput").hide();
		}
	}
}
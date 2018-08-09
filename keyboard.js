window.addEventListener("keypress", function(e) {
	var evtobj = window.event? event : e;
	if (evtobj.keyCode !== 123) e.preventDefault();
});

window.addEventListener("keydown", function(e) {
	var evtobj = window.event? event : e;
	ctrlPressed = evtobj.ctrlKey;
	shiftPressed = evtobj.shiftKey;
	altPressed = evtobj.altKey;
	//https://stackoverflow.com/questions/348792/how-do-you-tell-if-caps-lock-is-on-using-javascript
	capsOn = e.getModifierState && e.getModifierState("CapsLock");
	
	if (evtobj.keyCode === 32 && !ctrlPressed && keyboardMouseStatus !== "tsv open") {//space
		e.preventDefault();
		var currentKeyboardMouseStatus = keyboardMouseStatus;
		keyboardMouseStatus = "space";
		// console.log("space");
		var str = "";
		if (objects.length === 1) {
			str += objects.length + " " + STR_OBJECT + "\r\n";
		} else {
			str += objects.length + " " + STR_OBJECTS + "\r\n";
		}
		for (var i = 0; i < objects.length; i++) {
			str += "id: " + objects[i].getId() + "\r\n";
			str += "label: " + objects[i].getLabel() + "\r\n";
			str += "x: " + objects[i].getX() + "\r\n";
			str += "y: " + objects[i].getY() + "\r\n";
			str += "radius: " + objects[i].getRadius() + "\r\n";
			str += "selected: " + objects[i].getSelected() + "\r\n";
			str += "visible: " + objects[i].getVisible() + "\r\n";
		}
		str += "\r\n";
		if (morphisms.length === 1) {
			str += morphisms.length + " " + STR_MORPHISM + "\r\n";
		} else {
			str += morphisms.length + " " + STR_MORPHISMS + "\r\n";
		}
		for (var i = 0; i < morphisms.length; i++) {
			str += "id: " + morphisms[i].getId() + "\r\n";
			str += "label: " + morphisms[i].getLabel() + "\r\n";
			str += "source: " + morphisms[i].getSource() + "\r\n";
			str += "target: " + morphisms[i].getTarget() + "\r\n";
			str += "width: " + morphisms[i].getWidth() + "\r\n";
			str += "type: " + morphisms[i].getType() + "\r\n";
			str += "selected: " + morphisms[i].getSelected() + "\r\n";
			str += "visible: " + morphisms[i].getVisible() + "\r\n";
		}
		alert(str);
		keyboardMouseStatus = currentKeyboardMouseStatus;
		// console.log(currentKeyboardMouseStatus);
	}
	if (evtobj.keyCode === 59 && keyboardMouseStatus !== "tsv open") {//; (semicolon)
		if (ctrlPressed) {
			var undoneActions = state.getUndoneActions();
			var str = "";
			for (var i = 0; i < undoneActions.length; i++) {
				str += "undone action: " + undoneActions[i] + "\r\n";
			}
			alert(str);
		} else {
			var doneActions = state.getDoneActions();
			var states = state.getStates();
			var str = "";
			for (var i = 0; i < doneActions.length; i++) {
				str += "done action: " + doneActions[i] + "\r\n";
				switch (doneActions[i]) {
					case "createEndomorphism":
						str += "endomorphism id: " + states[i].endomorphisms.getId() + "\r\n";
						break;
					case "createMorphism":
						str += "morphism id: " + states[i].morphisms.getId() + "\r\n";
						break;
					case "createMorphismFrom":
						break;
					case "createMorphismTo":
						break;
					case "createObject":
						str += "object id: " + states[i].objects.getId() + "\r\n";
						str += "id id: " + states[i].endomorphisms.getId() + "\r\n";
						break;
					case "cutSelected":
						for (var j = 0; j < states[i].objects.length; j++) {
							str += "object id: " + states[i].objects[j].getId() + "\r\n";
						}
						for (var j = 0; j < states[i].morphisms.length; j++) {
							str += "morphism id: " + states[i].morphisms[j].getId() + "\r\n";
						}
						for (var j = 0; j < states[i].endomorphisms.length; j++) {
							str += "endomorphism id: " + states[i].endomorphisms[j].getId() + "\r\n";
						}
						break;
					case "deleteMorphism":
						break;
					case "deleteObject":
						break;
					case "deleteSelected":
						for (var j = 0; j < states[i].objects.length; j++) {
							str += "object id: " + states[i].objects[j].getId() + "\r\n";
						}
						for (var j = 0; j < states[i].morphisms.length; j++) {
							str += "morphism id: " + states[i].morphisms[j].getId() + "\r\n";
						}
						for (var j = 0; j < states[i].endomorphisms.length; j++) {
							str += "endomorphism id: " + states[i].endomorphisms[j].getId() + "\r\n";
						}
						break;
					case "dragSelected":
						for (var j = 0; j < states[i].objects.length; j++) {
							str += "object id: " + states[i].objects[j].getId() + "\r\n";
						}
						for (var j = 0; j < states[i].morphisms.length; j++) {
							str += "morphism id: " + states[i].morphisms[j].getId() + "\r\n";
						}
						for (var j = 0; j < states[i].endomorphisms.length; j++) {
							str += "endomorphism id: " + states[i].endomorphisms[j].getId() + "\r\n";
						}
						break;
					case "pasteSelected":
						break;
					case "moveMorphism":
						break;
					case "moveObject":
						break;
				}
			}
			alert(str);
		}
	}
	if ((evtobj.keyCode === 108 || evtobj.keyCode === 190) && keyboardMouseStatus !== "tsv open") {//. (dot)
		var str = "";
		if (selectedElements.length === 1) {
			str += selectedElements.length + " " + STR_SELECTED_ELEMENT + ": \r\n";
		} else {
			str += selectedElements.length + " " + STR_SELECTED_ELEMENTS + ": \r\n";
		}
		for (var i = 0; i < selectedElements.length; i++) {
			str += selectedElements[i].type + " " + selectedElements[i].element.getId() + "\r\n";
		}
		alert(str);
	}
	if ((evtobj.keyCode === 110 || evtobj.keyCode === 188) && keyboardMouseStatus !== "tsv open") {//, (comma)
		alert(STR_CURRENT_STATE + ": " + keyboardMouseStatus);
	}
	switch (keyboardMouseStatus) {
		case "idle":
			if (ctrlPressed) {
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (shiftPressed) {
				keyboardMouseStatus = "shift";
				// console.log("shift");
			} else if (evtobj.keyCode === 8) {//backspace
				keyboardMouseStatus = "backspace";
				// console.log("backspace");
				drawing.eraseLastDrawing();
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if (evtobj.keyCode === 9) {//tab
				e.preventDefault();
				keyboardMouseStatus = "tab";
				// console.log("tab");
				$("body").css("cursor", "pointer");
			} else if ((48 <= evtobj.keyCode && evtobj.keyCode <= 57) || (96 <= evtobj.keyCode && evtobj.keyCode <= 105)) {//0 to 9
				keyboardMouseStatus = "0-9";
				// console.log("0-9");
				drawing.changeBrushColor(evtobj.keyCode);
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if (evtobj.keyCode === 107 || evtobj.keyCode === 109 || evtobj.keyCode === 173) {//+--
				keyboardMouseStatus = "+-";
				// console.log("+-");
				if (evtobj.keyCode === 107) drawing.increaseBrushSize();
				else drawing.decreaseBrushSize();
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if (evtobj.keyCode === 112) {//F1
				keyboardMouseStatus = "f1";
				// console.log("f1");
				window.open("html/help.html", "_blank");
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if (evtobj.keyCode === 113) {//F2
				keyboardMouseStatus = "f2";
				// console.log("f2");
				window.open("html/dev.html", "_blank");
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if (evtobj.keyCode === SHORTCUT_MORPHISM_TYPE_MORPHISM.charCodeAt(0)) {//q
				currentMorphismType = "morphism";
			} else if (evtobj.keyCode === SHORTCUT_MORPHISM_TYPE_MONOMORPHISM.charCodeAt(0)) {//w
				currentMorphismType = "monomorphism";
			} else if (evtobj.keyCode === SHORTCUT_MORPHISM_TYPE_EPIMORPHISM.charCodeAt(0)) {//e
				currentMorphismType = "epimorphism";
			} else if (evtobj.keyCode === SHORTCUT_MORPHISM_TYPE_MONOEPIMORPHISM.charCodeAt(0)) {//r
				currentMorphismType = "monoepimorphism";
			} else if (evtobj.keyCode === SHORTCUT_MORPHISM_TYPE_ISOMORPHISM.charCodeAt(0)) {//t
				currentMorphismType = "isomorphism";
			}
			break;
		case "ctrl":
			if (shiftPressed) {
				keyboardMouseStatus = "ctrl+shift";
				// console.log("ctrl+shift");
			} else if (evtobj.keyCode === 8) {//backspace
				keyboardMouseStatus = "ctrl+backspace";
				// console.log("ctrl+backspace");
				drawing.eraseAllDrawings();
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 32) {
				e.preventDefault();
				keyboardMouseStatus = "ctrl+space";
				// console.log("ctrl+space");
				var str = "";
				if (objects.length === 1) {
					str += objects.length + " " + STR_OBJECT + "\r\n";
				} else {
					str += objects.length + " " + STR_OBJECTS + "\r\n";
				}
				for (var i = 0; i < objects.length; i++) {
					var id = objects[i].getId();
					var object = d3.select("#circle"+id);
					str += "id: " + id + "\r\n";
					str += "cx: " + object.attr("cx") + "\r\n";
					str += "cy: " + object.attr("cy") + "\r\n";
					str += "r: " + object.attr("r") + "\r\n";
					str += "fill: " + object.attr("fill") + "\r\n";
				}
				str += "\r\n";
				if (morphisms.length === 1) {
					str += morphisms.length + " " + STR_MORPHISM + "\r\n";
				} else {
					str += morphisms.length + " " + STR_MORPHISMS + "\r\n";
				}
				for (var i = 0; i < morphisms.length; i++) {
					var id = morphisms[i].getId();
					str += "id: " + id + "\r\n";
					str += "type: " + morphisms[i].getType() + "\r\n";
					if (morphisms[i].getType() !== "endomorphism") {
						var morphism = d3.select(".curve"+id);
						str += "d: " + morphism.attr("d") + "\r\n";
						str += "fill: " + morphism.attr("fill") + "\r\n";
						str += "stroke-linecap: " + morphism.attr("stroke-linecap") + "\r\n";
						str += "stroke: " + morphism.attr("stroke") + "\r\n";
						str += "stroke-width: " + morphism.attr("stroke-width") + "\r\n";
					} else {
						var morphism = d3.select(".line"+id);
						var lines = [];
						lines.push(d3.select("#line"+id+"_"+0));
						lines.push(d3.select("#line"+id+"_"+1));
						lines.push(d3.select("#line"+id+"_"+2));
						lines.push(d3.select("#line"+id+"_"+3));
						lines.push(d3.select("#line"+id+"_"+4));
						var points = [];
						points.push(["["+lines[0].attr("x1"), lines[0].attr("y1")+"]"]);
						points.push(["["+lines[1].attr("x1"), lines[1].attr("y1")+"]"]);
						points.push(["["+lines[2].attr("x1"), lines[2].attr("y1")+"]"]);
						points.push(["["+lines[3].attr("x2"), lines[3].attr("y2")+"]"]);
						points.push(["["+lines[4].attr("x2"), lines[4].attr("y2")+"]"]);
						str += "points: " + points + "\r\n";
						str += "stroke: " + morphism.attr("stroke") + "\r\n";
						str += "stroke-width: " + morphism.attr("stroke-width") + "\r\n";
					}
				}
				alert(str);
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 61) {
				keyboardMouseStatus = "+-";
				// console.log("+-");
				drawing.increaseBrushSize();
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 'A'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+a";
				// console.log("ctrl+a");
				selectAll();
				if (selectedElements.length > 0) {
					keyboardMouseStatus = "ctrl with element(s) selected";
					// console.log("ctrl with element(s) selected");
				} else {
					keyboardMouseStatus = "ctrl";
					// console.log("ctrl");
				}
			} else if (evtobj.keyCode === 'O'.charCodeAt(0)) {
				keyboardMouseStatus = "tsv open";
				// console.log("tsv open");
				// files.copyTSVs();
			} else if (evtobj.keyCode === 'P'.charCodeAt(0)) {
				keyboardMouseStatus = "tsv open";
				// console.log("tsv open");
				// files.pasteTSVs();
			} else if (evtobj.keyCode === 'S'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+s";
				// console.log("ctrl+s");
				state.saveCurrentState();
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 'V'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+v";
				// console.log("ctrl+v");
				var reallyPastedElements = pasteCopiedElements();
				state.createState("pasteSelected", reallyPastedElements);
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 'Y'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+y";
				// console.log("ctrl+y");
				state.gotoNextState();
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 'Z'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+z";
				// console.log("ctrl+z");
				state.gotoPrevState();
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			}
			break;
		case "shift":
			if (ctrlPressed) {
				keyboardMouseStatus = "ctrl+shift";
				// console.log("ctrl+shift");
			}
			break;
		case "input open":
			if (evtobj.keyCode === 8) {//backspace
				var inputs = null;
				if ([CREATE_OBJECT, READ_OBJECT, UPDATE_OBJECT].has(inputCode)) {
					inputs = document.getElementsByClassName("menuObjectInput");
				} else if ([CREATE_MORPHISM_TO, CREATE_MORPHISM_FROM, CHANGE_TYPE, READ_MORPHISM, UPDATE_MORPHISM].has(inputCode)) {
					inputs = document.getElementsByClassName("menuMorphismInput");
				}
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i] === document.activeElement && inputs[i].value.length > 0) {
						if (inputs[i].name === "label") {
							labelString = labelString.substring(0, labelString.length - 1);
							if (labelString.length <= 18) {
								inputs[i].value = labelString;
							} else {
								inputs[i].value = labelString.substring(labelString.length-18);
							}
						} else if (inputs[i].name === "x") {
							xString = xString.substring(0, xString.length - 1);
							if (xString.length <= 18) {
								inputs[i].value = xString;
							} else {
								inputs[i].value = xString.substring(xString.length-18);
							}
							if (xString.length === 0) {
								inputs[i].value = 0;
							}
						} else if (inputs[i].name === "y") {
							yString = yString.substring(0, yString.length - 1);
							if (yString.length <= 18) {
								inputs[i].value = yString;
							} else {
								inputs[i].value = yString.substring(yString.length-18);
							}
							if (yString.length === 0) {
								inputs[i].value = 0;
							}
						} else if (inputs[i].name === "source") {
							sourceString = sourceString.substring(0, sourceString.length - 1);
							if (sourceString.length <= 18) {
								inputs[i].value = sourceString;
							} else {
								inputs[i].value = sourceString.substring(sourceString.length-18);
							}
							if (sourceString.length === 0) {
								inputs[i].value = 0;
							}
						} else if (inputs[i].name === "target") {
							targetString = targetString.substring(0, targetString.length - 1);
							if (targetString.length <= 18) {
								inputs[i].value = targetString;
							} else {
								inputs[i].value = targetString.substring(targetString.length-18);
							}
							if (targetString.length === 0) {
								inputs[i].value = 0;
							}
						}
					}
				}
			} else if (evtobj.keyCode === 9) {//tab
				var inputs = null;
				if ([CREATE_OBJECT, READ_OBJECT, UPDATE_OBJECT].has(inputCode)) {
					inputs = document.getElementsByClassName("menuObjectInput");
				} else if ([CREATE_MORPHISM_TO, CREATE_MORPHISM_FROM, CHANGE_TYPE, READ_MORPHISM, UPDATE_MORPHISM].has(inputCode)) {
					inputs = document.getElementsByClassName("menuMorphismInput");
				}
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i] === document.activeElement) {
						if (!shiftPressed) {
							i = ++i % inputs.length;
							while (inputs[i].disabled) {
								i = ++i % inputs.length;
							}
						} else {
							i = (i-1+inputs.length) % inputs.length;
							while (inputs[i].disabled) {
								i = (i-1+inputs.length) % inputs.length;
							}
						}
						inputs[i].focus();
					}
				}
			} else if (evtobj.keyCode === 13) {//enter
				keyboardMouseStatus = "idle";
				// console.log("idle");
				menu.executeInputDialog();
			} else if (evtobj.keyCode === 27) {//esc
				keyboardMouseStatus = "idle";
				// console.log("idle");
				menu.closeInputDialog();
			} else {
				var inputs = null;
				if ([CREATE_OBJECT, READ_OBJECT, UPDATE_OBJECT].has(inputCode)) {
					inputs = document.getElementsByClassName("menuObjectInput");
				} else if ([CREATE_MORPHISM_TO, CREATE_MORPHISM_FROM, CHANGE_TYPE, READ_MORPHISM, UPDATE_MORPHISM].has(inputCode)) {
					inputs = document.getElementsByClassName("menuMorphismInput");
				}
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i] === document.activeElement) {
						if (inputs[i].name === "label") {
							if ('A'.charCodeAt(0) <= evtobj.keyCode && evtobj.keyCode <= 'Z'.charCodeAt(0)) {
								labelString += String.fromCharCode(evtobj.keyCode + 32 * ((!capsOn && !shiftPressed) || (capsOn && shiftPressed)));;
							} else if (48 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '0';} else {labelString += ')';}
							} else if (49 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '¹';} else {labelString += '1';}} else {labelString += '!';}
							} else if (50 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '²';} else {labelString += '2';}} else {labelString += '@';}
							} else if (51 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '³';} else {labelString += '3';}} else {labelString += '#';}
							} else if (52 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '£';} else {labelString += '4';}} else {labelString += '$';}
							} else if (53 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '¢';} else {labelString += '5';}} else {labelString += '%';}
							} else if (54 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '¬';} else {labelString += '6';}} else {labelString += '¨';}
							} else if (55 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '7';} else {labelString += '&';}
							} else if (56 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '8';} else {labelString += '*';}
							} else if (57 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '9';} else {labelString += '(';}
							} else if (59 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += ';';} else {labelString += ':';}
							} else if (61 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '§';} else {labelString += '=';}} else {labelString += '+';}
							} else if (96 <= evtobj.keyCode && evtobj.keyCode <= 105) {
								labelString += String.fromCharCode(evtobj.keyCode - 48);
							} else if (106 === evtobj.keyCode) {
								labelString += '*';
							} else if (107 === evtobj.keyCode) {
								labelString += '+';
							} else if (108 === evtobj.keyCode) {
								labelString += '.';
							} else if (109 === evtobj.keyCode) {
								labelString += '-';
							} else if (110 === evtobj.keyCode) {
								labelString += ',';
							} else if (111 === evtobj.keyCode) {
								labelString += '/';
							} else if (173 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '-';} else {labelString += '_';}
							} else if (176 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '~';} else {labelString += '^';}
							} else if (188 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += ',';} else {labelString += '<';}
							} else if (190 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '.';} else {labelString += '>';}
							} else if (191 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += '°';} else {labelString += '/';}} else {labelString += '?';}
							} else if (192 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '´';} else {labelString += '`';}
							} else if (219 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += 'ª';} else {labelString += '[';}} else {labelString += '{';}
							} else if (220 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '\\';} else {labelString += '|';}
							} else if (221 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {labelString += 'º';} else {labelString += ']';}} else {labelString += '}';}
							} else if (222 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '\'';} else {labelString += '\"';}
							}
							if (labelString.length <= 18) {
								inputs[i].value = labelString;
							} else {
								inputs[i].value = labelString.substring(labelString.length-18);
							}
						} else if (inputs[i].name === "x") {
							if (48 <= evtobj.keyCode && evtobj.keyCode <= 57) {
								xString += String.fromCharCode(evtobj.keyCode);
							} else if (96 <= evtobj.keyCode && evtobj.keyCode <= 105) {
								xString += String.fromCharCode(evtobj.keyCode - 48);
							}
							if (xString.length <= 16) {
								inputs[i].value = xString;
							} else {
								inputs[i].value = xString.substring(xString.length-16);
							}
						} else if (inputs[i].name === "y") {
							if (48 <= evtobj.keyCode && evtobj.keyCode <= 57) {
								yString += String.fromCharCode(evtobj.keyCode);
							} else if (96 <= evtobj.keyCode && evtobj.keyCode <= 105) {
								yString += String.fromCharCode(evtobj.keyCode - 48);
							}
							if (yString.length <= 16) {
								inputs[i].value = yString;
							} else {
								inputs[i].value = yString.substring(yString.length-16);
							}
						} else if (inputs[i].name === "source") {
							if (48 <= evtobj.keyCode && evtobj.keyCode <= 57) {
								sourceString += String.fromCharCode(evtobj.keyCode);
							} else if (96 <= evtobj.keyCode && evtobj.keyCode <= 105) {
								sourceString += String.fromCharCode(evtobj.keyCode - 48);
							}
							if (sourceString.length <= 16) {
								inputs[i].value = sourceString;
							} else {
								inputs[i].value = sourceString.substring(sourceString.length-16);
							}
						} else if (inputs[i].name === "target") {
							if (48 <= evtobj.keyCode && evtobj.keyCode <= 57) {
								targetString += String.fromCharCode(evtobj.keyCode);
							} else if (96 <= evtobj.keyCode && evtobj.keyCode <= 105) {
								targetString += String.fromCharCode(evtobj.keyCode - 48);
							}
							if (targetString.length <= 16) {
								inputs[i].value = targetString;
							} else {
								inputs[i].value = targetString.substring(targetString.length-16);
							}
						} else if (inputs[i].name === "types") {
							if (48 + 1 <= evtobj.keyCode && evtobj.keyCode <= 48 + inputs[i].options.length) {
								targetString = String.fromCharCode(evtobj.keyCode);
								inputs[i].options[parseInt(targetString) - 1].selected = true;
							} else if (96 + 1 <= evtobj.keyCode && evtobj.keyCode <= 96 + inputs[i].options.length) {
								targetString = String.fromCharCode(evtobj.keyCode - 48);
								inputs[i].options[parseInt(targetString) - 1].selected = true;
							}
						}
					}
				}
			}
			break;
		case "input open with element(s) selected":
			if (evtobj.keyCode === 13) {//enter
				keyboardMouseStatus = "idle with element(s) selected";
				console.log("idle with element(s) selected");
			} else if (evtobj.keyCode === 27) {//esc
				keyboardMouseStatus = "idle with element(s) selected";
				console.log("idle with element(s) selected");
			}
			break;
		case "menu open":
			if (evtobj.keyCode === 27) {
				$(document).click();
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if (menuCode === CANVAS_MENU) {
				switch (evtobj.keyCode) {
					case SHORTCUT_CREATE_OBJECT.charCodeAt(0):
						menu.openInputDialog(CREATE_OBJECT);
						break;
					case SHORTCUT_SELECT_ALL.charCodeAt(0):
						menu.openInputDialog(SELECT_ALL);
						break;
					case SHORTCUT_SELECT_OBJECTS.charCodeAt(0):
						menu.openInputDialog(SELECT_OBJECTS);
						break;
					case SHORTCUT_SELECT_MORPHISMS.charCodeAt(0):
						menu.openInputDialog(SELECT_MORPHISMS);
						break;
					case SHORTCUT_SELECT_ENDOMORPHISMS.charCodeAt(0):
						menu.openInputDialog(SELECT_ENDOMORPHISMS);
						break;
				}
			} else if (menuCode === OBJECT_MENU) {
				switch (evtobj.keyCode) {
					case SHORTCUT_CREATE_MORPHISM_TO.charCodeAt(0):
						menu.openInputDialog(CREATE_MORPHISM_TO);
						break;
					case SHORTCUT_CREATE_MORPHISM_FROM.charCodeAt(0):
						menu.openInputDialog(CREATE_MORPHISM_FROM);
						break;
					case SHORTCUT_READ_OBJECT.charCodeAt(0):
						menu.openInputDialog(READ_OBJECT);
						break;
					case SHORTCUT_UPDATE_OBJECT.charCodeAt(0):
						menu.openInputDialog(UPDATE_OBJECT);
						break;
					case SHORTCUT_DELETE_OBJECT.charCodeAt(0):
						menu.openInputDialog(DELETE_OBJECT);
						break;
					case SHORTCUT_SELECT_OBJECT.charCodeAt(0):
						menu.openInputDialog(SELECT_OBJECT);
						break;
				}
			} else if (menuCode === MORPHISM_MENU) {
				switch (evtobj.keyCode) {
					case SHORTCUT_CHANGE_TYPE.charCodeAt(0):
						menu.openInputDialog(CHANGE_TYPE);
						break;
					case SHORTCUT_READ_MORPHISM.charCodeAt(0):
						menu.openInputDialog(READ_MORPHISM);
						break;
					case SHORTCUT_UPDATE_MORPHISM.charCodeAt(0):
						menu.openInputDialog(UPDATE_MORPHISM);
						break;
					case SHORTCUT_DELETE_MORPHISM.charCodeAt(0):
						menu.openInputDialog(DELETE_MORPHISM);
						break;
					case SHORTCUT_SELECT_MORPHISM.charCodeAt(0):
						menu.openInputDialog(SELECT_MORPHISM);
						break;
				}
			}
			break;
		case "tsv open":
			if (evtobj.keyCode === 8) {//backspace
				var inputs = document.getElementsByClassName("tsvInput");
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i] === document.activeElement && inputs[i].value.length > 0) {
						if (i === 0) {
							objectTSVString = objectTSVString.substring(0, objectTSVString.length - 1);
							if (objectTSVString.length <= 18) {
								inputs[i].value = objectTSVString;
							} else {
								inputs[i].value = objectTSVString.substring(objectTSVString.length-18);
							}
						} else if (i === 1) {
							morphismTSVString = morphismTSVString.substring(0, morphismTSVString.length - 1);
							if (morphismTSVString.length <= 18) {
								inputs[i].value = morphismTSVString;
							} else {
								inputs[i].value = morphismTSVString.substring(morphismTSVString.length-18);
							}
						}
					}
				}
			} else if (evtobj.keyCode === 9) {//tab
				var inputs = document.getElementsByClassName("tsvInput");
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i] === document.activeElement) {
						if (!shiftPressed) {
							i = ++i % inputs.length;
						} else {
							i = (i-1+inputs.length) % inputs.length;
						}
						inputs[i].focus();
					}
				}
			} else if (evtobj.keyCode === 13) {//enter
				files.execute();
				files.closeTSVInputDialog();
			} else if (evtobj.keyCode === 27) {//esc
				files.closeTSVInputDialog();
			} else {
				var inputs = document.getElementsByClassName("tsvInput");
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i] === document.activeElement) {
						if (i === 0) {
							if ('C'.charCodeAt(0) === evtobj.keyCode && ctrlPressed) {
								console.log(objectTSVString);
							} else if ('A'.charCodeAt(0) <= evtobj.keyCode && evtobj.keyCode <= 'Z'.charCodeAt(0)) {
								objectTSVString += String.fromCharCode(evtobj.keyCode + 32 * ((!capsOn && !shiftPressed) || (capsOn && shiftPressed)));;
							} else if (48 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '0';} else {objectTSVString += ')';}
							} else if (49 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '¹';} else {objectTSVString += '1';}} else {objectTSVString += '!';}
							} else if (50 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '²';} else {objectTSVString += '2';}} else {objectTSVString += '@';}
							} else if (51 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '³';} else {objectTSVString += '3';}} else {objectTSVString += '#';}
							} else if (52 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '£';} else {objectTSVString += '4';}} else {objectTSVString += '$';}
							} else if (53 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '¢';} else {objectTSVString += '5';}} else {objectTSVString += '%';}
							} else if (54 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '¬';} else {objectTSVString += '6';}} else {objectTSVString += '¨';}
							} else if (55 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '7';} else {objectTSVString += '&';}
							} else if (56 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '8';} else {objectTSVString += '*';}
							} else if (57 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '9';} else {objectTSVString += '(';}
							} else if (59 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += ';';} else {objectTSVString += ':';}
							} else if (61 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '§';} else {objectTSVString += '=';}} else {objectTSVString += '+';}
							} else if (96 <= evtobj.keyCode && evtobj.keyCode <= 105) {
								objectTSVString += String.fromCharCode(evtobj.keyCode - 48);
							} else if (106 === evtobj.keyCode) {
								objectTSVString += '*';
							} else if (107 === evtobj.keyCode) {
								objectTSVString += '+';
							} else if (108 === evtobj.keyCode) {
								objectTSVString += '.';
							} else if (109 === evtobj.keyCode) {
								objectTSVString += '-';
							} else if (110 === evtobj.keyCode) {
								objectTSVString += ',';
							} else if (111 === evtobj.keyCode) {
								objectTSVString += '/';
							} else if (173 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '-';} else {objectTSVString += '_';}
							} else if (176 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '~';} else {objectTSVString += '^';}
							} else if (188 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += ',';} else {objectTSVString += '<';}
							} else if (190 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '.';} else {objectTSVString += '>';}
							} else if (191 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += '°';} else {objectTSVString += '/';}} else {objectTSVString += '?';}
							} else if (192 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '´';} else {objectTSVString += '`';}
							} else if (219 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += 'ª';} else {objectTSVString += '[';}} else {objectTSVString += '{';}
							} else if (220 === evtobj.keyCode) {
								if (!shiftPressed) {objectTSVString += '\\';} else {objectTSVString += '|';}
							} else if (221 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {objectTSVString += 'º';} else {objectTSVString += ']';}} else {objectTSVString += '}';}
							} else if (222 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '\'';} else {labelString += '\"';}
							}
							if (objectTSVString.length <= 18) {
								inputs[i].value = objectTSVString;
							} else {
								inputs[i].value = objectTSVString.substring(objectTSVString.length-18);
							}
						} else if (i === 1) {
							if ('C'.charCodeAt(0) === evtobj.keyCode && ctrlPressed) {
								console.log(morphismTSVString);
							} else if ('A'.charCodeAt(0) <= evtobj.keyCode && evtobj.keyCode <= 'Z'.charCodeAt(0)) {
								morphismTSVString += String.fromCharCode(evtobj.keyCode + 32 * ((!capsOn && !shiftPressed) || (capsOn && shiftPressed)));;
							} else if (48 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '0';} else {morphismTSVString += ')';}
							} else if (49 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '¹';} else {morphismTSVString += '1';}} else {morphismTSVString += '!';}
							} else if (50 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '²';} else {morphismTSVString += '2';}} else {morphismTSVString += '@';}
							} else if (51 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '³';} else {morphismTSVString += '3';}} else {morphismTSVString += '#';}
							} else if (52 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '£';} else {morphismTSVString += '4';}} else {morphismTSVString += '$';}
							} else if (53 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '¢';} else {morphismTSVString += '5';}} else {morphismTSVString += '%';}
							} else if (54 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '¬';} else {morphismTSVString += '6';}} else {morphismTSVString += '¨';}
							} else if (55 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '7';} else {morphismTSVString += '&';}
							} else if (56 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '8';} else {morphismTSVString += '*';}
							} else if (57 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '9';} else {morphismTSVString += '(';}
							} else if (59 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += ';';} else {morphismTSVString += ':';}
							} else if (61 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '§';} else {morphismTSVString += '=';}} else {morphismTSVString += '+';}
							} else if (96 <= evtobj.keyCode && evtobj.keyCode <= 105) {
								morphismTSVString += String.fromCharCode(evtobj.keyCode - 48);
							} else if (106 === evtobj.keyCode) {
								morphismTSVString += '*';
							} else if (107 === evtobj.keyCode) {
								morphismTSVString += '+';
							} else if (108 === evtobj.keyCode) {
								morphismTSVString += '.';
							} else if (109 === evtobj.keyCode) {
								morphismTSVString += '-';
							} else if (110 === evtobj.keyCode) {
								morphismTSVString += ',';
							} else if (111 === evtobj.keyCode) {
								morphismTSVString += '/';
							} else if (173 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '-';} else {morphismTSVString += '_';}
							} else if (176 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '~';} else {morphismTSVString += '^';}
							} else if (188 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += ',';} else {morphismTSVString += '<';}
							} else if (190 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '.';} else {morphismTSVString += '>';}
							} else if (191 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += '°';} else {morphismTSVString += '/';}} else {morphismTSVString += '?';}
							} else if (192 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '´';} else {morphismTSVString += '`';}
							} else if (219 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += 'ª';} else {morphismTSVString += '[';}} else {morphismTSVString += '{';}
							} else if (220 === evtobj.keyCode) {
								if (!shiftPressed) {morphismTSVString += '\\';} else {morphismTSVString += '|';}
							} else if (221 === evtobj.keyCode) {
								if (!shiftPressed) {if (ctrlPressed && altPressed) {morphismTSVString += 'º';} else {morphismTSVString += ']';}} else {morphismTSVString += '}';}
							} else if (222 === evtobj.keyCode) {
								if (!shiftPressed) {labelString += '\'';} else {labelString += '\"';}
							}
							if (morphismTSVString.length <= 18) {
								inputs[i].value = morphismTSVString;
							} else {
								inputs[i].value = morphismTSVString.substring(morphismTSVString.length-18);
							}
						}
					}
				}
			}
			break;
		case "menu open with element(s) selected":
			if (evtobj.keyCode === 27) {
				$(document).click();
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
			} else if (menuCode === MULTIPLE_MENU) {
				switch (evtobj.keyCode) {
					case SHORTCUT_CUT_SELECTED.charCodeAt(0):
						menu.openInputDialog(CUT_SELECTED);
						break;
					case SHORTCUT_COPY_SELECTED.charCodeAt(0):
						menu.openInputDialog(COPY_SELECTED);
						break;
					case SHORTCUT_DUPLICATE_MORPHISM.charCodeAt(0):
						menu.openInputDialog(DUPLICATE_MORPHISM);
						break;
					case SHORTCUT_DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_SOURCE.charCodeAt(0):
						menu.openInputDialog(DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_SOURCE);
						break;
					case SHORTCUT_DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_TARGET.charCodeAt(0):
						console.log(SHORTCUT_DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_TARGET);
						menu.openInputDialog(DUPLICATE_OBJECT_AND_MORPHISM_WITH_SAME_TARGET);
						break;
				}
			}
			break;
		case "idle with element(s) selected":
			if (ctrlPressed) {
				keyboardMouseStatus = "ctrl with element(s) selected";
				// console.log("ctrl with element(s) selected");
			} else if (shiftPressed) {
				keyboardMouseStatus = "shift with element(s) selected";
				console.log("shift with element(s) selected");
			} else if (evtobj.keyCode === 8) {//backspace
				keyboardMouseStatus = "backspace with element(s) selected";
				console.log("backspace with element(s) selected");
				drawing.eraseLastDrawing();
				keyboardMouseStatus = "idle with element(s) selected";
				console.log("idle with element(s) selected");
			} else if (evtobj.keyCode === 9) {//tab
				e.preventDefault();
				keyboardMouseStatus = "tab with element(s) selected";
				console.log("tab with element(s) selected");
			} else if (evtobj.keyCode === 46) {//delete
				keyboardMouseStatus = "selected delete";
				// console.log("selected delete");
				state.createState("deleteSelected", selectedElements);
				hideSelectedElements();
				var objectsChanged = [];
				for (var i = 0; i < selectedElements.length; i++) {
					if (selectedElements[i].type === "endomorphism") {
						objectsChanged.push(selectedElements[i].element.getSource());
					}
				}
				objectsChanged = objectsChanged.uniques();
				for (var i = 0; i < objectsChanged.length; i++) {
					var object = getObjectById(objectsChanged[i]);
					var endomorphismsArray = object.getEndomorphisms().filter(function(e) {return e.getVisible();});
					var angle = 360 / endomorphismsArray.length;
					for (var j = 0; j < endomorphismsArray.length; j++) {
						var x = object.getX() + Math.degCos(90 + j * angle);
						var y = object.getY() - Math.degSin(90 + j * angle);
						view.updateEndomorphism(endomorphismsArray[j], [x, y]);
						view.updateEndomorphismLabel(endomorphismsArray[j], [x, y]);
					}
				}
				selectedElements = [];
				keyboardMouseStatus = "idle";
				// console.log("idle");
			} else if ((48 <= evtobj.keyCode && evtobj.keyCode <= 57) || (96 <= evtobj.keyCode && evtobj.keyCode <= 105)) {//0 to 9
				keyboardMouseStatus = "0-9 with element(s) selected";
				console.log("0-9 with element(s) selected");
				drawing.changeBrushColor(evtobj.keyCode);
				keyboardMouseStatus = "idle with element(s) selected";
				console.log("idle with element(s) selected");
			} else if (evtobj.keyCode === 107 || evtobj.keyCode === 109 || evtobj.keyCode === 173) {//+--
				keyboardMouseStatus = "+- with element(s) selected";
				console.log("+- with element(s) selected");
				if (evtobj.keyCode === 107) drawing.increaseBrushSize();
				else drawing.decreaseBrushSize();
				keyboardMouseStatus = "idle with element(s) selected";
				console.log("idle with element(s) selected");
			} else if (evtobj.keyCode === 112) {//F1
				keyboardMouseStatus = "f1 with element(s) selected";
				console.log("f1 with element(s) selected");
				window.open("html/help.html", "_blank");
				keyboardMouseStatus = "idle with element(s) selected";
				console.log("idle with element(s) selected");
			} else if (evtobj.keyCode === 113) {//F2
				keyboardMouseStatus = "f2 with element(s) selected";
				console.log("f2 with element(s) selected");
				window.open("html/dev.html", "_blank");
				keyboardMouseStatus = "idle with element(s) selected";
				console.log("idle with element(s) selected");
			}
			break;
		case "ctrl with element(s) selected":
			if (shiftPressed) {
				keyboardMouseStatus = "ctrl+shift with element(s) selected";
				console.log("ctrl+shift with element(s) selected");
			} else if (evtobj.keyCode === 8) {//backspace
				keyboardMouseStatus = "ctrl+backspace";
				console.log("ctrl+backspace");
				drawing.eraseAllDrawings();
				keyboardMouseStatus = "ctrl with element(s) selected";
				console.log("ctrl with element(s) selected");
			} else if (evtobj.keyCode === 61) {
				keyboardMouseStatus = "+-";
				console.log("+-");
				drawing.increaseBrushSize();
				keyboardMouseStatus = "ctrl with element(s) selected";
				console.log("ctrl with element(s) selected");
			} else if (evtobj.keyCode === 'A'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+a";
				// console.log("ctrl+a");
				selectAll();
				keyboardMouseStatus = "ctrl with element(s) selected";
				// console.log("ctrl with element(s) selected");
			} else if (evtobj.keyCode === 'C'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+c";
				// console.log("ctrl+c");
				copySelected();
				keyboardMouseStatus = "ctrl with element(s) selected";
				// console.log("ctrl with element(s) selected");
			} else if (evtobj.keyCode === 'S'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+s";
				console.log("ctrl+s");
				state.saveCurrentState();
				keyboardMouseStatus = "ctrl with element(s) selected";
				console.log("ctrl with element(s) selected");
			} else if (evtobj.keyCode === 'V'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+v";
				// console.log("ctrl+v");
				// removeHiddenElements();
				var reallyPastedElements = pasteCopiedElements();
				state.createState("pasteSelected", reallyPastedElements);
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 'X'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+x";
				// console.log("ctrl+x");
				state.createState("cutSelected", selectedElements);
				cutSelected();
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			} else if (evtobj.keyCode === 'Y'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+y";
				// console.log("ctrl+y");
				state.gotoNextState();
				keyboardMouseStatus = "ctrl with element(s) selected";
				// console.log("ctrl with element(s) selected");
			} else if (evtobj.keyCode === 'Z'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+z";
				// console.log("ctrl+z");
				state.gotoPrevState();
				keyboardMouseStatus = "ctrl with element(s) selected";
				// console.log("ctrl with element(s) selected");
			}
			break;
		case "shift with element(s) selected":
			if (ctrlPressed) {
				keyboardMouseStatus = "ctrl+shift with element(s) selected";
				console.log("ctrl+shift with element(s) selected");
			}
			break;
		case "ctrl+shift with element(s) selected":
			if (evtobj.keyCode === 'A'.charCodeAt(0)) {
				keyboardMouseStatus = "deselect all";
				// console.log("deselect all");
				deselectAll();
				keyboardMouseStatus = "ctrl+shift";
				// console.log("ctrl+shift");
			} else if (evtobj.keyCode === 'S'.charCodeAt(0)) {
				keyboardMouseStatus = "ctrl+shift+s";
				// console.log("ctrl+shift+s");
				state.deletePreviousState();
				keyboardMouseStatus = "ctrl+shift";
				// console.log("ctrl+shift");
			}
			break;
	}
});

window.addEventListener("keyup", function(e) {
	var evtobj = window.event? event : e;
	ctrlReleased = ctrlPressed && !evtobj.ctrlKey;
	shiftReleased = shiftPressed && !evtobj.shiftKey;
	altReleased = altPressed && !evtobj.altKey;
	
	switch (keyboardMouseStatus) {
		case "ctrl":
			if (ctrlReleased) {
				keyboardMouseStatus = "idle";
				// console.log("idle");
			}
			break;
		case "shift":
			if (shiftReleased) {
				keyboardMouseStatus = "idle";
				// console.log("idle");
			}
			break;
		case "ctrl+shift":
			if (ctrlReleased) {
				keyboardMouseStatus = "shift";
				// console.log("shift");
			} else if (shiftReleased) {
				keyboardMouseStatus = "ctrl";
				// console.log("ctrl");
			}
			break;
		case "tab":
			if (evtobj.keyCode === 9) {//tab
				keyboardMouseStatus = "idle";
				// console.log("idle");
				$("body").css("cursor", "default");
			}
			break;
		case "ctrl with element(s) selected":
			if (ctrlReleased) {
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
			}
			break;
		case "shift with element(s) selected":
			if (shiftReleased) {
				keyboardMouseStatus = "idle with element(s) selected";
				// console.log("idle with element(s) selected");
			}
			break;
		case "ctrl+shift with element(s) selected":
			if (ctrlReleased) {
				keyboardMouseStatus = "shift with element(s) selected";
				// console.log("idle shift element(s) selected");
			}
			if (shiftReleased) {
				keyboardMouseStatus = "ctrl with element(s) selected";
				// console.log("ctrl with element(s) selected");
			}
			break;
	}
});
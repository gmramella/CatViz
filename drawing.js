function Drawing() {
	var drawingsCounter = 0;
	
	/*
	Erase all drawings
	*/
	this.eraseAllDrawings = function() {
		d3.selectAll(".drawing").remove();
		drawingsCounter = 0;
	}
	
	/*
	Erase last drawing (which begins on mousedown and ends on mouseup)
	*/
	this.eraseLastDrawing = function() {
		if (drawingsCounter > 0) d3.selectAll(".drawing"+(--drawingsCounter)).remove();
		else if (drawingsCounter === 0) d3.selectAll(".drawing"+drawingsCounter).remove();
	}
	
	/*
	Change brush color
	*/
	this.changeBrushColor = function(key) {
		if (49 <= key && key <= 54) {
				DRAWING_COLOR = RAINBOW_COLORS[key - 49];
			} else if (97 <= key && key <= 102) {
				DRAWING_COLOR = RAINBOW_COLORS[key - 97];
			} if (55 <= key && key <= 57) {
				DRAWING_COLOR = BLACK_TO_GRAYS_TO_WHITE_COLORS[key - 55];
			} if (103 <= key && key <= 105) {
				DRAWING_COLOR = BLACK_TO_GRAYS_TO_WHITE_COLORS[key - 103];
			} else if (key === 48) {
				DRAWING_COLOR = BLACK_TO_GRAYS_TO_WHITE_COLORS[key - 48 + 3];
			} else if (key === 96) {
				DRAWING_COLOR = BLACK_TO_GRAYS_TO_WHITE_COLORS[key - 96 + 3];
			}
	}
	
	/*
	Decrease brush size
	*/
	this.decreaseBrushSize = function() {
		DRAWING_WIDTH = Math.max(--DRAWING_WIDTH, MIN_DRAWING_WIDTH);
	}
	
	/*
	Increase brush size
	*/
	this.increaseBrushSize = function() {
		DRAWING_WIDTH = Math.min(++DRAWING_WIDTH, MAX_DRAWING_WIDTH);
	}
	
	/*
	Start drawing
	*/
	this.startDrawing = function(p) {
		drawingLastCoords = p;
	}
	
	/*
	Update draw
	*/
	this.updateDrawing = function(p) {
		var path = "M " + drawingLastCoords[0] + " " + drawingLastCoords[1] + " L " + p[0] + " " + p[1];
		d3.select(".layer5").append("path").attr("class", "drawing drawing" + drawingsCounter).attr("d", path).attr("fill", "transparent").attr("stroke-linecap", "round").attr("stroke", DRAWING_COLOR).attr("stroke-width", DRAWING_WIDTH);
		drawingLastCoords = p;
	}
	
	/*
	Stop drawing
	*/
	this.stopDrawing = function() {
		drawingsCounter++;
	}
}
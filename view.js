function View() {
	//https://stackoverflow.com/questions/8339377/how-to-get-screen-width-without-minus-scrollbar
	this.canvasWidth = Math.floor(0.99 * $("body").prop("clientWidth"));
	this.canvasHeight = Math.floor(0.96 * (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight));
	
	//Canvas methods
	/*
	Create canvas with 99% and 96% of the canvas' width and height, respectively
	and different layers
		layer 0: border rectangle and blur rectangle
		layer 1: selection rectangle
		layer 2: morphisms
		layer 3: objects
		layer 4: morphisms' handles
		layer 5: free drawing
		layer 6: debugging grid
	and a border
	*/
	var borderAndBlueRectangleLayer;
	var selectionRectangleLayer;
	var morphismsLayer;
	var objectsLayer;
	var morphismsHandlesLayer;
	var freeDrawingLayer;
	var debuggingGridLayer;
	this.createCanvas = function() {
		var canvasPtr = d3.select("body").append("svg").attr("id", "canvas").attr("width", this.canvasWidth).attr("height", this.canvasHeight);
		//https://www.dashingd3js.com/svg-group-element-and-d3js
		//https://stackoverflow.com/questions/31383045/appending-to-group-not-working-in-d3-js
		canvasPtr.append("g").attr("class", "layer6").append("g").attr("class", "layer5").append("g").attr("class", "layer4").append("g").attr("class", "layer3").append("g").attr("class", "layer2").append("g").attr("class", "layer1").append("g").attr("class", "layer0");
		borderAndBlueRectangleLayer = d3.select(".layer0");
		selectionRectangleLayer = d3.select(".layer1");
		debuggingGridLayer = d3.select(".layer2");
		morphismsLayer = d3.select(".layer3");
		objectsLayer = d3.select(".layer4");
		morphismsHandlesLayer = d3.select(".layer5");
		freeDrawingLayer = d3.select(".layer6");
		borderAndBlueRectangleLayer.append("rect").attr("id", "borderRectangle").attr("x", 0).attr("y", 0).attr("width", this.canvasWidth).attr("height", this.canvasHeight).attr("stroke", "#000000").attr("fill", "none");
		return canvasPtr;
	};
	this.canvas = this.createCanvas();
	
	this.createGrid = function() {
		var d = 20;
		for (var i=0;i<(this.canvasHeight-d)/d;i++) {
			debuggingGridLayer.append("line").attr("x1", 0).attr("y1", d*i).attr("x2", this.canvasWidth-d).attr("y2", d*i).attr("stroke", GRID_COLOR).attr("stroke-width", GRID_WIDTH).attr("stroke-opacity", GRID_OPACITY);
		}
		for (var i=0;i<(this.canvasWidth-d)/d;i++) {
			debuggingGridLayer.append("line").attr("x1", d*i).attr("y1", 0).attr("x2", d*i).attr("y2", this.canvasHeight-d).attr("stroke", GRID_COLOR).attr("stroke-width", GRID_WIDTH).attr("stroke-opacity", GRID_OPACITY);
		}
		for (var i=0;i<(this.canvasWidth-d)/d;i++) {
			var ptr = debuggingGridLayer.append("text").attr("id", "horGridLabel"+i).text(d*i).attr("x", d*i).attr("y", this.canvasHeight).attr("font-family", GRID_FONT_NAME).attr("font-size", GRID_FONT_SIZE).attr("fill", GRID_COLOR);
			ptr.attr("x", Number(ptr.attr("x"))-document.getElementById("horGridLabel"+i).getComputedTextLength()/2);//align center
		}
		for (var i=0;i<(this.canvasHeight-d)/d;i++) {
			var ptr = debuggingGridLayer.append("text").attr("id", "verGridLabel"+i).text(d*i).attr("x", this.canvasWidth-d/2).attr("y", d*i).attr("font-family", GRID_FONT_NAME).attr("font-size", GRID_FONT_SIZE).attr("fill", GRID_COLOR);
			ptr.attr("x", Number(ptr.attr("x"))-document.getElementById("verGridLabel"+i).getComputedTextLength()/2);//align center
		}
	}
	
	this.createLimit = function() {
		debuggingGridLayer.append("line").attr("x1", LIMIT).attr("y1", LIMIT).attr("x2", this.canvasWidth-LIMIT).attr("y2", LIMIT).attr("stroke", GRID_COLOR).attr("stroke-width", GRID_WIDTH);
		debuggingGridLayer.append("line").attr("x1", LIMIT).attr("y1", this.canvasHeight-LIMIT).attr("x2", this.canvasWidth-LIMIT).attr("y2", this.canvasHeight-LIMIT).attr("stroke", GRID_COLOR).attr("stroke-width", GRID_WIDTH);
		
		debuggingGridLayer.append("line").attr("x1", LIMIT).attr("y1", LIMIT).attr("x2", LIMIT).attr("y2", this.canvasHeight-LIMIT).attr("stroke", GRID_COLOR).attr("stroke-width", GRID_WIDTH);
		debuggingGridLayer.append("line").attr("x1", this.canvasWidth-LIMIT).attr("y1", LIMIT).attr("x2", this.canvasWidth-LIMIT).attr("y2", this.canvasHeight-LIMIT).attr("stroke", GRID_COLOR).attr("stroke-width", GRID_WIDTH);
	}
	
	if (GRID_VISIBLE) {
		this.createGrid();
	}
	if (LIMIT_VISIBLE) {
		this.createLimit();
	}
	//--------------
	
	//Blur rectangle methods
	/*
	Create blur rectangle when the application is not focused
	*/
	this.createBlurRectangle = function() {
		borderAndBlueRectangleLayer.append("rect").attr("id", "blurRectangle").attr("x", 0).attr("y", 0).attr("width", this.canvasWidth).attr("height", this.canvasHeight).attr("fill", "#808080");
	};
	
	/*
	Remove blur rectangle when the application is focused
	*/
	this.removeBlurRectangle = function() {
		d3.select("#blurRectangle").attr("fill", "white").remove();
	};
	//----------------------
	
	//Selection rectangle methods
	/*
	Create a selection rectangle to select elements with mouse drag
	*/
	this.createSelectionRectangle = function(p) {
		var points = "";
		points+=p[0]+","+p[1]+" ";
		points+=p[0]+","+p[1]+" ";
		points+=p[0]+","+p[1]+" ";
		points+=p[0]+","+p[1];
		selectionRectangleLayer.append("polygon").attr("class", "rect").attr("id", "selectionRectangle").attr("points", points).attr("stroke", RECT_STROKE).attr("stroke-width", RECT_WIDTH).attr("fill", RECT_FILL);
	}
	
	/*
	Update the selection rectangle when mouse changes coords
	*/
	this.updateSelectionRectangle = function(p1, p2) {
		if (p2[0] < 0) p2[0] = 0;
		if (p2[1] < 0) p2[1] = 0;
		if (p2[0] > view.canvasWidth) p2[0] = view.canvasWidth;
		if (p2[1] > view.canvasHeight) p2[1] = view.canvasHeight;
		var points = "";
		points+=p1[0]+","+p1[1]+" ";
		points+=p2[0]+","+p1[1]+" ";
		points+=p2[0]+","+p2[1]+" ";
		points+=p1[0]+","+p2[1];
		d3.select("#selectionRectangle").attr("points", points);
	}
	
	/*
	Delete the selection rectangle on mouseup
	*/
	this.deleteSelectionRectangle = function() {
		d3.select("#selectionRectangle").remove();
	}
	//---------------------------
	
	//Create methods
	/*
	Create circle at point p
	*/
	this.createCircle = function(p) {
		var x = p[0];
		var y = p[1];
		objectsLayer.append("circle").attr("class", "circle").attr("id", "circle"+objectsCounter).attr("cx", x).attr("cy", y).attr("r", DEFAULT_CIRCLE_RADIUS).attr("fill", DEFAULT_CIRCLE_COLOR);
	};
	
	/*
	Create morphism arrow: ->
	*/
	function createMorphismArrow(p0, p1, p2) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var arrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				arrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtArrowStart = Math.realAngle([x(arrowStart), y(arrowStart)], [x(arrowStart+0.0001), y(arrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(arrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(arrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(arrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(arrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+1).attr("x1", x(arrowStart)).attr("y1", y(arrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+2).attr("x1", x(arrowStart)).attr("y1", y(arrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Create monomorphism arrow: >->
	*/
	function createMonomorphismArrow(p0, p1, p2) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Create epimorphism arrow: ->>
	*/
	function createEpimorphismArrow(p0, p1, p2) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		var secondArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Create mono+epimorphism arrow: >->>
	*/
	function createMonoepimorphismArrow(p0, p1, p2) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		var thirdArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtThirdArrowStart = Math.realAngle([x(thirdArrowStart), y(thirdArrowStart)], [x(thirdArrowStart+0.0001), y(thirdArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtThirdArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtThirdArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x7 = x(thirdArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y7 = y(thirdArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x8 = x(thirdArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y8 = y(thirdArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+5).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x7).attr("y2", y7).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+6).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x8).attr("y2", y8).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Create isomorphism arrow: >-\\
	*/
	function createIsomorphismArrow(p0, p1, p2) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x4 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		var thirdArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtThirdArrowStart = Math.realAngle([x(thirdArrowStart), y(thirdArrowStart)], [x(thirdArrowStart+0.0001), y(thirdArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtThirdArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtThirdArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x6 = x(thirdArrowStart)+Math.degCos(90+arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(thirdArrowStart)-Math.degSin(90+arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+6).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Create bezier from circle centered at p1 with radius r1 to circle centered at p2 with radius r2
	*/
	this.createBezier = function(p1, p2) {
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		var m = [0.5 * (x1 + x2), 0.5 * (y1 + y2)];
		var r = [m[0], m[1]];
		
		var path = "M " + x1 + " " + y1 + " Q " + r[0] + " " + r[1] + " " + x2 + " " + y2;
		var t = 0.5;
		var c = [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * r[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * r[1] + t * t * y2];
		var curvePtr = morphismsLayer.append("path").attr("class", "curve"+" "+"curve"+morphismsCounter).attr("id", "curve"+morphismsCounter+"_"+0).attr("d", path).attr("fill", "transparent").attr("stroke-linecap", "round").attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		var handlePtr = morphismsHandlesLayer.append("circle").attr("class", "curvehandle").attr("id", "curvehandle"+morphismsCounter).attr("cx", c[0]).attr("cy", c[1]).attr("r", DEFAULT_HANDLE_RADIUS).attr("fill", DEFAULT_HANDLE_COLOR);
		
		var p0 = [x1, y1];
		var p1 = r;
		var p2 = [x2, y2];
		
		switch (currentMorphismType) {
			case "morphism":
				createMorphismArrow(p0, p1, p2);
				break;
			case "monomorphism":
				createMonomorphismArrow(p0, p1, p2);
				break;
			case "epimorphism":
				createEpimorphismArrow(p0, p1, p2);
				break;
			case "monoepimorphism":
				createMonoepimorphismArrow(p0, p1, p2);
				break;
			case "isomorphism":
				createIsomorphismArrow(p0, p1, p2);
				break;
		}
		
		return {p0: p0, p1: p1, p2: p2, curve: curvePtr, handle: handlePtr};
	};
	
	/*
	Create endomorphism at point p
	*/
	this.createEndomorphism = function(object, r, angle, id = morphismsCounter) {
		var d = [r * Math.degCos(angle),				-r * Math.degSin(angle)];
		var points = [];
		points.push(object.getPosition());
		points.push([r * Math.degCos(angle + 30),		-r * Math.degSin(angle + 30)]);
		points.push([r * Math.degCos(angle - 30),		-r * Math.degSin(angle - 30)]);
		points.push([r * Math.degCos(angle) / 2,		-r * Math.degSin(angle) / 2]);
		points.push([r * Math.degCos(angle - 90) / 2,	-r * Math.degSin(angle - 90) / 2]);
		points[0][0] += d[0];points[0][1] += d[1];
		for (var i = 1; i < points.length; i++) {
			points[i][0] += points[0][0];points[i][1] += points[0][1];
		}
		
		morphismsLayer.append("line").attr("class", "line"+" "+"line"+id).attr("id", "line"+id+"_"+0).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[1][0]).attr("y2", points[1][1]).attr("stroke", DEFAULT_ENDOMORPHISM_COLOR).attr("stroke-width", DEFAULT_ENDOMORPHISM_WIDTH);
		morphismsLayer.append("line").attr("class", "line"+" "+"line"+id).attr("id", "line"+id+"_"+1).attr("x1", points[1][0]).attr("y1", points[1][1]).attr("x2", points[2][0]).attr("y2", points[2][1]).attr("stroke", DEFAULT_ENDOMORPHISM_COLOR).attr("stroke-width", DEFAULT_ENDOMORPHISM_WIDTH);
		morphismsLayer.append("line").attr("class", "line"+" "+"line"+id).attr("id", "line"+id+"_"+2).attr("x1", points[2][0]).attr("y1", points[2][1]).attr("x2", points[0][0]).attr("y2", points[0][1]).attr("stroke", DEFAULT_ENDOMORPHISM_COLOR).attr("stroke-width", DEFAULT_ENDOMORPHISM_WIDTH);
		
		morphismsLayer.append("line").attr("class", "line"+" "+"line"+id).attr("id", "line"+id+"_"+3).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[3][0]).attr("y2", points[3][1]).attr("stroke", DEFAULT_ENDOMORPHISM_COLOR).attr("stroke-width", DEFAULT_ENDOMORPHISM_WIDTH);
		morphismsLayer.append("line").attr("class", "line"+" "+"line"+id).attr("id", "line"+id+"_"+4).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[4][0]).attr("y2", points[4][1]).attr("stroke", DEFAULT_ENDOMORPHISM_COLOR).attr("stroke-width", DEFAULT_ENDOMORPHISM_WIDTH);
		//.attr("class", "class1").attr("class", "class2") will not add 2 classes
		
		var c = [(points[1][0] + points[2][0]) / 2, (points[1][1] + points[2][1]) / 2];
		var handlePtr = morphismsHandlesLayer.append("circle").attr("class", "curvehandle").attr("id", "curvehandle"+id).attr("cx", c[0]).attr("cy", c[1]).attr("r", DEFAULT_HANDLE_RADIUS).attr("fill", DEFAULT_HANDLE_COLOR);
		
		return {handle: handlePtr};
	}
	
	/*
	Create id endomorphism at point p
	*/
	this.createIdEndomorphism = function(object, r) {
		var temp = this.createEndomorphism(object, r, 90);
		d3.selectAll(".line"+morphismsCounter).attr("stroke", DEFAULT_ID_ENDOMORPHISM_COLOR);
		d3.select("#curvehandle"+morphismsCounter).attr("fill", DEFAULT_ID_HANDLE_COLOR);
		return temp;
	}
	
	/*
	Create circle label at point p
	*/
	this.createCircleLabel = function(p) {
		var x = p[0];
		var y = p[1];
		var text = currentObjectLabel();
		var circleLabelPtr = objectsLayer.append("text").attr("class", "circlelabel").attr("id", "circlelabel"+objectsCounter).text(text).attr("x", x).attr("y", y+8).attr("font-family", DEFAULT_CIRCLE_LABEL_FONT_NAME).attr("font-size", DEFAULT_CIRCLE_LABEL_FONT_SIZE).attr("fill", DEFAULT_CIRCLE_LABEL_COLOR);
		circleLabelPtr.attr("x", Number(circleLabelPtr.attr("x"))-document.getElementById("circlelabel"+objectsCounter).getComputedTextLength()/2);//align center
	};
	
	/*
	Create bezier label
	*/
	this.createBezierLabel = function(handle) {
		var x = handle.attr("cx");
		var y = handle.attr("cy");
		var text = currentMorphismLabel();
		var curveLabelPtr = morphismsHandlesLayer.append("text").attr("class", "curvelabel").attr("id", "curvelabel" + morphismsCounter).text(text).attr("x", x).attr("y", y).attr("font-family", DEFAULT_CURVE_LABEL_FONT_NAME).attr("font-size", DEFAULT_CURVE_LABEL_FONT_SIZE).attr("fill", DEFAULT_CURVE_LABEL_COLOR);
		curveLabelPtr.attr("x", Number(curveLabelPtr.attr("x")) - document.getElementById("curvelabel" + morphismsCounter).getComputedTextLength()/2);//align center
		curveLabelPtr.attr("y", Number(curveLabelPtr.attr("y")) + document.getElementById("curvelabel" + morphismsCounter).getBBox().height/4);//align center
	};
	
	/*
	Create endomorphism label
	*/
	this.createEndomorphismLabel = function(handle, id = morphismsCounter) {
		var x = handle.attr("cx");
		var y = handle.attr("cy");
		var text = currentMorphismLabel();
		var endomorphismLabelptr = morphismsHandlesLayer.append("text").attr("class", "linelabel").attr("id", "linelabel" + id).text(text).attr("x", x).attr("y", y).attr("font-family", DEFAULT_ENDOMORPHISM_LABEL_FONT_NAME).attr("font-size", DEFAULT_ENDOMORPHISM_LABEL_FONT_SIZE).attr("fill", DEFAULT_ENDOMORPHISM_LABEL_COLOR);
		endomorphismLabelptr.attr("x", Number(endomorphismLabelptr.attr("x")) - document.getElementById("linelabel" + id).getComputedTextLength()/2);//align center
		endomorphismLabelptr.attr("y", Number(endomorphismLabelptr.attr("y")) + document.getElementById("linelabel" + id).getBBox().height/4);//align center
	}
	
	/*
	Create id endomorphism label
	*/
	this.createIdEndomorphismLabel = function(handle, r) {
		var x = handle.attr("cx");
		var y = handle.attr("cy");
		var text = "id"+objects.last().getLabel();
		var endomorphismLabelptr = morphismsHandlesLayer.append("text").attr("class", "linelabel").attr("id", "linelabel" + morphismsCounter).text(text).attr("x", x).attr("y", y).attr("font-family", DEFAULT_ENDOMORPHISM_LABEL_FONT_NAME).attr("font-size", DEFAULT_ENDOMORPHISM_LABEL_FONT_SIZE).attr("fill", DEFAULT_ENDOMORPHISM_LABEL_COLOR);
		endomorphismLabelptr.attr("x", Number(endomorphismLabelptr.attr("x")) - document.getElementById("linelabel" + morphismsCounter).getComputedTextLength()/2);//align center
		endomorphismLabelptr.attr("y", Number(endomorphismLabelptr.attr("y")) + document.getElementById("linelabel" + morphismsCounter).getBBox().height/4);//align center
	}
	//--------------
	
	//Change methods
	/*
	Change object label
	*/
	this.changeCircleLabel = function(object) {
		var id = object.getId();
		var p = object.getPosition();
		var x = p[0];
		var y = p[1];
		var text = object.getLabel();
		d3.select("#circlelabel"+id).remove();
		var circleLabelPtr = objectsLayer.append("text").attr("class", "circlelabel").attr("id", "circlelabel"+id).text(text).attr("x", x).attr("y", y+8).attr("font-family", DEFAULT_CIRCLE_LABEL_FONT_NAME).attr("font-size", DEFAULT_CIRCLE_LABEL_FONT_SIZE).attr("fill", DEFAULT_CIRCLE_LABEL_COLOR);
		circleLabelPtr.attr("x", Number(circleLabelPtr.attr("x"))-document.getElementById("circlelabel"+id).getComputedTextLength()/2);//align center
	}
	
	/*
	Change object position
	*/
	this.changeCirclePosition = function(object) {
		var id = object.getId();
		var x = object.getX();
		var y = object.getY();
		d3.select("#circle"+id).attr("cx", x).attr("cy", y);
	}
	
	/*
	Change object label position
	*/
	this.changeCircleLabelPosition = function(object) {
		var id = object.getId();
		var x = object.getX();
		var y = object.getY();
		var text = object.getLabel();
		d3.select("#circlelabel"+id).remove();
		var circleLabelPtr = objectsLayer.append("text").attr("class", "circlelabel").attr("id", "circlelabel"+id).text(text).attr("x", x).attr("y", y+8).attr("font-family", DEFAULT_CIRCLE_LABEL_FONT_NAME).attr("font-size", DEFAULT_CIRCLE_LABEL_FONT_SIZE).attr("fill", DEFAULT_CIRCLE_LABEL_COLOR);
		circleLabelPtr.attr("x", Number(circleLabelPtr.attr("x"))-document.getElementById("circlelabel"+id).getComputedTextLength()/2);//align center
	}
	
	/*
	Change bezier label
	*/
	this.changeBezierLabel = function(morphism, p) {
		var id = morphism.getId();
		var source = getObjectById(morphism.getSource());
		var target = getObjectById(morphism.getTarget());
		var p1 = source.getPosition();
		var p2 = target.getPosition();
		var r1 = source.getRadius();
		var r2 = target.getRadius();
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		var m = ((y2-y1)/(x2-x1));
		var realCosSign1 = null;var realSinSign1 = null;var realCosSign2 = null;var realSinSign2 = null;
		var realAngleBetweenObjects = Math.realAngle([x1, y1], [x2, y2]);
		if(realAngleBetweenObjects === 0)										{realCosSign1 = 1;realSinSign1 = 0;realCosSign2 = -1;realSinSign2 = 0;}
		else if(realAngleBetweenObjects >   0 && realAngleBetweenObjects <  90)	{realCosSign1 = 1;realSinSign1 = 1;realCosSign2 = -1;realSinSign2 = -1;}
		else if(realAngleBetweenObjects === 90)									{realCosSign1 = 0;realSinSign1 = 1;realCosSign2 = 0;realSinSign2 = -1;}
		else if(realAngleBetweenObjects >  90 && realAngleBetweenObjects < 180)	{realCosSign1 = -1;realSinSign1 = -1;realCosSign2 = 1;realSinSign2 = 1;}
		else if(realAngleBetweenObjects === 180)									{realCosSign1 = -1;realSinSign1 = 0;realCosSign2 = 1;realSinSign2 = 0;}
		else if(realAngleBetweenObjects > 180 && realAngleBetweenObjects < 270)	{realCosSign1 = -1;realSinSign1 = -1;realCosSign2 = 1;realSinSign2 = 1;}
		else if(realAngleBetweenObjects === 270)									{realCosSign1 = 0;realSinSign1 = 1;realCosSign2 = 0;realSinSign2 = -1;}
		else if(realAngleBetweenObjects > 270 && realAngleBetweenObjects < 360)	{realCosSign1 = 1;realSinSign1 = 1;realCosSign2 = -1;realSinSign2 = -1;}
		
		var m = [0.5 * (x1 + x2), 0.5 * (y1 + y2)];
		var r = [m[0] + 2 * (p[0] - m[0]), m[1] + 2 * (p[1] - m[1])];
		var t = 0.5;
		var c = [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * r[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * r[1] + t * t * y2];
		d3.select("#curvelabel"+id).attr("x", c[0]-4).attr("y", c[1]+4);
	}
	
	/*
	Change bezier
	*/
	this.changeBezier = function(morphism, p) {
		var id = morphism.getId();
		var source = getObjectById(morphism.getSource());
		var target = getObjectById(morphism.getTarget());
		var p1 = source.getPosition();
		var p2 = target.getPosition();
		var r1 = source.getRadius();
		var r2 = target.getRadius();
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		var m = [0.5 * (x1 + x2), 0.5 * (y1 + y2)];
		var r = [m[0] + 2 * (p[0] - m[0]), m[1] + 2 * (p[1] - m[1])];
		
		var path = "M " + x1 + " " + y1 + " Q " + r[0] + " " + r[1] + " " + x2 + " " + y2;
		var t = 0.5;
		var c = [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * r[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * r[1] + t * t * y2];
		var curvePtr = d3.select(".curve"+id).attr("d", path);
		var handlePtr = d3.select("#curvehandle"+id).attr("cx", c[0]).attr("cy", c[1]);
		
		var p0 = [x1, y1];
		var p1 = r;
		var p2 = [x2, y2];
		
		switch (morphism.getType()) {
			case "morphism":
				updateMorphismArrow(p0, p1, p2, id);
				break;
			case "monomorphism":
				updateMonomorphismArrow(p0, p1, p2, id);
				break;
			case "epimorphism":
				updateEpimorphismArrow(p0, p1, p2, id);
				break;
			case "monoepimorphism":
				updateMonoepimorphismArrow(p0, p1, p2, id);
				break;
			case "isomorphism":
				updateIsomorphismArrow(p0, p1, p2, id);
				break;
		}
		
		return {p0: p0, p1: p1, p2: p2, curve: curvePtr, handle: handlePtr};
	}
	
	/*
	Change bezier type
	*/
	this.changeBezierType = function(morphism) {
		var id = morphism.getId();
		var points = morphism.getPoints();
		var position = morphism.getHandlePosition();
		var p1 = getObjectById(morphism.getSource()).getPosition();
		var p2 = getObjectById(morphism.getTarget()).getPosition();
		d3.selectAll(".curve" + id).remove();
		d3.selectAll("#curvehandle" + id).remove();
		d3.selectAll("#curvelabel" + id).remove();
		
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		var m = [0.5 * (x1 + x2), 0.5 * (y1 + y2)];
		var r = [m[0], m[1]];
		
		var path = "M " + x1 + " " + y1 + " Q " + r[0] + " " + r[1] + " " + x2 + " " + y2;
		var t = 0.5;
		var c = [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * r[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * r[1] + t * t * y2];
		var curvePtr = morphismsLayer.append("path").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+0).attr("d", path).attr("fill", "transparent").attr("stroke-linecap", "round").attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		var handlePtr = morphismsHandlesLayer.append("circle").attr("class", "curvehandle").attr("id", "curvehandle"+id).attr("cx", c[0]).attr("cy", c[1]).attr("r", DEFAULT_HANDLE_RADIUS).attr("fill", DEFAULT_HANDLE_COLOR);
		
		var x = handlePtr.attr("cx");
		var y = handlePtr.attr("cy");
		var text = morphism.getLabel();
		var curveLabelPtr = morphismsHandlesLayer.append("text").attr("class", "curvelabel").attr("id", "curvelabel" + id).text(text).attr("x", x).attr("y", y).attr("font-family", DEFAULT_CURVE_LABEL_FONT_NAME).attr("font-size", DEFAULT_CURVE_LABEL_FONT_SIZE).attr("fill", DEFAULT_CURVE_LABEL_COLOR);
		curveLabelPtr.attr("x", Number(curveLabelPtr.attr("x")) - document.getElementById("curvelabel" + id).getComputedTextLength()/2);//align center
		curveLabelPtr.attr("y", Number(curveLabelPtr.attr("y")) + document.getElementById("curvelabel" + id).getBBox().height/4);//align center
		
		morphism.setHandlePosition([x, y]);
		
		var p0 = [x1, y1];
		var p1 = r;
		var p2 = [x2, y2];
		
		switch (morphism.getType()) {
			case "morphism":
				changeMorphismArrow(morphism, p0, p1, p2);
				break;
			case "monomorphism":
				changeMonomorphismArrow(morphism, p0, p1, p2);
				break;
			case "epimorphism":
				changeEpimorphismArrow(morphism, p0, p1, p2);
				break;
			case "monoepimorphism":
				changeMonoepimorphismArrow(morphism, p0, p1, p2);
				break;
			case "isomorphism":
				changeIsomorphismArrow(morphism, p0, p1, p2);
				break;
		}
		
		return {p0: p0, p1: p1, p2: p2, curve: curvePtr, handle: handlePtr};
	};
	
	/*
	Change morphism arrow: ->
	*/
	function changeMorphismArrow(morphism, p0, p1, p2) {
		var id = morphism.getId();
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var arrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				arrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtArrowStart = Math.realAngle([x(arrowStart), y(arrowStart)], [x(arrowStart+0.0001), y(arrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(arrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(arrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(arrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(arrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+1).attr("x1", x(arrowStart)).attr("y1", y(arrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+2).attr("x1", x(arrowStart)).attr("y1", y(arrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Change monomorphism arrow: >->
	*/
	function changeMonomorphismArrow(morphism, p0, p1, p2) {
		var id = morphism.getId();
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Change epimorphism arrow: ->>
	*/
	function changeEpimorphismArrow(morphism, p0, p1, p2) {
		var id = morphism.getId();
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		var secondArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Change mono+epimorphism arrow: >->>
	*/
	function changeMonoepimorphismArrow(morphism, p0, p1, p2) {
		var id = morphism.getId();
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		var thirdArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtThirdArrowStart = Math.realAngle([x(thirdArrowStart), y(thirdArrowStart)], [x(thirdArrowStart+0.0001), y(thirdArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtThirdArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtThirdArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x7 = x(thirdArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y7 = y(thirdArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x8 = x(thirdArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y8 = y(thirdArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+5).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x7).attr("y2", y7).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+6).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x8).attr("y2", y8).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Change isomorphism arrow: >-\\
	*/
	function changeIsomorphismArrow(morphism, p0, p1, p2) {
		var id = morphism.getId();
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x4 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x4).attr("y2", y4).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		
		var thirdArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtThirdArrowStart = Math.realAngle([x(thirdArrowStart), y(thirdArrowStart)], [x(thirdArrowStart+0.0001), y(thirdArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtThirdArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtThirdArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x6 = x(thirdArrowStart)+Math.degCos(90+arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(thirdArrowStart)-Math.degSin(90+arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		morphismsLayer.append("line").attr("class", "curve"+" "+"curve"+id).attr("id", "curve"+id+"_"+6).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x6).attr("y2", y6).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	}
	
	/*
	Change endomorphism
	*/
	this.changeEndomorphism = function(morphism, p) {
		var id = morphism.getId();
		var object = getObjectById(morphism.getSource());
		
		var ra = Math.realAngle(object.getPosition(), p);
		var r = Math.distance(object.getPosition(), [Number(morphism.getHandle().attr("cx")), Number(morphism.getHandle().attr("cy"))]);
		var x = object.getX() + r * Math.degCos(ra);
		var y = object.getY() - r * Math.degSin(ra);
		var handlePtr = d3.select("#curvehandle" + id).attr("cx", x).attr("cy", y);
		
		var r = object.getRadius();
		var angle = ra;
		var d = [r * Math.degCos(angle),				-r * Math.degSin(angle)];
		var points = [];
		points.push(object.getPosition());
		points.push([r * Math.degCos(angle + 30),		-r * Math.degSin(angle + 30)]);
		points.push([r * Math.degCos(angle - 30),		-r * Math.degSin(angle - 30)]);
		points.push([r * Math.degCos(angle) / 2,		-r * Math.degSin(angle) / 2]);
		points.push([r * Math.degCos(angle - 90) / 2,	-r * Math.degSin(angle - 90) / 2]);
		points[0][0] += d[0];points[0][1] += d[1];
		for (var i = 1; i < points.length; i++) {
			points[i][0] += points[0][0];points[i][1] += points[0][1];
		}
		
		d3.select("#line" + id + "_" + 0).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[1][0]).attr("y2", points[1][1]);
		d3.select("#line" + id + "_" + 1).attr("x1", points[1][0]).attr("y1", points[1][1]).attr("x2", points[2][0]).attr("y2", points[2][1]);
		d3.select("#line" + id + "_" + 2).attr("x1", points[2][0]).attr("y1", points[2][1]).attr("x2", points[0][0]).attr("y2", points[0][1]);
		
		d3.select("#line" + id + "_" + 3).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[3][0]).attr("y2", points[3][1]);
		d3.select("#line" + id + "_" + 4).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[4][0]).attr("y2", points[4][1]);
		//.attr("class", "class1").attr("class", "class2") will not add 2 classes
		
		var c = [(points[1][0] + points[2][0]) / 2, (points[1][1] + points[2][1]) / 2];
		d3.select("#curvehandle" + id).attr("cx", c[0]).attr("cy", c[1]);
		
		return {handle: handlePtr};
	}
	
	/*
	Change endomorphism label
	*/
	this.changeEndomorphismLabel = function(morphism, p) {
		var id = morphism.getId();
		var label = morphism.getLabel();
		var object = getObjectById(morphism.getSource());
		var ra = Math.realAngle(object.getPosition(), p);
		var r = Math.distance(object.getPosition(), [Number(morphism.getHandle().attr("cx")), Number(morphism.getHandle().attr("cy"))]);
		var x = object.getX() + r * Math.degCos(ra);
		var y = object.getY() - r * Math.degSin(ra);
		d3.select("#linelabel"+id).remove();
		var endomorphismLabelptr = morphismsHandlesLayer.append("text").attr("class", "linelabel").attr("id", "linelabel" + id).text(label).attr("x", x).attr("y", y).attr("font-family", DEFAULT_ENDOMORPHISM_LABEL_FONT_NAME).attr("font-size", DEFAULT_ENDOMORPHISM_LABEL_FONT_SIZE).attr("fill", DEFAULT_ENDOMORPHISM_LABEL_COLOR);
		endomorphismLabelptr.attr("x", Number(endomorphismLabelptr.attr("x")) - document.getElementById("linelabel" + id).getComputedTextLength()/2);//align center
		endomorphismLabelptr.attr("y", Number(endomorphismLabelptr.attr("y")) + document.getElementById("linelabel" + id).getBBox().height/4);//align center
	}
	//--------------
	
	//Update methods
	/*
	Update circle
	*/
	this.updateCircle = function(object, p) {
		var id = object.getId();
		var x = p[0];
		var y = p[1];
		object.setX(x);
		object.setY(y);
		d3.select("#circle"+id).attr("cx", x).attr("cy", y);
	}
	
	/*
	Update morphism arrow: ->
	*/
	function updateMorphismArrow(p0, p1, p2, id) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var arrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				arrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtArrowStart = Math.realAngle([x(arrowStart), y(arrowStart)], [x(arrowStart+0.0001), y(arrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(arrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(arrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(arrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(arrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+1).attr("x1", x(arrowStart)).attr("y1", y(arrowStart)).attr("x2", x3).attr("y2", y3);
		d3.select("#curve"+id+"_"+2).attr("x1", x(arrowStart)).attr("y1", y(arrowStart)).attr("x2", x4).attr("y2", y4);
	}
	
	/*
	Update monomorphism arrow: >->
	*/
	function updateMonomorphismArrow(p0, p1, p2, id) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3);
		d3.select("#curve"+id+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5);
		d3.select("#curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6);
	}
	
	/*
	Update epimorphism arrow: ->>
	*/
	function updateEpimorphismArrow(p0, p1, p2, id) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3);
		d3.select("#curve"+id+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4);
		
		var secondArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5);
		d3.select("#curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6);
	}
	
	/*
	Update mono+epimorphism arrow: >->>
	*/
	function updateMonoepimorphismArrow(p0, p1, p2, id) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x4 = x(firstArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(firstArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3);
		d3.select("#curve"+id+"_"+2).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x4).attr("y2", y4);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x6 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5);
		d3.select("#curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x6).attr("y2", y6);
		
		var thirdArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtThirdArrowStart = Math.realAngle([x(thirdArrowStart), y(thirdArrowStart)], [x(thirdArrowStart+0.0001), y(thirdArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtThirdArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtThirdArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x7 = x(thirdArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y7 = y(thirdArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x8 = x(thirdArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y8 = y(thirdArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+5).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x7).attr("y2", y7);
		d3.select("#curve"+id+"_"+6).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x8).attr("y2", y8);
	}
	
	/*
	Update isomorphism arrow: >-\\
	*/
	function updateIsomorphismArrow(p0, p1, p2, id) {
		var x1 = p0[0];
		var y1 = p0[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		function x(u) {return (1-u)*(1-u)*p0[0]+2*(1-u)*u*p1[0]+u*u*p2[0];}
		function y(u) {return (1-u)*(1-u)*p0[1]+2*(1-u)*u*p1[1]+u*u*p2[1];}
		
		//Find point where the curve intersects the target circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var firstArrowStart = null;
		for (var i = n-1; i >= 0; i--) {
			var ra = Math.realAngle([x(i/n), y(i/n)], [x(1), y(1)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(1) - DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(1) + DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				firstArrowStart = i/n;
				break;
			}
		}
		var tangentAngleAtFirstArrowStart = Math.realAngle([x(firstArrowStart), y(firstArrowStart)], [x(firstArrowStart+0.0001), y(firstArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtFirstArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtFirstArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x3 = x(firstArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y3 = y(firstArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+1).attr("x1", x(firstArrowStart)).attr("y1", y(firstArrowStart)).attr("x2", x3).attr("y2", y3);
		
		//Find point where the curve intersects the source circle
		var n = BEZIER_POINTS;
		var prec = BEZIER_PRECISION;
		var secondArrowStart = null;
		for (var i = 0; i < n; i++) {
			var ra = Math.realAngle([x(0), y(0)], [x(i/n), y(i/n)]);
			//p is the point of the circle with angle atan(m)
			var p = {x: x(0) + DEFAULT_CIRCLE_RADIUS * Math.degCos(ra), y: y(0) - DEFAULT_CIRCLE_RADIUS * Math.degSin(ra)};
			//q is the point in the curve
			var q = {x: x(i/n), y: y(i/n)};
			//if p and q are close enough:
			if ((p.x-prec <= q.x && p.x+prec >= q.x) && (p.y-prec <= q.y && p.y+prec >= q.y)) {
				secondArrowStart = i/n;
				break;
			}
		}
		
		var point = Math.partialArcLengthFromPoint(x, y, secondArrowStart, ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		secondArrowStart = point;
		var tangentAngleAtSecondArrowStart = Math.realAngle([x(secondArrowStart), y(secondArrowStart)], [x(secondArrowStart+0.0001), y(secondArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtSecondArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtSecondArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x4 = x(secondArrowStart)+Math.degCos(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var y4 = y(secondArrowStart)-Math.degSin(arrowHeadLine1EndPoint)*ARROW_HEAD_LENGTH;
		var x5 = x(secondArrowStart)+Math.degCos(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y5 = y(secondArrowStart)-Math.degSin(arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+3).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x4).attr("y2", y4);
		d3.select("#curve"+id+"_"+4).attr("x1", x(secondArrowStart)).attr("y1", y(secondArrowStart)).attr("x2", x5).attr("y2", y5);
		
		var thirdArrowStart = Math.partialArcLengthFromPoint(x, y, firstArrowStart, -ARROW_HEAD_LENGTH*Math.degCos(ARROW_HEAD_ANGLE));
		var tangentAngleAtThirdArrowStart = Math.realAngle([x(thirdArrowStart), y(thirdArrowStart)], [x(thirdArrowStart+0.0001), y(thirdArrowStart+0.0001)]);
		
		var arrowHeadLine1EndPoint = (tangentAngleAtThirdArrowStart+(180-ARROW_HEAD_ANGLE)+360)%360;
		var arrowHeadLine2EndPoint = (tangentAngleAtThirdArrowStart-(180-ARROW_HEAD_ANGLE)+360)%360;
		
		var x6 = x(thirdArrowStart)+Math.degCos(90+arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		var y6 = y(thirdArrowStart)-Math.degSin(90+arrowHeadLine2EndPoint)*ARROW_HEAD_LENGTH;
		
		d3.select("#curve"+id+"_"+6).attr("x1", x(thirdArrowStart)).attr("y1", y(thirdArrowStart)).attr("x2", x6).attr("y2", y6);
	}
	
	/*
	Update bezier
	*/
	this.updateBezier = function(morphism, p) {
		var id = morphism.getId();
		var source = getObjectById(morphism.getSource());
		var target = getObjectById(morphism.getTarget());
		var p1 = source.getPosition();
		var p2 = target.getPosition();
		var r1 = source.getRadius();
		var r2 = target.getRadius();
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		var m = [0.5 * (x1 + x2), 0.5 * (y1 + y2)];
		var r = [m[0] + 2 * (p[0] - m[0]), m[1] + 2 * (p[1] - m[1])];
		
		var path = "M " + x1 + " " + y1 + " Q " + r[0] + " " + r[1] + " " + x2 + " " + y2;
		var t = 0.5;
		var c = [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * r[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * r[1] + t * t * y2];
		var curvePtr = d3.select(".curve"+id).attr("d", path);
		var handlePtr = d3.select("#curvehandle"+id).attr("cx", c[0]).attr("cy", c[1]);
		
		var p0 = [x1, y1];
		var p1 = r;
		var p2 = [x2, y2];
		
		switch (morphism.getType()) {
			case "morphism":
				updateMorphismArrow(p0, p1, p2, id);
				break;
			case "monomorphism":
				updateMonomorphismArrow(p0, p1, p2, id);
				break;
			case "epimorphism":
				updateEpimorphismArrow(p0, p1, p2, id);
				break;
			case "monoepimorphism":
				updateMonoepimorphismArrow(p0, p1, p2, id);
				break;
			case "isomorphism":
				updateIsomorphismArrow(p0, p1, p2, id);
				break;
		}
		
		return {p0: [x1, y1], p1: r, p2: [x2, y2], curve: curvePtr, handle: handlePtr};
	}
	
	/*
	Update endomorphism
	*/
	this.updateEndomorphism = function(morphism, p) {
		var id = morphism.getId();
		var object = getObjectById(morphism.getSource());
		
		var ra = Math.realAngle(object.getPosition(), p);
		var r = Math.distance(object.getPosition(), [Number(morphism.getHandle().attr("cx")), Number(morphism.getHandle().attr("cy"))]);
		var x = object.getX() + r * Math.degCos(ra);
		var y = object.getY() - r * Math.degSin(ra);
		var handlePtr = d3.select("#curvehandle" + id).attr("cx", x).attr("cy", y);
		
		var r = object.getRadius();
		var angle = ra;
		var d = [r * Math.degCos(angle),				-r * Math.degSin(angle)];
		var points = [];
		points.push(object.getPosition());
		points.push([r * Math.degCos(angle + 30),		-r * Math.degSin(angle + 30)]);
		points.push([r * Math.degCos(angle - 30),		-r * Math.degSin(angle - 30)]);
		points.push([r * Math.degCos(angle) / 2,		-r * Math.degSin(angle) / 2]);
		points.push([r * Math.degCos(angle - 90) / 2,	-r * Math.degSin(angle - 90) / 2]);
		points[0][0] += d[0];points[0][1] += d[1];
		for (var i = 1; i < points.length; i++) {
			points[i][0] += points[0][0];points[i][1] += points[0][1];
		}
		
		d3.select("#line" + id + "_" + 0).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[1][0]).attr("y2", points[1][1]);
		d3.select("#line" + id + "_" + 1).attr("x1", points[1][0]).attr("y1", points[1][1]).attr("x2", points[2][0]).attr("y2", points[2][1]);
		d3.select("#line" + id + "_" + 2).attr("x1", points[2][0]).attr("y1", points[2][1]).attr("x2", points[0][0]).attr("y2", points[0][1]);
		
		d3.select("#line" + id + "_" + 3).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[3][0]).attr("y2", points[3][1]);
		d3.select("#line" + id + "_" + 4).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[4][0]).attr("y2", points[4][1]);
		//.attr("class", "class1").attr("class", "class2") will not add 2 classes
		
		return {handle: handlePtr};
	}
	
	/*
	Update id endomorphism
	*/
	this.updateIdEndomorphism = function(morphism, p, r) {
		this.updateEndomorphism(morphism, p, r, 90);
	}
	
	/*
	Translate bezier
	*/
	this.translateBezier = function(morphism) {
		var id = morphism.getId();
		var p1 = getObjectById(morphism.getSource()).getPosition();
		var p2 = getObjectById(morphism.getTarget()).getPosition();
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		var m = [0.5 * (x1 + x2), 0.5 * (y1 + y2)];
		var r = [m[0], m[1]];
		
		var path = "M " + x1 + " " + y1 + " Q " + r[0] + " " + r[1] + " " + x2 + " " + y2;
		var t = 0.5;
		var c = [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * r[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * r[1] + t * t * y2];
		var curvePtr = d3.select("#curve"+id+"_"+0).attr("d", path);
		var handlePtr = d3.select("#curvehandle"+id).attr("cx", c[0]).attr("cy", c[1]);
		
		var p0 = [x1, y1];
		var p1 = r;
		var p2 = [x2, y2];
		
		updateMorphismArrow(p0, p1, p2);
		// updateMonomorphismArrow(p0, p1, p2);
		// updateEpimorphismArrow(p0, p1, p2);
		// updateMonoepimorphismArrow(p0, p1, p2);
		// updateIsomorphismArrow(p0, p1, p2);
		
		return {p0: p0, p1: p1, p2: p2, curve: curvePtr, handle: handlePtr};
	}
	
	/*
	Translate endomorphism
	*/
	this.translateEndomorphism = function(morphism, p, objectPreviousPosition) {
		var id = morphism.getId();
		var object = getObjectById(morphism.getSource());
		
		var r = DEFAULT_CIRCLE_RADIUS;
		var angle = Math.realAngle(objectPreviousPosition, [morphism.getHandle().attr("cx"), morphism.getHandle().attr("cy")]);
		
		var d = [r * Math.degCos(angle),				-r * Math.degSin(angle)];
		var points = [];
		points.push(object.getPosition());
		points.push([r * Math.degCos(angle + 30),		-r * Math.degSin(angle + 30)]);
		points.push([r * Math.degCos(angle - 30),		-r * Math.degSin(angle - 30)]);
		points.push([r * Math.degCos(angle) / 2,		-r * Math.degSin(angle) / 2]);
		points.push([r * Math.degCos(angle - 90) / 2,	-r * Math.degSin(angle - 90) / 2]);
		points[0][0] += d[0];points[0][1] += d[1];
		for (var i = 1; i < points.length; i++) {
			points[i][0] += points[0][0];points[i][1] += points[0][1];
		}
		
		d3.select("#line" + id + "_" + 0).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[1][0]).attr("y2", points[1][1]);
		d3.select("#line" + id + "_" + 1).attr("x1", points[1][0]).attr("y1", points[1][1]).attr("x2", points[2][0]).attr("y2", points[2][1]);
		d3.select("#line" + id + "_" + 2).attr("x1", points[2][0]).attr("y1", points[2][1]).attr("x2", points[0][0]).attr("y2", points[0][1]);
		
		d3.select("#line" + id + "_" + 3).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[3][0]).attr("y2", points[3][1]);
		d3.select("#line" + id + "_" + 4).attr("x1", points[0][0]).attr("y1", points[0][1]).attr("x2", points[4][0]).attr("y2", points[4][1]);
		//.attr("class", "class1").attr("class", "class2") will not add 2 classes
		
		var c = [(points[1][0] + points[2][0]) / 2, (points[1][1] + points[2][1]) / 2];
		var handlePtr = d3.select("#curvehandle" + id).attr("cx", c[0]).attr("cy", c[1]);
	}
	
	/*
	Update circle label
	*/
	this.updateCircleLabel = function(object, p) {
		var id = object.getId();
		var x = p[0];
		var y = p[1];
		object.setX(x);
		object.setY(y);
		var circleLabelPtr = d3.select("#circlelabel"+id).attr("x", x).attr("y", y+8);
		circleLabelPtr.attr("x", Number(circleLabelPtr.attr("x"))-document.getElementById("circlelabel"+id).getComputedTextLength()/2);//align center
	}
	/*
	Update bezier label
	*/
	this.updateBezierLabel = function(morphism, p) {
		var id = morphism.getId();
		var source = getObjectById(morphism.getSource());
		var target = getObjectById(morphism.getTarget());
		var p1 = source.getPosition();
		var p2 = target.getPosition();
		var r1 = source.getRadius();
		var r2 = target.getRadius();
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		
		var m = ((y2-y1)/(x2-x1));
		var realCosSign1 = null;var realSinSign1 = null;var realCosSign2 = null;var realSinSign2 = null;
		var realAngleBetweenObjects = Math.realAngle([x1, y1], [x2, y2]);
		if(realAngleBetweenObjects === 0)										{realCosSign1 = 1;realSinSign1 = 0;realCosSign2 = -1;realSinSign2 = 0;}
		else if(realAngleBetweenObjects >   0 && realAngleBetweenObjects <  90)	{realCosSign1 = 1;realSinSign1 = 1;realCosSign2 = -1;realSinSign2 = -1;}
		else if(realAngleBetweenObjects === 90)									{realCosSign1 = 0;realSinSign1 = 1;realCosSign2 = 0;realSinSign2 = -1;}
		else if(realAngleBetweenObjects >  90 && realAngleBetweenObjects < 180)	{realCosSign1 = -1;realSinSign1 = -1;realCosSign2 = 1;realSinSign2 = 1;}
		else if(realAngleBetweenObjects === 180)									{realCosSign1 = -1;realSinSign1 = 0;realCosSign2 = 1;realSinSign2 = 0;}
		else if(realAngleBetweenObjects > 180 && realAngleBetweenObjects < 270)	{realCosSign1 = -1;realSinSign1 = -1;realCosSign2 = 1;realSinSign2 = 1;}
		else if(realAngleBetweenObjects === 270)									{realCosSign1 = 0;realSinSign1 = 1;realCosSign2 = 0;realSinSign2 = -1;}
		else if(realAngleBetweenObjects > 270 && realAngleBetweenObjects < 360)	{realCosSign1 = 1;realSinSign1 = 1;realCosSign2 = -1;realSinSign2 = -1;}
		
		var m = [0.5 * (x1 + x2), 0.5 * (y1 + y2)];
		var r = [m[0] + 2 * (p[0] - m[0]), m[1] + 2 * (p[1] - m[1])];
		var t = 0.5;
		var c = [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * r[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * r[1] + t * t * y2];
		d3.select("#curvelabel"+id).attr("x", c[0]-4).attr("y", c[1]+4);
	}
	
	/*
	Update endomorphism label
	*/
	this.updateEndomorphismLabel = function(morphism, p) {
		var id = morphism.getId();
		var object = getObjectById(morphism.getSource());
		var ra = Math.realAngle(object.getPosition(), p);
		var r = Math.distance(object.getPosition(), [Number(morphism.getHandle().attr("cx")), Number(morphism.getHandle().attr("cy"))]);
		var x = object.getX() + r * Math.degCos(ra);
		var y = object.getY() - r * Math.degSin(ra);
		var endomorphismLabelptr = d3.select("#linelabel" + id).attr("x", x).attr("y", y);
		endomorphismLabelptr.attr("x", Number(endomorphismLabelptr.attr("x")) - document.getElementById("linelabel" + id).getComputedTextLength()/2);//align center
		endomorphismLabelptr.attr("y", Number(endomorphismLabelptr.attr("y")) + document.getElementById("linelabel" + id).getBBox().height/4);//align center
	}
	
	/*
	Update id endomorphism label
	*/
	this.updateIdEndomorphismLabel = function(morphism, p, r) {
		var id = morphism.getId();
		var x = p[0];
		var y = p[1];
		var angle = Math.realAngle(p, [morphism.getHandle().attr("x"), morphism.getHandle().attr("x")]);
		var endomorphismLabelptr = d3.select("#linelabel" + id).attr("x", x + r * Math.degCos(angle + 90)).attr("y", y - 2 * r * Math.degSin(angle + 90));
		endomorphismLabelptr.attr("x", Number(endomorphismLabelptr.attr("x")) - document.getElementById("linelabel" + id).getComputedTextLength()/2);//align center
		endomorphismLabelptr.attr("y", Number(endomorphismLabelptr.attr("y")) + document.getElementById("linelabel" + id).getBBox().height/4);//align center
	}
	
	/*
	Translate bezier's label
	*/
	this.translateBezierLabel = function(morphism) {
		var id = morphism.getId();
		var handle = morphism.getHandle();
		var c = [handle.attr("cx"), handle.attr("cy")];
		var curveLabelptr = d3.select("#curvelabel" + id).attr("x", c[0]).attr("y", c[1]);
		curveLabelptr.attr("x", Number(curveLabelptr.attr("x")) - document.getElementById("curvelabel" + id).getComputedTextLength()/2);//align center
		curveLabelptr.attr("y", Number(curveLabelptr.attr("y")) + document.getElementById("curvelabel" + id).getBBox().height/4);//align center
	}
	
	/*
	Translate endomorphism's label
	*/
	this.translateEndomorphismLabel = function(morphism) {
		var id = morphism.getId();
		var handle = morphism.getHandle();
		var c = [handle.attr("cx"), handle.attr("cy")];
		var endomorphismLabelptr = d3.select("#linelabel" + id).attr("x", c[0]).attr("y", c[1]);
		endomorphismLabelptr.attr("x", Number(endomorphismLabelptr.attr("x")) - document.getElementById("linelabel" + id).getComputedTextLength()/2);//align center
		endomorphismLabelptr.attr("y", Number(endomorphismLabelptr.attr("y")) + document.getElementById("linelabel" + id).getBBox().height/4);//align center
	}
	//--------------
	
	//Select methods
	/*
	Select circle
	*/
	this.selectCircle = function(object) {
		var id = object.getId();
		d3.select("#circlelabel" + id).attr("font-family", SELECTED_CIRCLE_LABEL_FONT_NAME).attr("font-size", SELECTED_CIRCLE_LABEL_FONT_SIZE).attr("fill", SELECTED_CIRCLE_LABEL_COLOR);
		d3.select("#circle" + id).attr("r", SELECTED_CIRCLE_RADIUS).attr("fill", SELECTED_CIRCLE_COLOR);
	};
	
	/*
	Select bezier
	*/
	this.selectBezier = function(morphism) {
		var id = morphism.getId();
		d3.select("#curvelabel" + id).attr("font-family", SELECTED_CURVE_LABEL_FONT_NAME).attr("font-size", SELECTED_CURVE_LABEL_FONT_SIZE).attr("fill", SELECTED_CURVE_LABEL_COLOR);
		d3.select("#curvehandle" + id).attr("r", SELECTED_HANDLE_RADIUS).attr("fill", SELECTED_HANDLE_COLOR);
		d3.selectAll(".curve" + id).attr("stroke", SELECTED_CURVE_COLOR).attr("stroke-width", SELECTED_CURVE_WIDTH);
	};
	
	/*
	Select endomorphism
	*/
	this.selectEndomorphism = function(morphism) {
		var id = morphism.getId();
		if (!morphism.getIsIdEndomorphism()) {
			d3.selectAll(".line" + id).attr("stroke", SELECTED_ENDOMORPHISM_COLOR).attr("stroke-width", SELECTED_ENDOMORPHISM_WIDTH);
			d3.select("#linelabel" + id).attr("font-family", SELECTED_ENDOMORPHISM_LABEL_FONT_NAME).attr("font-size", SELECTED_ENDOMORPHISM_LABEL_FONT_SIZE).attr("fill", SELECTED_ENDOMORPHISM_LABEL_COLOR);
			d3.select("#curvehandle" + id).attr("r", SELECTED_HANDLE_RADIUS).attr("fill", SELECTED_HANDLE_COLOR);
		} else {
			d3.selectAll(".line" + id).attr("stroke", SELECTED_ID_ENDOMORPHISM_COLOR).attr("stroke-width", SELECTED_ID_ENDOMORPHISM_WIDTH);
			d3.select("#linelabel" + id).attr("font-family", SELECTED_ID_ENDOMORPHISM_LABEL_FONT_NAME).attr("font-size", SELECTED_ID_ENDOMORPHISM_LABEL_FONT_SIZE).attr("fill", SELECTED_ID_ENDOMORPHISM_LABEL_COLOR);
			d3.select("#curvehandle" + id).attr("r", SELECTED_ID_HANDLE_RADIUS).attr("fill", SELECTED_ID_HANDLE_COLOR);
		}
	}
	
	// selectIdEndomorphism
	//--------------
	
	//Deselect methods
	/*
	Deselect circle
	*/
	this.deselectCircle = function(object) {
		var id = object.getId();
		d3.select("#circlelabel" + id).attr("fill", DEFAULT_CIRCLE_LABEL_COLOR);
		d3.select("#circle" + id).attr("fill", DEFAULT_CIRCLE_COLOR);
		var idEndomorphismId = object.getEndomorphism(0).getId();
		d3.select("#linelabel" + idEndomorphismId).attr("fill", DEFAULT_ENDOMORPHISM_LABEL_COLOR);
		d3.selectAll(".line" + idEndomorphismId).attr("stroke", DEFAULT_ENDOMORPHISM_COLOR);
		d3.select("#curvehandle" + idEndomorphismId).attr("r", DEFAULT_HANDLE_RADIUS).attr("fill", DEFAULT_HANDLE_COLOR);
	};
	
	/*
	Deselect bezier
	*/
	this.deselectBezier = function(morphism) {
		var id = morphism.getId();
		d3.select("#curvelabel" + id).attr("fill", DEFAULT_CURVE_LABEL_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
		d3.select("#curvehandle" + id).attr("r", DEFAULT_HANDLE_RADIUS).attr("fill", DEFAULT_HANDLE_COLOR);
		d3.selectAll(".curve" + id).attr("stroke", DEFAULT_CURVE_COLOR).attr("stroke-width", DEFAULT_CURVE_WIDTH);
	};
	
	/*
	Deselect endomorphism
	*/
	this.deselectEndomorphism = function(morphism) {
		var id = morphism.getId();
		if (!morphism.getIsIdEndomorphism()) {
			d3.selectAll(".line" + id).attr("stroke", DEFAULT_ENDOMORPHISM_COLOR).attr("stroke-width", DEFAULT_ENDOMORPHISM_WIDTH);
			d3.select("#curvehandle" + id).attr("r", DEFAULT_HANDLE_RADIUS).attr("fill", DEFAULT_HANDLE_COLOR);
		} else {
			d3.selectAll(".line" + id).attr("stroke", DEFAULT_ID_ENDOMORPHISM_COLOR).attr("stroke-width", DEFAULT_ID_ENDOMORPHISM_WIDTH);
			d3.select("#curvehandle" + id).attr("r", DEFAULT_ID_HANDLE_RADIUS).attr("fill", DEFAULT_ID_HANDLE_COLOR);
			//exceptionally in these 2 lines, stroke and fill do not work with .attr
		}
	}
	//----------------
	
	//Delete methods
	/*
	Delete circle
	*/
	this.deleteCircle = function(id) {
		d3.select("#circle" + id).remove();
	}
	
	/*
	Delete circle label
	*/
	this.deleteCircleLabel = function(id) {
		d3.select("#circlelabel" + id).remove();
	}
	
	/*
	Delete bezier
	*/
	this.deleteBezier = function(id) {
		d3.selectAll(".curve" + id).remove();
		d3.selectAll("#curvehandle" + id).remove();
	}
	
	/*
	Delete bezier label
	*/
	this.deleteBezierLabel = function(id) {
		d3.select("#curvelabel" + id).remove();
	}
	
	/*
	Delete endomorphism
	*/
	this.deleteEndomorphism = function(id) {
		d3.selectAll(".line" + id).remove();
		d3.selectAll("#curvehandle" + id).remove();
	}
	
	/*
	Delete endomorphism label
	*/
	this.deleteEndomorphismLabel = function(id) {
		d3.select("#linelabel" + id).remove();
	}
	//--------------
	
	//Hide methods
	/*
	Hide circle
	*/
	this.hideCircle = function(object) {
		var id = object.getId();
		d3.select("#circlelabel" + id).attr("visibility", "hidden");
		d3.select("#circle" + id).attr("visibility", "hidden");
		object.setVisible(false);
	};
	
	/*
	Hide bezier
	*/
	this.hideBezier = function(morphism) {
		var id = morphism.getId();
		d3.select("#curvelabel" + id).attr("visibility", "hidden");
		d3.select("#curvehandle" + id).attr("visibility", "hidden");
		d3.selectAll(".curve" + id).attr("visibility", "hidden");
		morphism.setVisible(false);
	};
	
	/*
	Hide endomorphism
	*/
	this.hideEndomorphism = function(morphism) {
		var id = morphism.getId();
		d3.select("#linelabel" + id).attr("visibility", "hidden");
		d3.select("#curvehandle" + id).attr("visibility", "hidden");
		d3.selectAll(".line" + id).attr("visibility", "hidden");
		morphism.setVisible(false);
	};
	//------------
	
	//Show methods
	/*
	Show circle
	*/
	this.showCircle = function(object) {
		var id = object.getId();
		d3.select("#circlelabel" + id).attr("visibility", "visible");
		d3.select("#circle" + id).attr("visibility", "visible");
		object.setVisible(true);
		var idEndomorphismId = object.getEndomorphism(0).getId();
		d3.select("#linelabel" + idEndomorphismId).attr("visibility", "visible");
		d3.selectAll(".line" + idEndomorphismId).attr("visibility", "visible");
		d3.select("#curvehandle" + idEndomorphismId).attr("visibility", "visible");
		object.getEndomorphism(0).setVisible(true);
	};
	
	/*
	Show bezier
	*/
	this.showBezier = function(morphism) {
		var id = morphism.getId();
		d3.select("#curvelabel" + id).attr("visibility", "visible");
		d3.select("#curvehandle" + id).attr("visibility", "visible");
		d3.selectAll(".curve" + id).attr("visibility", "visible");
		morphism.setVisible(true);
	};
	
	/*
	Show endomorphism
	*/
	this.showEndomorphism = function(morphism) {
		var id = morphism.getId();
		d3.select("#linelabel" + id).attr("visibility", "visible");
		d3.selectAll(".line" + id).attr("visibility", "visible");
		d3.select("#curvehandle" + id).attr("visibility", "visible");
		morphism.setVisible(true);
	};
	//------------
	
	//Exists methods
	/*
	Circle exists
	*/
	this.circleExists = function(id) {
		return d3.select("#circlelabel" + id)[0][0] != null && d3.select("#circle" + id)[0][0] != null;
	};
	
	/*
	Bezier exists
	*/
	this.bezierExists = function(id) {
		return d3.select("#curvelabel" + id)[0][0] != null && d3.select("#curvehandle" + id)[0][0] != null && d3.selectAll(".curve" + id)[0][0] != null;
	};
	
	/*
	Endomorphism exists
	*/
	this.endomorphismExists = function(id) {
		return d3.select("#linelabel" + 0)[0][0] != null && d3.select(".line" + id)[0][0] != null && d3.select("#curvehandle" + id)[0][0] != null;
	};
	//------------
	
	//Auxiliary methods
	/*
	Check if circle is fully inside area between p1 and p2
	*/
	function isCircleFullyInsideArea(x, y, r, p1, p2) {
		return ((x - r) >= Math.min(p1[0], p2[0]) && (x + r) <= Math.max(p1[0], p2[0]) && (y - r) >= Math.min(p1[1], p2[1]) && (y + r) <= Math.max(p1[1], p2[1]));
	}
	
	/*
	Get a list of all circles fully inside area between p1 and p2
	*/
	this.getAllCirclesFullyInsideArea = function(p1, p2) {
		var list = [];
		d3.selectAll(".circle").each(function(d, i) {
			var el = d3.select(this);
			var cx = Number(el.attr("cx"));
			var cy = Number(el.attr("cy"));
			var r = Number(el.attr("r"));
			if (isCircleFullyInsideArea(cx, cy, r, p1, p2)) {
				list.push(el);
			}
		})
		return list;
	};
	
	/*
	Get a list of all bezier handles fully inside area between p1 and p2
	*/
	this.getAllBezierHandlesFullyInsideArea = function(p1, p2) {
		var list = [];
		d3.selectAll(".curvehandle").each(function(d, i) {
			var el = d3.select(this);
			var cx = Number(el.attr("cx"));
			var cy = Number(el.attr("cy"));
			var r = Number(el.attr("r"));
			if (isCircleFullyInsideArea(cx, cy, r, p1, p2)) {
				list.push(el);
			}
		})
		return list;
	};
	//-----------------
}
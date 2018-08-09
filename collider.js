function Collider() {
	/*
	Check if a point (x, y) is inside a circle with center coordinates (cx, cy) and radius r
	*/
	function pointInCircle(x, y, cx, cy, r) {
		return (((x - cx) * (x - cx)) + ((y - cy) * (y - cy))) <= r * r;
	};
	
	/*
	Check if a point (x, y) is inside a curve handle with center coordinates (cx, cy) and radius r
	*/
	function pointInCurveHandle(x, y, cx, cy, r) {
		return (((x - cx) * (x - cx)) + ((y - cy) * (y - cy))) <= r * r;
	};
	
	/*
	Get a list of all circles with point (x, y) inside
	*/
	this.getAllCirclesWithPointInside = function(p) {
		var x = p[0];
		var y = p[1];
		var list = [];
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].getVisible() && pointInCircle(x, y, objects[i].getX(), objects[i].getY(), objects[i].getRadius())) {
				list.push(objects[i]);
			}
		}
		return list;
	}
	
	/*
	Check if a circle with center (x, y) and radius r is inside area between (x1, y1) and (x2, y2)
	*/
	function circleInsideArea(x, y, r, x1, y1, x2, y2) {
		return ((x - r) >= Math.min(x1, x2) && (x + r) <= Math.max(x1, x2) && (y - r) >= Math.min(y1, y2) && (y + r) <= Math.max(y1, y2));
	}
	
	/*
	Get a list of all circles inside area
	*/
	this.getAllCirclesInsideArea = function(p1, p2) {
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		var list = [];
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].getVisible() && circleInsideArea(objects[i].getX(), objects[i].getY(), objects[i].getRadius(), x1, y1, x2, y2)) {
				list.push(objects[i]);
			}
		}		
		return list;
	}
	
	/*
	Get a list of all curve handles with point (x, y) inside
	*/
	this.getAllHandlesWithPointInside = function(p) {
		var x = p[0];
		var y = p[1];
		var list = [];
		for (var i = 0; i < morphisms.length; i++) {
			if (morphisms[i].getVisible()) {
				if (morphisms[i].getHandle()) {
					var cx = Number(morphisms[i].getHandle().attr("cx"));
					var cy = Number(morphisms[i].getHandle().attr("cy"));
					var r = Number(morphisms[i].getHandle().attr("r"));
					if (pointInCurveHandle(x, y, cx, cy, r)) {
						list.push(morphisms[i]);
					}
				}
			}
		}
		return list;
	}
	
	/*
	Get a list of all curve handles inside area
	*/
	this.getAllHandlesInsideArea = function(p1, p2) {
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		var list = [];
		for (var i = 0; i < morphisms.length; i++) {
			if (morphisms[i].getVisible()) {
				var cx = Number(morphisms[i].getHandle().attr("cx"));
				var cy = Number(morphisms[i].getHandle().attr("cy"));
				var r = Number(morphisms[i].getHandle().attr("r"));
				if (circleInsideArea(cx, cy, r, x1, y1, x2, y2)) {
					list.push(morphisms[i]);
				}
			}
		}		
		return list;
	}
	
	/*
	Check if the mouse coordinates are inside any circle
	*/
	this.mousePositionCollidesWithSomeCircle = function(x, y) {
		for (var i = 0; i < objects.length; i++) {
			//https://stackoverflow.com/questions/1736734/circle-circle-collision
			if (objects[i].getVisible()) {
				var x1 = objects[i].getX();
				var y1 = objects[i].getY();
				var r1 = objects[i].getRadius();
				var x2 = x;
				var y2 = y;
				var r2 = DEFAULT_CIRCLE_RADIUS;
				if ((x2 - x1) * (x2 - x1) + (y1 - y2) * (y1 - y2) <= (r1 + r2) * (r1 + r2)) {
					return true;
				}
			}
		}
		return false;
	};
}
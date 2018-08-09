/*
Extension methods
*/

/*
Get only the unique values of the array
*/
if(Array.prototype.uniques) console.warn("Overriding existing Array.prototype.uniques at utils.js");
//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-an-array-remove-duplicates
Array.prototype.uniques = function() {
	var a = [];
    for (var i = 0, l = this.length; i < l; i++)
		if (a.indexOf(this[i]) === -1 && this[i] !== '')
			a.push(this[i]);
    return a;
}

/*
Check if 2 arrays are equal
*/
if(Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals at utils.js");
//https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
Array.prototype.equals = function(other) {
	if (!other)
		return false;
	if (this.length !== other.length)
		return false;
	for (var i = 0, l = this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && other[i] instanceof Array) {
			if (!this[i].equals(other[i]))
				return false;
		}
		else if (this[i] !== other[i]) {
			return false;
		}
	}   
	return true;
}

/*
Remove an element from the array
*/
if(Array.prototype.remove) console.warn("Overriding existing Array.prototype.remove at utils.js");
Array.prototype.remove = function(e) {
	if (this.indexOf(e) !== -1) {
		return this.splice(this.indexOf(e), 1);
	}
}

/*
Get the last element from the array
*/
if(Array.prototype.last) console.warn("Overriding existing Array.prototype.last at utils.js");
Array.prototype.last = function() {
	if (this.length === 0) return null;
	return this[this.length - 1];
}

/*
Push another array's elements to the end of the array
*/
if(Array.prototype.pushArray) console.warn("Overriding existing Array.prototype.last at utils.js");
Array.prototype.pushArray = function(other) {
	for (var i = 0; i < other.length; i++) this.push(other[i]);
}

/*
Check if array has element
*/
if(Array.prototype.has) console.warn("Overriding existing Array.prototype.has at utils.js");
Array.prototype.has = function(e) {
	return this.indexOf(e) !== -1;
}

/*
Get the euclidian distance between p1 and p2 in 2 dimensions
*/
if(Math.distance) console.warn("Overriding existing Math.distance at utils.js");
Math.distance = function(p1, p2) {
	if (p1.length === p2.length) {
		var sum = 0;
		for (var dim = 0; dim < p1.length; dim++) {
			sum += (p2[dim] - p1[dim]) * (p2[dim] - p1[dim]);
		}
		return Math.sqrt(sum);
	} else {
		throw "Math.distance exception: different dimensions";
	}
};

/*
Convert degrees to radians [0, 360) -> [0, 2π)
*/
if(Math.degToRad) console.warn("Overriding existing Math.degToRad at utils.js");
Math.degToRad = function(deg) {
    return deg * (Math.PI / 180);
};

/*
Convert degrees to radians [0, 2π) -> [0, 360)
*/
if(Math.radToDeg) console.warn("Overriding existing Math.radToDeg at utils.js");
Math.radToDeg = function(rad) {
    return rad * (180 / Math.PI);
};

/*
Get arc tangent in degrees [-∞, +∞] -> [-90, 90]
*/
if(Math.atanInDeg) console.warn("Overriding existing Math.atanInDeg at utils.js");
Math.atanInDeg = function(tan) {
    return Math.radToDeg(Math.atan(tan));
};

/*
Get arc tangent of slope [-∞, +∞] -> [0, 90]
*/
if(Math.slopeAtan) console.warn("Overriding existing Math.slopeAtan at utils.js");
Math.slopeAtan = function(m) {
    return Math.atan(m);
};

/*
Get cosine in degrees [-∞, +∞] -> [-1, 1]
*/
if(Math.degCos) console.warn("Overriding existing Math.degCos at utils.js");
Math.degCos = function(deg) {
    return Math.cos(Math.degToRad(deg));
};

/*
Get sine in degrees [-∞, +∞] -> [-1, 1]
*/
if(Math.degSin) console.warn("Overriding existing Math.degSin at utils.js");
Math.degSin = function(deg) {
    return Math.sin(Math.degToRad(deg));
};

/*
Get real angle between p1 and p2
returns a value in [0, 360)
it is necessary because atan returns a value betwwen -90 and 90 degrees
*/
if(Math.realAngle) console.warn("Overriding existing Math.realAngle at utils.js");
Math.realAngle = function(p1, p2) {
	var x1 = p1[0];
	var y1 = p1[1];
	var x2 = p2[0];
	var y2 = p2[1];
    var m = ((y2 - y1) / (x2 - x1));
	var angle = Math.atanInDeg(m);
	if (y2 !== y1) angle = -angle;
	if (x2 < x1) angle += 180;
	if (angle < 0) angle += 360;
	return angle;
};

/*
Get a list with the primes factors of a natural number
*/
if(Math.primeFactorization) console.warn("Overriding existing Math.primeFactorization at utils.js");
Math.primeFactorization = function(n) {
	if (n === 0) {
		list.push(0);
		return [0];
	}
	if (n === 1) {
		list.push(1);
		return [1];
	}
	var list = [];
	while (n % 2 === 0) {
		list.push(2);
		n /= 2;
	}
	for (var i = 3; i <= Math.sqrt(n); i = i + 2) {
		while (n % i === 0) {
			list.push(i);
			n /= i;
		}
	}
	if (n > 2) {
		list.push(n);
	}
    return list;
};

/*
Get first n prime numbers
*/
if(Math.primeGenerator) console.warn("Overriding existing Math.primeGenerator at utils.js");
//https://stackoverflow.com/questions/17382165/javascript-find-first-n-prime-numbers
Math.primeGenerator = function(n) {
	var list=[];
    for (var i = 1; i < n; i++){
        var prime = true;
        var rootI = Math.sqrt(i) + 1;
        for (var j = 2; j < rootI; j++){
            if (i%j == 0) {
				prime = false;
				break;
			}
        };
        if (prime) list.push(i);
    }
    return list;
};

/*
Get a 3x3 matrix's determinant
*/
if(Math.determinant3) console.warn("Overriding existing Math.determinant3 at utils.js");
Math.determinant3 = function(matrix) {
	var a = matrix[0][0]*matrix[1][1]*matrix[2][2];
	var b = matrix[0][1]*matrix[1][2]*matrix[2][0];
	var c = matrix[0][2]*matrix[1][0]*matrix[2][1];
	var d = matrix[0][2]*matrix[1][1]*matrix[2][0];
	var e = matrix[0][1]*matrix[1][0]*matrix[2][2];
	var f = matrix[0][0]*matrix[1][2]*matrix[2][1];
	return (a+b+c)-(d+e+f);
}

/*
Get the coefficients of a quadratic polynomial similar to a quadratic bezier curve
Input: array with 3 {x, y} objects representing points P0, P1 and P2
Output: coefficients a0, a1, a2
*/
if(Math.quadraticBezierCurveToQuadraticPolynomialCoefficients) console.warn("Overriding existing Math.quadraticBezierCurveToQuadraticPolynomialCoefficients at utils.js");
Math.quadraticBezierCurveToQuadraticPolynomialCoefficients = function(points) {
	var p = {x: points[0].x, y: points[0].y};
	var q = {x: (points[1].x+(points[0].x+points[2].x)/2)/2, y: (points[1].y+(points[0].y+points[2].y)/2)/2};
	var r = {x: points[2].x, y: points[2].y};
	
	var Ax = [];
	Ax.push([Math.pow(p.x, 0), Math.pow(p.x, 1), Math.pow(p.x, 2)]);
	Ax.push([Math.pow(q.x, 0), Math.pow(q.x, 1), Math.pow(q.x, 2)]);
	Ax.push([Math.pow(r.x, 0), Math.pow(r.x, 1), Math.pow(r.x, 2)]);

	var b = [];
	b.push(p.y);
	b.push(q.y);
	b.push(r.y);
	
	var coefs = [];
	
	var dAx = Math.determinant3(Ax);
	
	var copy0 = [];
	copy0.push([Math.pow(p.x, 0), Math.pow(p.x, 1), Math.pow(p.x, 2)]);
	copy0.push([Math.pow(q.x, 0), Math.pow(q.x, 1), Math.pow(q.x, 2)]);
	copy0.push([Math.pow(r.x, 0), Math.pow(r.x, 1), Math.pow(r.x, 2)]);
	copy0[0][0] = b[0];
	copy0[1][0] = b[1];
	copy0[2][0] = b[2];
	
	var da = Math.determinant3(copy0);
	coefs.push(da/dAx);
	
	var copy1 = [];
	copy1.push([Math.pow(p.x, 0), Math.pow(p.x, 1), Math.pow(p.x, 2)]);
	copy1.push([Math.pow(q.x, 0), Math.pow(q.x, 1), Math.pow(q.x, 2)]);
	copy1.push([Math.pow(r.x, 0), Math.pow(r.x, 1), Math.pow(r.x, 2)]);
	copy1[0][1] = b[0];
	copy1[1][1] = b[1];
	copy1[2][1] = b[2];
	
	var db = Math.determinant3(copy1);
	coefs.push(db/dAx);
	
	var copy2 = [];
	copy2.push([Math.pow(p.x, 0), Math.pow(p.x, 1), Math.pow(p.x, 2)]);
	copy2.push([Math.pow(q.x, 0), Math.pow(q.x, 1), Math.pow(q.x, 2)]);
	copy2.push([Math.pow(r.x, 0), Math.pow(r.x, 1), Math.pow(r.x, 2)]);
	copy2[0][2] = b[0];
	copy2[1][2] = b[1];
	copy2[2][2] = b[2];
	
	var dc = Math.determinant3(copy2);
	coefs.push(dc/dAx);
	
	return coefs;
}

/*
Get the derivative of a function at point x
Example:
	function f(x) {return Math.pow(Math.E, -x);};
	console.log("f'(1) = " + Math.derivative(f)(1));
*/
if(Math.derivative) console.warn("Overriding existing Math.derivative at utils.js");
//https://gist.github.com/andersonfreitas/11055882
Math.derivative = function(f, x) {
	var h = 0.001;
	return function(x) {return (f(x + h) - f(x - h)) / (2 * h);};
}

/*
Get the arc lenght of a parametic equation
*/
if(Math.arcLengthParametricEquation) console.warn("Overriding existing Math.arcLengthParametricEquation at utils.js");
Math.arcLengthParametricEquation = function(x, y) {
	var n = 1000;
	var sum = 0;
	for (var i = 0; i < n; i++) {
		sum += Math.sqrt(Math.pow((x((i+1)/n) - x(i/n)), 2) + Math.pow((y((i+1)/n) - y(i/n)), 2));
	}
	return sum;
}

/*
Get the parametric value where the partial arc length is l, starting on parametric point s
Inputs: p in [0, 1]
*/
if(Math.partialArcLengthFromPoint) console.warn("Overriding existing Math.partialArcLengthFromPoint at utils.js");
Math.partialArcLengthFromPoint = function(x, y, s, l) {
	var n = 1000;
	var sum = 0;
	if (l >= 0) {
		for (var i = s; i <= 1; i+=1/n) {
			sum += Math.sqrt(Math.pow((x(i+(1/n)) - x(i)), 2) + Math.pow((y(i+(1/n)) - y(i)), 2));
			if (sum >= l) return i;
		}
		return null;
	} else {
		for (var i = s; i >= 0; i-=1/n) {
			sum += Math.sqrt(Math.pow((x(i+(1/n)) - x(i)), 2) + Math.pow((y(i+(1/n)) - y(i)), 2));
			if (sum >= -l) return i;
		}
		return null;
	}
}

/*
Get points where x is 0 in f(x)=ax²+bx+c
*/
if(Math.bhaskara) console.warn("Overriding existing Math.bhaskara at utils.js");
Math.bhaskara = function(a, b, c) {
	return [(-b+Math.sqrt(b*b-4*a*c))/(2*a), (-b-Math.sqrt(b*b-4*a*c))/(2*a)];
}

/*
Get all indices of character c in the string
*/
if(String.prototype.indicesOf) console.warn("Overriding existing String.prototype.indicesOf at utils.js");
String.prototype.indicesOf = function(c) {
	var list = [];
	for (var i = 0; i < this.length; i++) {
		if (this[i] === c) list.push(i);
	}
	return list;
}
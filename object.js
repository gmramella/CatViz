/*
id: natural number
label: string
x: natural number
y: natural number
radius: natural number
selected: boolean
visible: boolean
endomorphisms: list of morphisms
*/
function Object(p) {
	var id = objectsCounter;
	var label = currentObjectLabel();
	var x = p[0];
	var y = p[1];
	var radius = DEFAULT_CIRCLE_RADIUS;
	var selected = false;
	var visible = true;
	var morphisms = [];
	var endomorphisms = [];
	
	this.getId = function() {return id;};
	this.getLabel = function() {return label;};
	this.getX = function() {return x;};
	this.getY = function() {return y;};
	this.getRadius = function() {return radius;};
	this.getSelected = function() {return selected;};
	this.getVisible = function() {return visible;};
	this.getMorphisms = function() {return morphisms;};
	this.getEndomorphisms = function() {return endomorphisms;};
	
	this.setId = function(i) {id = i;};
	this.setLabel = function(l) {label = l;};
	this.setX = function(_x) {x = _x;};
	this.setY = function(_y) {y = _y;};
	this.setRadius = function(r) {radius = r;};
	this.setSelected = function(s) {selected = s;};
	this.setVisible = function(v) {visible = v;};
	this.setMorphisms = function(m) {morphisms = m;};
	this.setEndomorphisms = function(e) {endomorphisms = e;};
	
	this.toggleSelected = function() {selected = !selected;};
	this.toggleVisible = function() {visible = !visible;};
	this.description = function() {
		var str = "";
		str += "id: " + id + "\r\n";
		str += "label: " + label + "\r\n";
		str += "x: " + x + "\r\n";
		str += "y: " + y + "\r\n";
		str += "radius: " + radius + "\r\n";
		str += "selected: " + selected + "\r\n";
		str += "endomorphisms: " + endomorphisms + "\r\n";
		console.log(str);
	};
	this.getPosition = function() {return [x, y];};
	this.setPosition = function(position) {x = position[0]; y = position[1];};
	this.getMorphism = function(i) {return morphisms[i];};
	this.setMorphism = function(i, morphism) {morphisms[i] = morphism;};
	this.addMorphism = function(morphism) {morphisms.push(morphism);};
	this.getEndomorphism = function(i) {return endomorphisms[i];};
	this.setEndomorphism = function(i, endomorphism) {endomorphisms[i] = endomorphism;};
	this.addEndomorphism = function(endomorphism) {endomorphisms.push(endomorphism);};
	this.popEndomorphism = function() {endomorphisms.pop();};
	this.getAll = function() {return [id, label, x, y, radius, selected, visible, morphisms, endomorphisms];};
	
	this.setAll = function(attrs) {id = attrs[0]; label = attrs[1]; x = attrs[2]; y = attrs[3]; radius = attrs[4]; selected = attrs[5]; visible = attrs[6]; morphisms = attrs[7]; endomorphisms = attrs[8];};
}
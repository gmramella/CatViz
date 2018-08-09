/*
id: natural number
label: string
source: natural number
target: natural number
width: natural number
type: string in { "endomorphism", "morphism", "monomorphism", "epimorphism", "monoepimorphism", "isomorphism" }
isIdEndomorphism: boolean
selected: boolean
visible: boolean
p0, p1, p2: 2D coordinates
curve: pointer to the curve's path
handle: pointer to the curve's handle
*/
function Morphism(source, target, type, isIdEndomorphism, ptr = null) {
	var id = morphismsCounter;
	var label = currentMorphismLabel(); if (isIdEndomorphism) label = "id"+currentObjectLabel();
	var source = source;
	var target = target;
	var width = DEFAULT_CURVE_WIDTH;
	var type = type;
	var isIdEndomorphism = isIdEndomorphism;
	var selected = false;
	var visible = true;
	
	var p0 = null;
	var p1 = null;
	var p2 = null;
	var curve = null;
	var handle = null;
	if (ptr) {
		p0 = ptr.p0;
		p1 = ptr.p1;
		p2 = ptr.p2;
		curve = ptr.curve;
		handle = ptr.handle;
	}
	
	this.getId = function() {return id;};
	this.getLabel = function() {return label;};
	this.getSource = function() {return source;};
	this.getTarget = function() {return target;};
	this.getWidth = function() {return width;};
	this.getType = function() {return type;};
	this.getIsIdEndomorphism = function() {return isIdEndomorphism;};
	this.getSelected = function() {return selected;};
	this.getVisible = function() {return visible;};
	
	this.getPoints = function() {return [p0, p1, p2];};
	this.getCurve = function() {return curve;};
	this.getHandle = function() {return handle;};
	
	this.setId = function(i) {id = i;};
	this.setLabel = function(l) {label = l;};
	this.setSource = function(s) {source = s;};
	this.setTarget = function(t) {target = t;};
	this.setWidth = function(w) {width = w;};
	this.setType = function(t) {type = t;};
	this.setIsIdEndomorphism = function(i) {idEndomorphism = i;};
	this.setSelected = function(s) {selected = s;};
	this.setVisible = function(v) {visible = v;};
	
	this.setPoints = function(points) {p0 = points[0]; p1 = points[1]; p2 = points[2];};
	this.setCurvePath = function(path) {curve.attr("d", path);};
	this.setHandlePosition = function(position) {handle.attr("cx", position[0]); handle.attr("cy", position[1]);};
	this.setCurve = function(c) {curve = c;};
	this.setHandle = function(h) {handle = h;};
	
	this.toggleSelected = function() {selected = !selected;};
	this.toggleVisible = function() {visible = !visible;};
	this.description = function() {
		var str = "";
		str += "id: " + id + "\r\n";
		str += "label: " + label + "\r\n";
		str += "source: " + source + "\r\n";
		str += "target: " + target + "\r\n";
		str += "width: " + width + "\r\n";
		str += "type: " + type + "\r\n";
		str += "selected: " + selected + "\r\n";
		console.log(str);
	};
	this.getHandlePosition = function() {return [Number(handle.attr("cx")), Number(handle.attr("cy"))];};
	this.getAll = function() {return [id, label, source, target, width, type, isIdEndomorphism, selected, visible, p0, p1, p2, curve, handle];};
	
	this.setAll = function(attrs) {id = attrs[0]; label = attrs[1]; source = attrs[2]; target = attrs[3]; width = attrs[4]; type = attrs[5]; isIdEndomorphism = attrs[6]; selected = attrs[7]; visible = attrs[8]; p0 = attrs[9]; p1 = attrs[10]; p2 = attrs[11]; curve = attrs[12]; handle = attrs[13];};
}
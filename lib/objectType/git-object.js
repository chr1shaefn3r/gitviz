"use strict";

var GitObject = module.exports = function(obj, g) {
	var shortId = function(object) {
		var id = object;
		if(object.id) {
			id = object.id();
		}
		return id.toString().substring(0, 4);
	};
	var createNode = function(style) {
		var node = g.addNode( shortId(obj) );
		node.set("shape", style.shape);
		node.set("style", style.style);
		node.set("fillcolor", style.fillcolor);
		node.set("color", style.color);
		return node;
	};

	return Object.freeze({
		shortId: shortId,
		createNode: createNode
	});
};


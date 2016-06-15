"use strict";

var Node = module.exports = function(obj, g) {
	var shortId = function(object) {
		var id = object;
		if(object.id) {
			id = object.id();
		}
		return id.toString().substring(0, 4);
	};
	var create = function(style, name) {
		var nodeName = name || shortId(obj);
		var node = g.addNode( nodeName );
		node.set("shape", style.shape);
		node.set("style", style.style);
		node.set("fillcolor", style.fillcolor);
		node.set("color", style.color);
		return {
			withEdgeTo: function(target) {
				g.addEdge( node, shortId(target) );
			},
			withNamedEdgeTo: function(name) {
				g.addEdge( node, name );
			}
		};
	};

	return Object.freeze({
		shortId: shortId,
		create: create
	});
};


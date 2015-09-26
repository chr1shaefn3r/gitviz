"use strict";

var Node = require('../node.js');

var Tag = module.exports = function(obj, g, repo) {
	var node = new Node(obj, g);
	node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#67fdf3"
	});
	return repo.getTag(obj.id())
	.then(function(tag) {
		g.addEdge( node.shortId(obj), node.shortId(tag.targetId()) );
	});
};


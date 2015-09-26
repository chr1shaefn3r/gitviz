"use strict";

var Node = require('../node.js');

var Branch = module.exports = function(ref, g) {
	var node = new Node(ref, g);
	var r = node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#9999ff"
	}, ref.name());
	g.addEdge( r, node.shortId(ref.target()) );
};

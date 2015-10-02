"use strict";

var Node = require('../node.js');

var Branch = module.exports = function(ref, g) {
	var node = new Node(ref, g);
	node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#9999ff"
	}, ref.name()).withEdgeTo(ref.target());
};

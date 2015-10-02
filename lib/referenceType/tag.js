"use strict";

var Node = require('../node.js');

var Tag = module.exports = function(ref, g) {
	var node = new Node(ref, g);
	node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#67fdf3"
	}, ref.name()).withEdgeTo(ref.target());
};

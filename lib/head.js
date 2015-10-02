"use strict";

var Node = require('./node.js');

var Head = module.exports = function(ref, g) {
	var node = new Node(ref, g);
	var head = node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#ff9999"
	}, "HEAD").withEdgeTo(ref.target());
};

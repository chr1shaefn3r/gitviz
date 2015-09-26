"use strict";

var Node = require('./node.js');

var Head = module.exports = function(obj, g) {
	var node = new Node(obj, g);
	var head = node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#ff9999"
	}, "HEAD");
	g.addEdge( head, node.shortId(obj.target()) );
};

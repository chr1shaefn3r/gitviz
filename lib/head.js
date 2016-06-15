"use strict";

var Node = require('./node.js');

var Head = module.exports = function(ref, g) {
	var node = new Node(ref, g);
	var head = node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#ff9999"
	}, "HEAD");
	if(ref.isHead()) {
		// Head pointing at branch
		head.withNamedEdgeTo(ref.name());
	} else {
		// Detached HEAD state -> head point to commit id
		head.withEdgeTo(ref.target());
	}
};

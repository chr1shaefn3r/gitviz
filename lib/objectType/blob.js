"use strict";

var Node = require('../node.js');

var Blob = module.exports = function(obj, g) {
	var node = new Node(obj, g);
	node.create({
		shape: "box",
		style: "filled",
		fillcolor: "#ddddff",
		color: "#bbbbff"
	});
};

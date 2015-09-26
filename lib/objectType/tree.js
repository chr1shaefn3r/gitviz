"use strict";

var Node = require('../node.js');

var Tag = module.exports = function(obj, g, repo) {
	var node = new Node(obj, g);
	node.create({
		shape: "oval",
		style: "filled",
		fillcolor: "#99ff99"
	});
	return repo.getTree(obj.id())
	.then(function(tree) {
		for(var i=0; i < tree.entries().length; i++) {
			var treeEntry = tree.entries()[i];
			g.addEdge( node.shortId(tree), node.shortId(treeEntry.sha()) )
				.set("label", treeEntry.toString());
		}
	});
};


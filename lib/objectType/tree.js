"use strict";

var GitObject = require('./git-object.js');

var Tag = module.exports = function(obj, g, repo) {
	var gitObj = new GitObject(obj, g);
	gitObj.createNode({
		shape: "oval",
		style: "filled",
		fillcolor: "#99ff99"
	});
	return repo.getTree(obj.id())
	.then(function(tree) {
		for(var i=0; i < tree.entries().length; i++) {
			var treeEntry = tree.entries()[i];
			g.addEdge( gitObj.shortId(tree), treeEntry.sha().substring(0, 4) )
				.set("label", treeEntry.toString());
		}
	});
};


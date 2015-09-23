"use strict";

var Tag = module.exports = function(obj, g, repo) {
	return repo.getTree(obj.id().toString())
	.then(function(tree) {
		for(var i=0; i < tree.entries().length; i++) {
			var treeEntry = tree.entries()[i];
			g.addEdge( tree.id().toString().substring(0, 4), treeEntry.sha().substring(0, 4) )
				.set("label", treeEntry.toString());
		}
	});
};


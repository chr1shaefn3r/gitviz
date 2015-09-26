"use strict";

var Node = require('../node.js');

var Commit = module.exports = function(obj, g, repo) {
	var node = new Node(obj, g);
	node.create({
		shape: "hexagon",
		style: "filled",
		fillcolor: "#ffff99"
	});
	return Promise.all([
		new Promise(function(resolve) {
			repo.getCommit(obj.id())
			.then(function(commit) {
				commit.getTree()
				.then(function(tree){
					g.addEdge( node.shortId(commit), node.shortId(tree) );
					resolve();
				});
			});
		}),
		new Promise(function(resolve) {
			repo.getCommit(obj.id().toString())
			.then(function(commit) {
				for(var i=0; i < commit.parents().length; i++) {
					var id = commit.parents()[i];
					g.addEdge( node.shortId(commit), node.shortId(id) );
				}
				resolve();
			});
		}),
	]);
};


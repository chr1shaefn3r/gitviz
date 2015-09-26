"use strict";

var GitObject = require('./git-object.js');

var Commit = module.exports = function(obj, g, repo) {
	var gitObj = new GitObject(obj, g);
	gitObj.createNode({
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
					g.addEdge( gitObj.shortId(commit), gitObj.shortId(tree) );
					resolve();
				});
			});
		}),
		new Promise(function(resolve) {
			repo.getCommit(obj.id().toString())
			.then(function(commit) {
				for(var i=0; i < commit.parents().length; i++) {
					var id = commit.parents()[i];
					g.addEdge( gitObj.shortId(commit), gitObj.shortId(id) );
				}
				resolve();
			});
		}),
	]);
};


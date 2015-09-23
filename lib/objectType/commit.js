"use strict";

var Commit = module.exports = function(obj, g, repo) {
	return Promise.all([
		new Promise(function(resolve) {
			repo.getCommit(obj.id().toString())
			.then(function(commit) {
				commit.getTree()
				.then(function(tree){
					g.addEdge( commit.id().toString().substring(0, 4), tree.id().toString().substring(0, 4) );
					resolve();
				});
			});
		}),
		new Promise(function(resolve) {
			repo.getCommit(obj.id().toString())
			.then(function(commit) {
				for(var i=0; i < commit.parents().length; i++) {
					var id = commit.parents()[i];
					g.addEdge( commit.id().toString().substring(0, 4), id.toString().substring(0, 4) );
				}
				resolve();
			});
		}),
	]);
};


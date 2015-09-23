"use strict";

var Tag = module.exports = function(obj, g, repo) {
	return repo.getTag(obj.id().toString())
	.then(function(tag) {
		g.addEdge( obj.id().toString().substring(0, 4), tag.targetId().toString().substring(0, 4) );
	});
};


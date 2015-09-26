"use strict";

var GitObject = require('./git-object.js');

var Tag = module.exports = function(obj, g, repo) {
	var gitObj = new GitObject(obj, g);
	gitObj.createNode({
		shape: "box",
		style: "filled",
		fillcolor: "#67fdf3"
	});
	return repo.getTag(obj.id())
	.then(function(tag) {
		g.addEdge( gitObj.shortId(obj), gitObj.shortId(tag.targetId()) );
	});
};


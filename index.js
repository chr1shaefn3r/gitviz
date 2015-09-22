"use strict";

var graphviz = require('graphviz'),
	Repo = require('nodegit').Repository;
var visualize = require('./lib/visualizer.js');

module.exports = function(path) {
	var g = graphviz.digraph("G");
	Repo.open(path)
	.then(visualize.bind(null, path, g))
	.then(function() {
		g.output( "pdf", "git-internals.pdf" );
	})
	.catch(function(err) {
		if(err) {
			console.error(err);
		}
	});
};


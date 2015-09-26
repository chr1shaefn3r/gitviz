"use strict";

var GitObject = require('./git-object.js');

var Blob = module.exports = function(obj, g) {
	var gitObj = new GitObject(obj, g);
	gitObj.createNode({
		shape: "box",
		style: "filled",
		fillcolor: "#ddddff",
		color: "#bbbbff"
	});
};

"use strict";

var log = require('debug')("gitviz"),
	exec = require('child_process').execSync;
var Obj = require('nodegit').Object;

var style = {
	types: [ [], /*ext1*/
		["hexagon", "filled", "#ffff99"], /*commit*/
		["oval", "filled", "#99ff99"], /*tree*/
		["box", "filled", "#ddddff", "#bbbbff"], /*blob*/
		["box", "filled", "#67fdf3"], /*tag*/
		["box", "filled", "#9999ff"], /*reference*/
		["box", "filled", "#ff9999"] /*head*/
	],
	apply: function(node, style) {
		node.set("shape", style[0]);
		node.set("style", style[1]);
		node.set("fillcolor", style[2]);
		node.set("color", style[3]);
	}
};

var visualizer = module.exports = function(path, g, repo) {
	var stringOutput = exec("find "+path+"/.git/objects/ | egrep '[0-9a-f]{38}' | perl -pe 's:^.*([0-9a-f][0-9a-f])/([0-9a-f]{38}):\\1\\2:';").toString();

	return arrayify(stringOutput)
	.then(function(ids) {
		log("found following ids: ", ids);
		return Promise.all(ids.map(function(id) {
			return Obj.lookup(repo, id, Obj.TYPE.ANY);
		}));
	})
	.then(function(objects) {
		return Promise.all(objects.map(function(obj) {
			var n = g.addNode( obj.id().toString().substring(0, 4) );
			style.apply(n, style.types[obj.type()]);
			log("added '"+obj.id().toString()+"' with type '"+obj.type()+"' ("+Obj.type2string(obj.type())+")");
			addEdge(obj, g, repo);
		}));
	})
	.then(function() {
		return repo.head()
		.then(function(reference) {
			var head = g.addNode( "HEAD" );
			style.apply(head, style.types[6]);
			g.addEdge( head, reference.target().toString().substring(0, 4) );
			log("added HEAD, pointing to '"+reference.target().toString()+"'");
		})
		.catch(function(err) {
			if(err) {
				log("repo.head() threw an error: ", err.stack);
			}
		});
	})
	.then(function() {
		return repo.getReferences()
		.then(function(arrayReferences) {
			for(var i=0; i < arrayReferences.length; i++) {
				var reference = arrayReferences[i];
				var r = g.addNode( reference.name() );
				if(reference.isTag() === 1) {
					style.apply(r, style.types[4]);
					log("added tag '"+reference.name()+"', pointing to '"+reference.target().toString()+"'");
				} else {
					style.apply(r, style.types[5]);
					log("added reference '"+reference.name()+"', pointing to '"+reference.target().toString()+"'");
				}
				g.addEdge( r, reference.target().toString().substring(0, 4) );
			}
		});
	})
	.catch(function(err) {
		if(err) {
			log(err.stack);
		}
	});
}

function arrayify(idsAsString) {
	return new Promise(function(resolve, reject) {
		if(idsAsString.length <= 0) {
			reject("Ids was empty");
		}

		resolve(idsAsString.split("\n")
		.map(function(line) {
			return line.split(" ")[0];
		})
		.filter(function(line) {
			return line.length > 0;
		}));
	});
}

function addEdge(obj, g, repo) {
	var typeName = Obj.type2string(obj.type());
	var edge = edgeTypes[typeName];
	if(edge) {edge(obj, g, repo)}
}

var edgeTypes = {
	tree: require('./objectType/tree.js'),
	commit: require('./objectType/commit.js'),
	tag: require('./objectType/tag.js')
};


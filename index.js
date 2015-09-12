var log = require('debug')("gitviz"),
	exec = require('child_process').execSync;
var graphviz = require('graphviz');
var Repo = require('nodegit').Repository,
	Obj = require('nodegit').Object;

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

module.exports = function(path) {
	Repo.open(path)
	.then(visualize.bind(null, path))
	.catch(function(err) {
		if(err) {
			console.error("Failed to open '"+path+"' as git repository.");
			console.error(err);
		}
	});
};

function visualize(path, repo) {
	var g = graphviz.digraph("G");

	var stringOutput = exec("find "+path+"/.git/objects/ | egrep '[0-9a-f]{38}' | perl -pe 's:^.*([0-9a-f][0-9a-f])/([0-9a-f]{38}):\\1\\2:';").toString();

	arrayify(stringOutput, g)
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
			log("added '"+obj.id().toString()+"' with type '"+obj.type()+"'");
			addEdge = addEdgeForSpecific[obj.type()];
			if(addEdge) {
				return addEdge.processOn(obj, repo, g);
			}
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
	.then(function() {
		g.output( "pdf", "git-internals.pdf" );
	})
	.catch(function(err) {
		if(err) {
			log(err.stack);
		}
	});
}

function arrayify(idsAsString, g) {
	return new Promise(function(resolve, reject) {
		if(idsAsString.length <= 0) {
			g.output( "pdf", "git-internals.pdf" );
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

var addEdgeForSpecific = [
	undefined, /*ext1*/
	{ processOn: function(obj, repo, g) {
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
	}}, /*commit*/
	{ processOn: function(obj, repo, g) {
		return repo.getTree(obj.id().toString())
		.then(function(tree) {
			for(var i=0; i < tree.entries().length; i++) {
				var treeEntry = tree.entries()[i];
				g.addEdge( tree.id().toString().substring(0, 4), treeEntry.sha().substring(0, 4) )
					.set("label", treeEntry.toString());
			}
		});
	}}, /*tree*/
	undefined, /*blob*/
	{ processOn: function(obj, repo, g) {
		return repo.getTag(obj.id().toString())
		.then(function(tag) {
			g.addEdge( obj.id().toString().substring(0, 4), tag.targetId().toString().substring(0, 4) );
		});
	}} /*tag*/
];

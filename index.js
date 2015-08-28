var util = require('util'),
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

module.exports = function(pathToGitRepo) {
	var path = pathToGitRepo || process.cwd();
//	console.log("Path: "+path);

	var g = graphviz.digraph("G");

	var stringOutput = exec("find .git/objects/ | egrep '[0-9a-f]{38}' | perl -pe 's:^.*([0-9a-f][0-9a-f])/([0-9a-f]{38}):\\1\\2:';").toString();

	var ids = stringOutput.split("\n")
		.map(function(line) {
			return line.split(" ")[0];
		})
		.filter(function(line) {
			return line.length > 0;
		});
//	console.log(ids);

	Repo.open(path)
	.then(function hasRepo(repo) {
		ids.forEach(function(id) {
			Obj.lookup(repo, id, Obj.TYPE.ANY)
			.then(function(obj) {
				var n = g.addNode( obj.id().toString().substring(0, 4) );
				style.apply(n, style.types[obj.type()]);
//				console.log(obj.id()+" "+obj.type());
				if(obj.type() == Obj.TYPE.TREE) {
					repo.getTree(obj.id().toString())
					.then(function(tree) {
						tree.entries().forEach(function(treeEntry) {
							g.addEdge( tree.id().toString().substring(0, 4), treeEntry.sha().substring(0, 4) );
							g.output( "pdf", "git-internals.pdf" );
						});
					})
					.catch(function(err) {
						if(err) console.log(err);
					});
				} else if(obj.type() == Obj.TYPE.COMMIT) {
					repo.getCommit(obj.id().toString())
					.then(function(commit) {
						commit.getTree()
						.then(function(tree){
							g.addEdge( commit.id().toString().substring(0, 4), tree.id().toString().substring(0, 4) );
							g.output( "pdf", "git-internals.pdf" );
						})
						.catch(function(err) {
							if(err) console.log(err);
						});
						commit.parents()
						.forEach(function(id) {
							g.addEdge( commit.id().toString().substring(0, 4), id.toString().substring(0, 4) );
							g.output( "pdf", "git-internals.pdf" );
						});
						g.output( "pdf", "git-internals.pdf" );
					})
					.catch(function(err) {
						if(err) {
							console.log("Repo.getCommit");
							console.log(err);
						}
					});
				}
				g.output( "pdf", "git-internals.pdf" );
			})
			.catch(function(err) {
				if(err) {
					console.log("Obj.lookup");
					console.log(err);
				}
			});
		});
		repo.head()
		.then(function(reference) {
			var head = g.addNode( "HEAD" );
			style.apply(head, style.types[6]);
			g.addEdge( head, reference.target().toString().substring(0, 4) );
			g.output( "pdf", "git-internals.pdf" );
		});
		repo.getReferences()
		.then(function(arrayReferences) {
			arrayReferences.forEach(function(reference) {
				var r = g.addNode( reference.name() );
				if(reference.isTag() === 1) {
					style.apply(r, style.types[4]);
				} else {
					style.apply(r, style.types[5]);
				}
				g.addEdge( r, reference.target().toString().substring(0, 4) );
				g.output( "pdf", "git-internals.pdf" );
			});
		});
	})
	.catch(function(err) {
		if(err) {
			console.log("Repo.open");
			console.log(err);
		}
	});
	console.log( g.to_dot() );
	g.output( "pdf", "git-internals.pdf" );
};


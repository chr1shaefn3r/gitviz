var util = require('util'),
	graphviz = require('graphviz');

module.exports = function() {
	console.log("To be implemented ...");
}

var style = {
	blob: ["box", "filled", "#ddddff", "#bbbbff"],
	tree: ["oval", "filled", "#99ff99"],
	commit: ["hexagon", "filled", "#ffff99"],
	reference: ["box", "filled", "#9999ff"],
	tag: ["box", "filled", "#67fdf3"],
	head: ["box", "filled", "#ff9999"],
	apply: function(node, style) {
		node.set("shape", style[0]);
		node.set("style", style[1]);
		node.set("fillcolor", style[2]);
		node.set("color", style[3]);
	}
};

// Create digraph G
 var g = graphviz.digraph("G");

// Add blobs
var b1 = g.addNode( "323f" );
style.apply(b1, style.blob);
var b2 = g.addNode( "70c3" );
style.apply(b2, style.blob);

// Add trees
var t1 = g.addNode( "d52a" );
style.apply(t1, style.tree);
var t2 = g.addNode( "edb0" );
style.apply(t2, style.tree);

// Add commits
var c1 = g.addNode( "4b3e" );
style.apply(c1, style.commit);
var c2 = g.addNode( "bdcf" );
style.apply(c2, style.commit);

// Add tags
var ta1 = g.addNode( "67a8" );
style.apply(ta1, style.tag);

// Add refs
var r1 = g.addNode( "refs/heads/master" );
style.apply(r1, style.reference);
var r2 = g.addNode( "refs/tags/rc1" );
style.apply(r2, style.reference);

// Add HEAD
var head = g.addNode( "HEAD" );
style.apply(head, style.head);

// Add edges between nodes
var e1 = g.addEdge( t1, b1 );
e1.set( "label", "stuff.txt" );
var e2 = g.addEdge( t2, b2 );
e2.set( "label", "foobar.txt" );
var e3 = g.addEdge( t2, b1 );
e3.set( "label", "stuff" );
g.addEdge( c1, t1 );
g.addEdge( c2, c1 );
g.addEdge( c2, t2 );
g.addEdge( r1, c1 );
g.addEdge( r2, ta1 );
g.addEdge( ta1, c2 );
g.addEdge( head, r1 );

// Print the dot script
console.log( g.to_dot() ); 

// Generate a PNG output
g.output( "png", "test01.png" );


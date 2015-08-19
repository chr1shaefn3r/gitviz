var util = require('util'),
	graphviz = require('graphviz');

var style = {
	blob: ["box", "filled", "#ddddff", "#bbbbff"],
	tree: ["oval", "filled", "#99ff99"],
	apply: function(node, style) {
		node.set("shape", style[0]);
		node.set("style", style[1]);
		node.set("fillcolor", style[2]);
		node.set("color", style[3]);
	}
};

// Create digraph G
 var g = graphviz.digraph("G");
// Add node (ID: Hello)
var n1 = g.addNode( "323f" );
style.apply(n1, style.blob);

// Add node (ID: World)
var n2 = g.addNode( "d52a" );
style.apply(n2, style.tree);

// Add edge between the two nodes
var e = g.addEdge( n2, n1 );
e.set( "label", "stuff.txt" );

// Print the dot script
console.log( g.to_dot() ); 

// Generate a PNG output
g.output( "png", "test01.png" );


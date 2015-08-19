var util = require('util'),
	  graphviz = require('graphviz');

// Create digraph G
 var g = graphviz.digraph("G");
// Add node (ID: Hello)
var n1 = g.addNode( "Hello", {"color" : "blue"} );
n1.set( "style", "filled" );

// Add node (ID: World)
g.addNode( "World" );

// Add edge between the two nodes
var e = g.addEdge( n1, "World" );
e.set( "color", "red" );

// Print the dot script
console.log( g.to_dot() ); 

// Set GraphViz path (if not in your path)
g.setGraphVizPath( "/usr/bin" );
// Generate a PNG output
g.output( "png", "test01.png" );

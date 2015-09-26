"use strict";

var log = require('debug')("gitviz"),
	exec = require('child_process').execSync;
var Obj = require('nodegit').Object;

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
			addNodeAndEdge(obj, g, repo);
			log("added '"+obj.id().toString()+"' with type '"+obj.type()+"' ("+Obj.type2string(obj.type())+")");
		}));
	})
	.then(function() {
		return repo.head()
		.then(function(reference) {
			require('./head.js')(reference, g);
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
				if(reference.isTag() === 1) {
					referenceTypes.tag(reference, g);
					log("added tag '"+reference.name()+"', pointing to '"+reference.target().toString()+"'");
				} else if(reference.isBranch() === 1) {
					referenceTypes.branch(reference, g);
					log("added reference '"+reference.name()+"', pointing to '"+reference.target().toString()+"'");
				}
			}
		});
	})
	.catch(function(err) {
		if(err) {
			log(err.stack);
		}
	});
};

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

function addNodeAndEdge(obj, g, repo) {
	var typeName = Obj.type2string(obj.type());
	var processor = objectTypes[typeName];
	if(processor) {
		processor(obj, g, repo);
	}
}

var objectTypes = {
	commit: require('./objectType/commit.js'),
	tree: require('./objectType/tree.js'),
	blob: require('./objectType/blob.js'),
	tag: require('./objectType/tag.js')
};

var referenceTypes = {
	tag: require('./referenceType/tag.js'),
	branch: require('./referenceType/branch.js'),
};


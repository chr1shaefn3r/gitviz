'use strict';

var util = require('util'),
	events = require('events');
var debug = require('debug')("gitviz:watcher");
var watch = require('watch');

var Watcher = module.exports = function(path) {
	debug("[Watcher] constructor("+path+")");
	var that = this;
	watch.createMonitor(path, function(monitor) {
		monitor.on("created", function() {
			debug("[Watcher] created -> ping");
			that.emit("ping");
		});
		monitor.on("changed", function() {
			debug("[Watcher] changed -> ping");
			that.emit("ping");
		});
		monitor.on("removed", function() {
			debug("[Watcher] removed -> ping");
			that.emit("ping");
		});
	});
};

util.inherits(Watcher, events.EventEmitter);


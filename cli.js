#!/usr/bin/env node
'use strict';

var meow = require('meow');
var gitviz = require('./'),
	Watcher = require('./lib/watcher.js');

var cli = meow({
	help: [
		'Usage:',
		'  gitviz [options] PATH',
		'',
		'Options:',
		'  -w, --watch        watch the PATH for filechanges',
		'  -h, --help         print usage information',
		'  -v, --version      show version info and exit',
		'',
		'Examples:',
		'  $ gitviz /path/to/git/project',
	].join('\n')
},{
	alias: { h: 'help', v: 'version' , w: 'watch' },
	boolean: ['watch']
});

var path = cli.input[0] || process.cwd();

if(cli.flags.watch) {
	new Watcher(path).on('ping', function() {
		gitviz(path);
	});
}

gitviz(path);


#!/usr/bin/env node
'use strict';

var meow = require('meow'),
	gitviz = require('./');

var cli = meow({
	help: [
		'Usage:',
		'  gitviz PATH',
		'',
		'Options:',
		'  -h, --help         print usage information',
		'  -v, --version      show version info and exit',
		'',
		'Examples:',
		'  $ gitviz /path/to/git/project',
	].join('\n')
});

gitviz(cli.input[0]);


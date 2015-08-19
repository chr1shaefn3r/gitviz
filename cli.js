#!/usr/bin/env node
'use strict';

var meow = require('meow'),
	gitviz = require('./');

var cli = meow({
	help: [
		'Usage:',
		'  gitviz PATH',
		'',
		'Examples:',
		'  $ gitviz /path/to/git/project',
	].join('\n')
});

gitviz();


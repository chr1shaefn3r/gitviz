# Gitviz

>  Visualizing git internals

![] (sample.gif)

## CLI

```sh
$ npm install --global gitviz
```

```sh
$ gitviz --help

  Visualizing git internals

  Usage:
    gitviz PATH

  Options:
	-w, --watch        watch the PATH for filechanges
    -h, --help         print usage information
    -v, --version      show version info and exit

  Examples:
    $ gitviz /path/to/git/project
```

## External dependencies
 * Graphviz (sudo apt-get install graphviz or brew install graphviz)

# Open issues
 * Add pack-support
 * Catch the exception if graphviz is not installed and give useful hint on how to solve the problem

## License

MIT © [Christoph Häfner](https://christophhaefner.de)


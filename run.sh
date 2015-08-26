#!/bin/sh
while inotifywait -r ./.git/; do
	gitviz
done

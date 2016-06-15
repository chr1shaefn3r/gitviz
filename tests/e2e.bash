#!/usr/bin/env bash

# Logging stuff.
function m_header() { echo -e "\n\033[1m$@\033[0m"; }
function m_success() { echo -e " \033[1;32m✔\033[0m $@"; }
function m_error() { echo -e " \033[1;31m✖\033[0m $@"; }
function m_arrow() { echo -e " \033[1;33m➜\033[0m $@"; }

function commit() {
	GIT_AUTHOR_DATE="Fri Sep 13 10:10:10 2015 +0200" \
		GIT_COMMITTER_DATE="Fri Sep 13 10:10:10 2015 +0200" \
		git commit --author "Christoph Haefner <chr1shaefn3r@christophhaefner.de>" -m $1 1> /dev/null
}
function annotated_tag() {
	GIT_AUTHOR_DATE="Fri Sep 13 10:10:10 2015 +0200" \
		GIT_COMMITTER_DATE="Fri Sep 13 10:10:10 2015 +0200" \
		git tag --annotate --message "Hello, World!" $1 HEAD 1> /dev/null
}
function assert() {
	cmp "git-internals.pdf" "../../comparedata/"$1".pdf" &> /dev/null
	if [ $? -ne 0 ]; then
		m_error "Test "$1" failed :("
	else
		m_success "Test "$1" passed :)"
	fi
	cp "git-internals.pdf" $1".pdf"
}


GITVIZ=`pwd`"/cli.js"

# setup
set -e
TEMP_DIR="tests/temp"
mkdir -p $TEMP_DIR
cd $TEMP_DIR

m_header "Working in: "`pwd`

TEMP_GIT="test-git-repo"
rm -rf $TEMP_GIT || true

git init $TEMP_GIT
cd $TEMP_GIT
set +e

# test cases

$GITVIZ
assert empty_repo

echo "Hello, World!" | git hash-object -w --stdin 1> /dev/null
$GITVIZ
assert one_blob

echo "Hello, World!!" | git hash-object -w --stdin 1> /dev/null
$GITVIZ
assert two_blob

echo "Hello, World!" > hello.txt
git add hello.txt
commit "Initial"
$GITVIZ
assert one_commit

echo "Hello, World!!" > hello.txt
git add hello.txt
commit "Second"
$GITVIZ
assert two_commit

git tag v1
$GITVIZ
assert tag

annotated_tag v2
$GITVIZ
assert tag_annotated


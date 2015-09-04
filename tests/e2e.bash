#!/usr/bin/env bash

# Logging stuff.
function m_header() { echo -e "\n\033[1m$@\033[0m"; }
function m_success() { echo -e " \033[1;32m✔\033[0m $@"; }
function m_error() { echo -e " \033[1;31m✖\033[0m $@"; }
function m_arrow() { echo -e " \033[1;33m➜\033[0m $@"; }

function assert() {
	cmp "git-internals.pdf" "../../comparedata/"$1".pdf";
	if [ $? -eq 1 ]; then
		m_error "Test "$1" failed :("
		exit 1;
	else
		m_success "Test "$1" passed :)"
	fi
}

GITVIZ=`pwd`"/cli.js"

# setup
set -e
TEMP_DIR="tests/temp"
mkdir -p $TEMP_DIR
cd $TEMP_DIR

m_header "Working in: "`pwd`

TEMP_GIT="test-git-repo"
rm -r $TEMP_GIT || true

git init $TEMP_GIT
cd $TEMP_GIT
set +e

# test cases

$GITVIZ
assert empty_repo

echo "Hello, World!" | git hash-object -w --stdin 1> /dev/null
$GITVIZ
assert one_blob

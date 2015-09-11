#!/usr/bin/env bash

# Logging stuff.
function m_header() { echo -e "\n\033[1m$@\033[0m"; }
function m_success() { echo -e " \033[1;32m✔\033[0m $@"; }
function m_error() { echo -e " \033[1;31m✖\033[0m $@"; }
function m_arrow() { echo -e " \033[1;33m➜\033[0m $@"; }

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

echo "Hello, World!" | git hash-object -w --stdin 1> /dev/null
$GITVIZ
cp git-internals.png "../one_blob.png"

echo "Hello, World!!" | git hash-object -w --stdin 1> /dev/null
$GITVIZ
cp git-internals.png "../two_blob.png"

echo "Hello, World!" > hello.txt
git add hello.txt
git commit -m "Initial"
$GITVIZ
cp git-internals.png "../one_commit.png"

echo "Hello, World!" >> hello.txt
git add hello.txt
git commit -m "Second"
$GITVIZ
cp git-internals.png "../two_commit.png"

git tag v1
$GITVIZ
cp git-internals.png "../tag.png"

echo "Hello, World!!" > world.txt
git add world.txt
git commit -m "Third"
$GITVIZ
cp git-internals.png "../three_commit.png"

git tag -a -m "Annotated" v2
$GITVIZ
cp git-internals.png "../tag_annotated.png"

cd ..
mogrify -background white -gravity Center -extent 483x707 *.png
convert -delay 150 -loop 0 one_blob.png two_blob.png one_commit.png two_commit.png tag.png three_commit.png tag_annotated.png sample.gif


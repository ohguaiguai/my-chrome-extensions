#!/usr/bin/env bash

set -e

git fetch --tags

nextTag=$(git tag --sort=-v:refname | head -n1 | awk -F. '{OFS="."; $NF+=1; print $0}')

version=${nextTag:1}

echo "git tag:" $nextTag

echo "package version:" $version

perl -i -pe 's|("version": ")\d+\.\d+\.\d+|${1}'$version'|' dist/manifest.json
perl -i -pe 's|("version": ")\d+\.\d+\.\d+|${1}'$version'|' package.json

git checkout -b release/$nextTag

git add .
git commit -n -m "bump: $version"

git tag $nextTag

git push --tags

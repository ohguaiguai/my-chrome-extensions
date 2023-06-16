#!/usr/bin/env bash

set -e

source ~/.nvm/nvm.sh

nvm use 16

npm i -g pnpm

pnpm i

rm -rf dist/
rm -f dist.zip

. ./utils/build.sh

. ./utils/tag.sh

cd dist/
zip -r ./dist.zip .

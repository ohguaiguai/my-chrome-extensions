#!/usr/bin/env bash

set -e

rm -rf dist/

pnpm run tsc

# npx concurrently 'vite build'
npx vite build
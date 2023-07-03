#!/usr/bin/env bash

set -e

#rm -rf dist/

# VITE_X_LOG_DEBUG=true npx concurrently 'vite build --minify=false'
npx vite build --minify=false
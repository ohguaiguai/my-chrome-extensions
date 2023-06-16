#!/usr/bin/env bash

set -e

# rm -rf dist/

VITE_X_LOG_DEBUG=true npx concurrently 'vite build --minify=false' 'vite build --minify=false -c vite.config.content.ts'

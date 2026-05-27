#!/usr/bin/env bash
set -e

# Check if a version was provided
if [ -z "$1" ]; then
  echo "Usage: dev version <patch|minor|major>"
  echo "Example: dev version patch"
  exit 1
fi

TYPE=$1

# Ensure we are in the app directory
cd app

# Use npm version to bump the version in package.json
npm version $TYPE

# Return to root
cd ..

echo "✅ Version bumped to $(jq -r '.version' app/package.json)"

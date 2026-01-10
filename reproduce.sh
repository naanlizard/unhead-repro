#!/bin/bash
set -e

echo "=== Unhead Regression Reproduction ==="
echo "Environment: Node $(node -v)"
echo ""

# Initial install for build tools
yarn install --silent

echo ">>> Scenario 1: Installing working version (2.0.17)"
yarn add @unhead/react@2.0.17 unhead@2.0.17 --silent
echo "Running test with @unhead/react@2.0.17..."
if yarn jest repro.test.js --no-cache; then
  echo "✅ SUCCESS: Test passed with v2.0.17 (Expected)"
else
  echo "❌ FAIL: Test failed with v2.0.17 (Unexpected)"
  exit 1
fi

echo ""
echo ">>> Scenario 2: Installing broken version (2.0.18)"
yarn add @unhead/react@2.0.18 unhead@2.0.18 --silent
echo "Running test with @unhead/react@2.0.18..."
# We expect this to fail, so we allow failure
if ! yarn jest repro.test.js --no-cache; then
  echo "✅ SUCCESS: Test failed with v2.0.18 as expected (Reproduction confirmed)"
else
  echo "❌ FAIL: Test passed with v2.0.18 (Could not reproduce failure)"
  exit 1
fi

echo ""
echo "=== Reproduction Complete ==="

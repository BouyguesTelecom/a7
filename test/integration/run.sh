#!/bin/sh

npx httpyac@6.2 ./tests/*.http --silent --json --all -e dev > ./test-output.json
cat ./test-output.json | jq -r '.summary | "Total: \(.totalTests), Passed: \(.successTests), Failed: \(.failedTests)"'
echo "Tests results details will be available under artifact 'http-yac-test-results'"

hasFailedTests=$(cat ./test-output.json | jq -r '.summary.failedTests')

if [ -z "$hasFailedTests" ]; then
  echo "Failed to parse test results"
  exit 1
fi

if [ $hasFailedTests -gt 0 ]; then
  exit 1
fi

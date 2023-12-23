#!/bin/sh

npx httpyac@6.2 ./tests/*.http --silent --json --all -e dev >> ./test-output.json
cat ./test-output.json | jq -r '.summary | "Total: \(.totalTests), Passed: \(.successTests), Failed: \(.failedTests)"'
echo "Tests results details will be available under artifact http-yac-test-results"

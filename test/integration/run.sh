#!/bin/sh

npx httpyac@6.2 ./tests/*.http --silent --json --all -e dev >> ./test-output.json

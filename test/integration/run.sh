#!/bin/sh

npx httpyac@6.2 ./tests/*.http --silent --json -o ./test-output.json --all -e dev

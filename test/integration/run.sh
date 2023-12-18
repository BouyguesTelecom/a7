#!/bin/sh

npx httpyac@6.2 ./tests/*.http --quiet -o ./test-output --all -e dev

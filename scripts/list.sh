#!/usr/bin/env bash

#
# Copyright 2021 - Bouygues Telecom
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

listAssets () {
  DIRECTORY=$1
  LENGTH_TO_CUT=$((${#DIRECTORY} + 2))
  find $DIRECTORY -maxdepth 2 -regex '.*@.*' | cut -c $LENGTH_TO_CUT- | sed "s/\(.@[^\/]*\).*/\1/" | uniq | sort
}

serializeAssetIntoJSON () {
  sed 's/\(.*\)/{\\"name\\": \\"\1\\"}/'
}

join () {
  sed "s/}/},/" | xargs | rev | cut -c 2- | rev
}

parseJSON () {
  python3 -c "import sys, json; print(json.load(sys.stdin)['name'])" <<< stdin
}

readMetadata () {
  DIRECTORY=$1
  cat $DIRECTORY/pkg2@1.0.0/dist/package.json
}

echo -n '['
listAssets $1 | serializeAssetIntoJSON | join
echo ']'

readMetadata $1

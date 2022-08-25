#!/usr/bin/env sh

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

if [ "$A7_PATH_AUTO_EXPAND_INIT" != "true" ] && [ "$A7_PATH_AUTO_EXPAND_INIT" != "always" ]; then
  echo "ENV A7_PATH_AUTO_EXPAND_INIT set to '$A7_PATH_AUTO_EXPAND_INIT'; Let's bypass the directories metadata generation step KTHXBYE."
  return
fi

# Given a file path, outputs a mod_zip-compatible file entry
#
# Example output for a 20b file:
#   4dc8bcdc 20 /assets/bob@1.3.3/dist/index.css index.css
#
fileEntry () {
  directory=$1
  filepath=$2
  hash=$(sha1sum "$filepath" | head -c8)
  size=$(cat "$filepath" | wc -c | sed -e 's/^[[:space:]]*//')
  servicepath=${filepath#$A7_VOLUME_MOUNT_PATH}
  compressedpath=${filepath#$directory/}
  echo "$hash $size $servicepath $compressedpath"
}

# Given a root directory, outputs all of its mod_zip-compatible file entries
#
directoryEntries () {
  directory=$1
  for file in $(find "$directory" -type f -not -name ".directory.txt"); do
    fileEntry "$directory" "$file"
  done
}

# root_dir=/compressed

# For each directory, recursively generate its `.directory.txt` metadata file
#
for directory in $(find "$A7_VOLUME_MOUNT_PATH" -type d); do
  echo $directory
  metadata_filepath="$root_dir$directory/.directory.txt"

  # if 👇 we either want to force the metadata generation or 👇 the metadata file doesn't exist yet
  if [ "$A7_PATH_AUTO_EXPAND_INIT" = "always" ] || [ ! -e "$metadata_filepath" ]; then
    # prepare its folder (when needed)
    mkdir -p "$root_dir$directory"
    # and generate the file
    directoryEntries "$directory" > "$metadata_filepath"
  fi
done

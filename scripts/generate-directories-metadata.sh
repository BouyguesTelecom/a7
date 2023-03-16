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
  local directory="$1"
  local filepath="$2"
  local hash=$(sha1sum "$filepath" | head -c8)
  local size=$(stat -f%p "$filepath")
  local servicepath=${filepath#$A7_VOLUME_MOUNT_PATH}
  local compressedpath=${filepath#$directory/}
  echo "$hash $size $servicepath $compressedpath"
}

# Given a root directory, outputs all of its mod_zip-compatible file entries
#
directoryEntries () {
  local directory="$1"
  local metadata_filepath="$2"
  echo -n "" > "$metadata_filepath"
  find "$directory" -maxdepth 1 -type f -not -name ".directory.txt" | while read -r file; do
    fileEntry "$directory" "$file" >> "$metadata_filepath"
  done
}

# For each directory, recursively generate its `.directory.txt` metadata file
#
echo "⏹ Generating metadata files…"
find "$A7_VOLUME_MOUNT_PATH" -type d | while read -r directory; do
  echo -ne "   $directory\033[0K\r"
  metadata_filepath="$root_dir$directory/.directory.txt"

  # if 👇 we either want to force the metadata generation or 👇 the metadata file doesn't exist yet
  if [ "$A7_PATH_AUTO_EXPAND_INIT" = "always" ] || [ ! -e "$metadata_filepath" ]; then
    # generate the file
    directoryEntries "$directory" "$metadata_filepath" &
  fi
done
echo "✔ All metadata files generated."

# Wait for all background tasks completion
#
echo "⏹ Waiting for all background tasks completion…"
while [ 1 ]; do fg 2> /dev/null; [ $? == 1 ] && break; done
echo "✔ All background tasks completed."

# Deep merge metadata files into their parents
#
echo "⏹ Deep merge metadata files into their parents…"
find -s "$A7_VOLUME_MOUNT_PATH" -type d | tail -r | while read -r path; do
  echo -ne "  $path\033[0K\r"
  cat $path/*/.directory.txt >> "$path/.directory.txt" 2> /dev/null
done
echo "✔ All metadata files merged."

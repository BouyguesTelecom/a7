#!/bin/sh

# ⚠️ Mac prerequisite: `brew install coreutils`

ROOT_FOLDER=boom
TIMEFORMAT="⚡ %R"

# initialize the root folder if it does not exist already
if [ ! -d "$ROOT_FOLDER" ]; then
  # generate a dense assets directory with random files in every subdirectories
  echo "Generating a dense assets directory in \"$ROOT_FOLDER\""
  mkdir -p "$ROOT_FOLDER"/folder-a/asset-{a..e}/dir-{1..3}
  echo "with random files"
  find "$ROOT_FOLDER"/* -type d -exec sh -c 'echo $RANDOM > {}/$RANDOM.txt' \;

  # duplicate a lot
  echo "Duplicate it 4 times"
  for i in {b..e}; do
    cp -R "$ROOT_FOLDER"/folder-a "$ROOT_FOLDER"/folder-$i
  done

  # stats
  echo "folders: $(find "$ROOT_FOLDER" -mindepth 1 -type d | wc -l)"
  echo "files:   $(find "$ROOT_FOLDER" -mindepth 1 -type f | wc -l)"
  echo "size:       $(du -chs "$ROOT_FOLDER" | head -1)"
fi

# run the script
export A7_PATH_AUTO_EXPAND_INIT=always
export A7_VOLUME_MOUNT_PATH="$ROOT_FOLDER"
time ./scripts/generate-directories-metadata.sh

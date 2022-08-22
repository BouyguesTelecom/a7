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

# Handles basic template substitution.
# Looks for:
#   ## if-env ENV_VARIABLE
#   ...some nginx configuration...
#   ##/if-env ENV_VARIABLE
# Keep it or remove it whether or not the ENV_VARIABLE is truthy.
#
# Also substitutes any {{A7_VARIABLE}} to the value of `A7_VARIABLE`.
#
template_subst () {
  filepath=$1
  varname=$2
  var=$3

  cp "$filepath" "$filepath.orig"

  if [ -z "$var" ] || [ "$var" = FALSE ] || [ "$var" = false ]; then
    # the variable is not set, or falsy
    # let's remove the matching template blocks altogether
    # with a multiline-aware global replace:
    cat "$filepath.orig" \
      | tr '\n' '\r' \
      | sed -e "s/\(#*\|\/*\) if-env $varname.*\/if-env $varname/\1\1\1 💀 REMOVED TEMPLATE BLOCK: $varname/g" \
      | tr '\r' '\n' \
      > "$filepath"

    echo "ENV $varname set to '$var'; matching template blocks have been removed from: $filepath"
  else
    cat "$filepath.orig" \
      | sed -e "s/{{ *$varname *}}/$var/g" \
      > "$filepath"
  fi

  # # debug zone:

  # echo '********'
  # ls -l $filepath.orig $filepath
  # cat $filepath
  # echo '********'
}

environment_variables="A7_AUTOINDEX A7_AUTOINDEX_CORS_ALL A7_ZIP_DIRECTORIES A7_META_QUERIES A7_META_QUERIES_CORS_ALL A7_CORS_ALL A7_PATH_AUTO_EXPAND A7_GET_REQUESTS_ONLY A7_INTERNAL_API A7_TITLE A7_ICON A7_BRAND_COLOR"

for varname in $environment_variables; do
  eval value="\$$varname"
  echo "Set the env variable '$varname' to $value"
  template_subst /etc/nginx/conf.d/a7.conf "$varname" "$value"
  template_subst /usr/share/nginx/html/a7_browse_body.html "$varname" "$value"
done

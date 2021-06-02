/*
 * Copyright 2021 - Bouygues Telecom
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Version from '~/assets/Version'

/**
 * Checks if the given version is semver-acceptable and fully qualified
 * @param version: the version to be checked
 */
export function isVersionSemverComplete (version: Version): boolean {
  const isUndefined = (input?: number): boolean => (input === undefined || isNaN(input) || input === null)

  if (!version) {
    return false
  }

  return !isUndefined(version.major) && !isUndefined(version.minor) && !isUndefined(version.patch)
}

/**
 * Checks if a provided version is precise enough to correspond to a immutable response.
 * @param version The version to check
 */
export function isVersionPreciseEnough (version: Version): boolean {
  const unprecise = !version || version.latest || !isVersionSemverComplete(version)

  return !unprecise
}

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

import Asset from './Asset'
import { VersionLevel } from './VersionLevel'

/**
 * Asset name predicate
 */
export default class AssetPredicate {
  public constructor(protected requestedAsset: Asset) {
  }

  public matches(existingAsset: Asset): boolean {
    if (existingAsset.valid === false) {
      return false
    }

    if (existingAsset.name !== this.requestedAsset.name) {
      return false
    }

    const { versionLevel } = this.requestedAsset

    if (versionLevel === VersionLevel.LATEST) {
      return true
    }

    const match = {
      major: existingAsset.major === this.requestedAsset.major,
      minor:
        // Check if requestedAsset.minor exists and matches or if requestedAsset.minor is undefined or NaN
        existingAsset.minor === this.requestedAsset.minor ||
        Number.isNaN(this.requestedAsset.minor) ||
        this.requestedAsset.minor === undefined,
      patch:
        existingAsset.patch === this.requestedAsset.patch ||
        Number.isNaN(this.requestedAsset.patch) ||
        this.requestedAsset.patch === undefined,
      prerelease: existingAsset.prerelease?.startsWith(this.requestedAsset.prerelease) || false,
      build: existingAsset.build?.startsWith(this.requestedAsset.build) || false,
    }

    if (match.major && versionLevel === VersionLevel.MAJOR) {
      return true
    }

    if (match.major && match.minor && versionLevel === VersionLevel.MINOR) {
      return true
    }

    if (match.major && match.minor && match.patch && versionLevel === VersionLevel.PATCH) {
      return true
    }

    if (match.major && match.minor && match.patch && match.prerelease && versionLevel === VersionLevel.PRERELEASE) {
      return true
    }

    if (match.major && match.minor && match.patch && match.build && versionLevel === VersionLevel.BUILD) {
      return true
    }

    return false
  }
}

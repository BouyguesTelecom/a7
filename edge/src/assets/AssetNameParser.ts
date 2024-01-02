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
import { URI, URI_VERSION, STORAGE_VERSION } from './AssetSpec'
import Version from './Version'
import { VersionLevel } from './VersionLevel'

/**
 * Parse the name of an asset
 * @see Asset
 */
export default class AssetNameParser {
  /**
   * Parse the name that is expected from the storage
   * @param name (example: trilogy@0.8.1)
   */
  public parseFromStorageName (name: string): Asset {
    const match = name.match(STORAGE_VERSION)
    if (match === undefined || match === null) {
      return {
        valid: false,
      }
    }

    const asset = match.groups as Asset
    asset.major = parseInt(`${asset.major}`)
    asset.minor = parseInt(`${asset.minor}`)
    asset.patch = parseInt(`${asset.patch}`)
    asset.valid = true

    return asset
  }

  /**
   * Parse the name from the URL (consumer input)
   * @param name Example: trilogy@0
   */
  public parseFromUrl (name: string): Asset {
    const match = name.match(URI)
    if (match === undefined || match === null) {
      return {
        valid: false,
      }
    }

    const asset = match.groups as Asset
    asset.valid = Boolean(match)

    // Construct the full-fledged version object
    const version = this.parseVersionFromURIString(asset.version)
    Object.assign(asset, version)

    asset.versionLevel = AssetNameParser.calculateVersionLevel(version)

    return asset
  }

  /**
   * Parse the asset version, from string, to an object { major, minor, patch, latest }
   * @param {String} versionStr Stringified format of a version (example: "6.13.4")
   */
  private parseVersionFromURIString (versionStr: string): Version {
    if (versionStr === undefined || versionStr === null || versionStr === '') {
      return {
        latest: true,
      }
    }

    const version = versionStr.match(URI_VERSION).groups

    return {
      major: parseInt(version.major),
      minor: parseInt(version.minor),
      patch: parseInt(version.patch),
      prerelease: version.prerelease,
      build: version.build,
      latest: versionStr === 'latest',
    }
  }

  /**
   * Determinates a precision level from version numbers
   *
   * @param version The version
   */
  public static calculateVersionLevel (version: Version): VersionLevel {
    if (version.latest) {
      return VersionLevel.LATEST
    }

    // major will always be true for a valid asset o it will always prevail
    // over prerelease when minor or patch is not set
    if (version.prerelease) {
      return VersionLevel.PRERELEASE
    }

    const levels = {
      major: !isNaN(version.major),
      minor: !isNaN(version.minor),
      patch: !isNaN(version.patch),
      prerelease: Boolean(version.prerelease),
    }

    if (!levels.major) {
      return undefined
    }

    if (!levels.minor) {
      return VersionLevel.MAJOR
    }

    if (!levels.patch) {
      return VersionLevel.MINOR
    }

    if (!levels.prerelease) {
      return VersionLevel.PATCH
    }

    return VersionLevel.PRERELEASE
  }
}

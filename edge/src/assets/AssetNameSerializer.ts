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

/**
 * Serialize an asset
 * @see Asset
 */
export default class AssetNameSerializer {
  public serializeAssetName(asset: Asset): string | null {
    const version = this.serializeVersion(asset)

    if (version) {
      return `${asset.name}@${version}`
    }

    return null
  }

  private serializeVersion(asset: Asset): string | null {
    if (asset.major !== undefined && asset.minor !== undefined && asset.patch !== undefined) {
      const prerelease = asset.prerelease ? `-${asset.prerelease}` : ''
      const build = asset.build ? `+${asset.build}` : ''
      return `${asset.major}.${asset.minor}.${asset.patch}${prerelease}${build}`
    }

    return null
  }
}

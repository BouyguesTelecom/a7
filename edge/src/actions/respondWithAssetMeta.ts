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

import Asset from '../assets/Asset'
import AssetNameParser from '../assets/AssetNameParser'
import { allStoredAssets } from '../datasource/datasource'
import { hash } from '../helpers/String'
import naturalCompare from 'string-natural-compare'

/**
 * List all the version numbers of an asset
 */
function fetchAssetVersions(r: NginxHTTPRequest, requestedAsset: Asset): string[] {
  const assetNameParser = new AssetNameParser()

  const assets = allStoredAssets(r)
    .map((p) => p.name)
    .map((name) => assetNameParser.parseFromStorageName(name))

  return (
    assets
      // only grab assets whose name correspond
      .filter((asset) => asset.name === requestedAsset.name)
      // order by version using "natural sorting"
      .sort((asset1, asset2) => naturalCompare(asset2.version, asset1.version))
      // keep only the version numbers
      .map((asset) => asset.version)
  )
}

/**
 * Outputs the parsed request and available matching assets metadata, in JSON.
 */
export default function respondWithAssetMeta(r: NginxHTTPRequest): void {
  try {
    const assetNameParser = new AssetNameParser()
    const requestedAsset = assetNameParser.parseFromUrl(r.uri.toString())
    const versions = fetchAssetVersions(r, requestedAsset)
    const result = {
      requested: {
        asset: {
          name: requestedAsset.name,
          version: requestedAsset.version,
          path: requestedAsset.path,
        },
      },
      available: {
        versions,
      },
    }

    r.headersOut['Content-Type'] = 'application/json'
    r.headersOut['ETag'] = hash(JSON.stringify(result))

    r.return(200, JSON.stringify(result))
  } catch (e) {
    r.error(`Could not load the asset metadata: ${e.message}`)
    r.internalRedirect('/404.html')
  }
}

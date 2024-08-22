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
import AssetCatalog from '../assets/AssetCatalog'
import AssetComparator from '../assets/AssetComparator'
import AssetNameParser from '../assets/AssetNameParser'
import StoredAsset from '../assets/StoredAsset'
import { allStoredAssets } from '../datasource/datasource'
import { hash } from '../helpers/String'

/**
 * List all the version numbers of an asset
 */
function fetchAssets(r: NginxHTTPRequest, requestedAsset: Asset): AssetCatalog[] {
  const assetComparator = new AssetComparator()

  const nameIsInCurrentDirectoryFilter = (asset: StoredAsset) =>
    requestedAsset.name === undefined || asset.name.startsWith(requestedAsset.name)
  const orderByVersion = assetComparator.compare

  const filteredAndSortedAssets = allStoredAssets(r).filter(nameIsInCurrentDirectoryFilter).sort(orderByVersion)
  const enrichedAssets = enrichAssetsWithParsedVersions(r, filteredAndSortedAssets)
  const assetsWithLatest = assetCatalogWithLatestMarked(enrichedAssets)

  return assetsWithLatest
}

/**
 * Outputs the catalog of assets within the current directory, in JSON.
 */
export default function respondWithCatalog(r: NginxHTTPRequest): void {
  try {
    const assetNameParser = new AssetNameParser()
    const requestedAsset = assetNameParser.parseFromUrl(r.uri.toString())
    const assets = fetchAssets(r, requestedAsset)
    const result = {
      assets,
    }

    r.headersOut['Content-Type'] = 'application/json'
    r.headersOut['ETag'] = hash(JSON.stringify(result))

    r.return(200, JSON.stringify(result))
  } catch (e) {
    r.error(`Could not load the catalog: ${e.message}`)
    r.error(e.stack)
    r.internalRedirect('/404.html')
  }
}

/**
 * Enrich the asset objects with their parsed versions
 * @param assets Assets
 */
function enrichAssetsWithParsedVersions(r: NginxHTTPRequest, assets: Asset[]): AssetCatalog[] {
  const assetNameParser = new AssetNameParser()

  const result: AssetCatalog[] = []

  assets.forEach((asset) => {
    try {
      result.push({
        path: `/${asset.name}`,
        data: assetNameParser.parseFromStorageName(asset.name),
      })
    } catch (e) {
      r.warn(`Error while parsing asset: ${asset.name} / ${e.message}`)
    }
  })

  return result
}

/**
 * Enrich an asset catalog by indicating which of the assets are the latest version.
 * @param assets assets
 */
export function assetCatalogWithLatestMarked(assets: AssetCatalog[]) {
  const grouped: { [key: string]: AssetCatalog[] } = {}
  // Group assets by name and mark the latest asset
  for (let i = assets.length - 1; i >= 0; i--) {
    const asset = assets[i]
    const name = asset.data.name
    if (!grouped[name]) {
      grouped[name] = []
    }
    if (grouped[name].length === 0) {
      asset.data.latest = true
    }
    grouped[name].push(asset)
  }

  // Flatten the grouped assets into a single array
  const result = flatten<AssetCatalog>(Object.values(grouped))

  return result
}

function flat(arr: Array<unknown>, target: Array<unknown>) {
  arr.forEach(function (el) {
    if (Array.isArray(el)) flat(el, target)
    else target.push(el)
  })
}

function flatten<T>(arr: Array<unknown>): Array<T> {
  const flattened: Array<T> = []
  flat(arr, flattened)
  return flattened
}

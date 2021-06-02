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
function fetchAssets (r: NginxHTTPRequest, requestedAsset: Asset): AssetCatalog[] {
  const assetComparator = new AssetComparator()

  const nameIsInCurrentDirectoryFilter = (asset: StoredAsset) => (
    requestedAsset.name === undefined || asset.name.startsWith(requestedAsset.name)
  )
  const orderByVersion = assetComparator.compare

  const filteredAndSortedAssets = allStoredAssets(r)
    .filter(nameIsInCurrentDirectoryFilter)
    .sort(orderByVersion)
  const enrichedAssets = enrichAssetsWithParsedVersions(filteredAndSortedAssets)
  const assetsWithLatest = assetCatalogWithLatestMarked(enrichedAssets)

  return assetsWithLatest
}

/**
 * Outputs the catalog of assets within the current directory, in JSON.
 */
export default function respondWithCatalog (r: NginxHTTPRequest): void {
  try {
    const assetNameParser = new AssetNameParser()
    const requestedAsset = assetNameParser.parseFromUrl(r.uri.toString())
    const assets = fetchAssets(r, requestedAsset)
    const result = {
      assets,
    }

    r.headersOut['ETag'] = hash(JSON.stringify(result))

    r.return(200, JSON.stringify(result))
  } catch (e) {
    r.error(`Could not load the catalog: ${e.message}`)
    r.internalRedirect('/404.html')
  }
}

type KeyValue = {
  key: String
  values: AssetCatalog[]
}

/**
 * Group an asset catalog array by a predicate an asset
 * @see Asset
 */
function groupByArray (array: AssetCatalog[], predicate: Function): KeyValue[] {
  return array.reduce((array, current) => {
    const v = predicate(current)
    const el = array.find((r: any) => r && r.key === v)
    if (el) {
      el.values.push(current)
    } else {
      array.push({
        key: v,
        values: [current],
      })
    }
    return array
  }, [])
}

/**
 * Enrich the asset objects with their parsed versions
 * @param assets Assets
 */
function enrichAssetsWithParsedVersions (assets: Asset[]): AssetCatalog[] {
  const assetNameParser = new AssetNameParser()

  return assets.map(asset => ({
    ...asset,
    path: `/${asset.name}`,
    data: assetNameParser.parseFromStorageName(asset.name),
  }))
}

/**
 * Enrich an asset catalog by indicating which of the assets are the latest version.
 * @param assets assets
 */
function assetCatalogWithLatestMarked (assets: AssetCatalog[]) {
  // mark latest assets
  const grouped = groupByArray(assets.reverse(), (e: AssetCatalog) => e.data.name)
  grouped.forEach(group => {
    if (group.key && Boolean(group.values.length)) {
      group.values[0].data.latest = true
    }
  })

  // recreate a flatten assets array
  return Object.values(grouped).map(g => g.values).reduce(
    (arr, elem) => arr.concat(elem), []
  ).reverse()
}

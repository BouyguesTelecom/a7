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

/// <reference path="../../types/ngx_http_js_module.d.ts" />

import Asset from '../assets/Asset'
import AssetComparator from '../assets/AssetComparator'
import AssetNameParser from '../assets/AssetNameParser'
import AssetNameSerializer from '../assets/AssetNameSerializer'
import AssetPredicate from '../assets/AssetPredicate'
import { allStoredAssets } from '../datasource/datasource'
import { VOLUME_MOUNT_PATH } from '../helpers/Env'
import { readFile } from '../helpers/File'
import { isVersionPreciseEnough } from '../helpers/Version'

/**
 * Given a requested asset, find out what locally available asset best matches the request.
 */
function findBestMatchingCandidate (r: NginxHTTPRequest, requestedAsset: Asset): Asset {
  const assetNameParser = new AssetNameParser()
  const assetComparator = new AssetComparator()
  const assetPredicate = new AssetPredicate(requestedAsset)

  const all = allStoredAssets(r)
  const assets = all.map(p => p.name).map(name => assetNameParser.parseFromStorageName(name))

  const eligibleAssetNamesOrdered = assets
    // only grab assets whose name correspond
    .filter(p => p.name === requestedAsset.name)
    // order by version
    .sort(assetComparator.compare)

  const candidates = eligibleAssetNamesOrdered
    // filter matching asset versions and take the first result
    .filter(asset => assetPredicate.matches(asset))

  const bestMatch = candidates[0]

  if (bestMatch) {
    r.log(`Found best match: ${JSON.stringify(bestMatch)}`)
    return bestMatch
  } else {
    r.warn('Did not find best match')
  }
}

/**
 * Given a requested asset (that can have a path) and a best matching candidate asset (that may have a default path),
 * find out what the final target URI is.
 */
function computeUriPath (r: NginxHTTPRequest, requestedAsset: Asset, candidateAsset: Asset): string {
  const assetNameSerializer = new AssetNameSerializer()
  const assetStorageName = assetNameSerializer.serializeAssetName(candidateAsset)
  const all = allStoredAssets(r)

  const defaultPath = all.find(p => p.name === assetStorageName)
    ?.defaultPath

  const hasPath = Boolean(requestedAsset.path) || Boolean(defaultPath)

  if (!hasPath) {
    return ''
  }

  return `/${assetStorageName}${(requestedAsset.path || `/${defaultPath}`)}`
}

/**
 * Find out the path of a given asset
 */
function assetDefaultPath (r: NginxHTTPRequest, requestedAsset: Asset): string {
  if (!requestedAsset.name || !requestedAsset.version) {
    // cannot find an asset without these information
    return ''
  }

  return allStoredAssets(r)
    // find an exact match
    .find(p => p.name === `${requestedAsset.name}@${requestedAsset.version}`)
    // if found, grab its default path
    ?.defaultPath
    // if no default path is set
    || ''
}

/**
 * Given a requested URI, expand it into a target URI to redirect to, that corresponds to the best match.
 *
 * Optional: depends on the `serveFiles` boolean variable that can be set in the nginx configuration. (defaults to false)
 */
export default function expand (r: NginxHTTPRequest): void {
  r.log(`----- expand: ${r.uri} -----`)

  function handleNotFound (r: NginxHTTPRequest): void {
    r.warn('internal 404')
    r.internalRedirect('/404.html')
  }

  try {
    const assetNameParser = new AssetNameParser()
    const requestedAsset = assetNameParser.parseFromUrl(r.uri.toString())

    // The URI is either complete or needs a redirect
    const isVersionPrecise = isVersionPreciseEnough(requestedAsset)
    const isURIComplete = Boolean(requestedAsset.path && isVersionPrecise)
    const needsRedirect = !isURIComplete
    r.log('DEBUG: ' + JSON.stringify({ isVersionPrecise, needsRedirect, isURIComplete }))

    if (!needsRedirect) {
      // This should not happen, as this nominal case is handled in `nginx.conf` with `try_files $uri`
      if (r.variables.serveFiles) {
        // return what's asked
        r.return(200, readFile(r, `${VOLUME_MOUNT_PATH}${r.uri}`) as string)
      } else {
        handleNotFound(r)
      }
      return
    }

    if (!isVersionPrecise) {

      const candidateAsset = findBestMatchingCandidate(r, requestedAsset) // <- this is it
      const newPath = computeUriPath(r, requestedAsset, candidateAsset)

      if (!newPath) {
        handleNotFound(r)
        return
      }

      if (!!process.env.A7_CORS_ALL) {
        r.headersOut['access-control-allow-origin'] = '*'
        r.headersOut['access-control-allow-headers'] = '*'
      }

      r.log(`302: ${newPath}`)
      r.return(302, newPath)

    } else if (!requestedAsset.path) {

      const assetPath = assetDefaultPath(r, requestedAsset)

      if (!assetPath) {
        handleNotFound(r)
        return
      }

      const newPath = `/${requestedAsset.name}@${requestedAsset.version}/${assetPath}`

      if (!!process.env.A7_CORS_ALL) {
        r.headersOut['access-control-allow-origin'] = '*'
        r.headersOut['access-control-allow-headers'] = '*'
      }

      r.log(`302: ${newPath}`)
      r.return(302, newPath)

    } else {
      handleNotFound(r)
    }
  } catch (e) {
    r.error(e)
    handleNotFound(r)
  }
}

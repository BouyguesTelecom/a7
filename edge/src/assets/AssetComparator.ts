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
import { compare } from '../helpers/String'
/**
 * Compare which one of two assets has priority
 */
export default class AssetComparator {
  public compare(asset1: Asset, asset2: Asset): number {
    if (asset1.major === undefined || asset2.major === undefined) {
      return 0
    }

    if (asset1.minor === undefined || asset2.minor === undefined) {
      return 0
    }

    if (asset1.patch === undefined || asset2.patch === undefined) {
      return 0
    }

    if (asset1.major !== asset2.major) {
      return asset2.major - asset1.major
    }

    if (asset1.minor !== asset2.minor) {
      return asset2.minor - asset1.minor
    }

    if (asset1.patch !== asset2.patch) {
      return asset2.patch - asset1.patch
    }

    if (asset1.prerelease !== asset2.prerelease) {
      return compare(asset2.prerelease, asset1.prerelease)
    }

    if (asset1.build !== asset2.build) {
      return compare(asset2.build, asset1.build)
    }

    return 0
  }
}

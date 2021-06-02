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

import { expect } from 'chai'
import AssetComparator from '../../src/assets/AssetComparator'
import Asset from '../../src/assets/Asset'

const assetComparator = new AssetComparator()

describe('AssetComparator', () => {
  describe('#compare()', () => {
    it('list of asset is correctly sorted', () => {
      const assets = [{
        major: 0,
        minor: 9,
        patch: 1,
        version: '0.9.1',
      }, {
        major: 0,
        minor: 8,
        patch: 2,
        version: '0.8.2',
      }, {
        major: 1,
        minor: 0,
        patch: 1,
        version: '1.0.1',
      }, {
        major: 1,
        minor: 1,
        patch: 0,
        version: '1.1.0',
      }, {
        major: 0,
        minor: 9,
        patch: 0,
        version: '0.9.0',
      }, {
        major: 0,
        minor: 9,
        patch: 2,
        version: '0.9.2',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: 'alpha.1',
        version: '1.0.0-alpha.1',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: 'alpha.3',
        version: '1.0.0-alpha.3',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: 'beta',
        version: '1.0.0-beta',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        build: '55',
        version: '1.0.0+55',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        build: '22',
        version: '1.0.0+22',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        build: '33',
        version: '1.0.0+33',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: 'alpha.2',
        version: '1.0.0-alpha.2',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        version: '1.0.0',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: 'alpha.2',
        build: 'foo',
        version: '1.0.0-alpha.2+foo',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: 'alpha.2',
        build: 'bar',
        version: '1.0.0-alpha.2+bar',
      }, {
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: 'alpha.3',
        build: 'baz',
        version: '1.0.0-alpha.3+baz',
      }, {
        major: 1,
        minor: 2,
        patch: 0,
        prerelease: 'snapshot',
        build: '2',
        version: '1.2-snapshot+2',
      }, {
        major: 1,
        minor: 2,
        patch: 0,
        prerelease: 'snapshot',
        build: '1',
        version: '1.2-snapshot+1',
      }] as Asset[]

      assets.sort(assetComparator.compare)

      const versionsJson = assets.map(asset => asset.version)

      expect(versionsJson).to.eql([
        '1.2-snapshot+2',
        '1.2-snapshot+1',
        '1.1.0',
        '1.0.1',
        '1.0.0',
        '1.0.0+55',
        '1.0.0+33',
        '1.0.0+22',
        '1.0.0-beta',
        '1.0.0-alpha.3',
        '1.0.0-alpha.3+baz',
        '1.0.0-alpha.2',
        '1.0.0-alpha.2+foo',
        '1.0.0-alpha.2+bar',
        '1.0.0-alpha.1',
        '0.9.2',
        '0.9.1',
        '0.9.0',
        '0.8.2',
      ])
    })
  })
})

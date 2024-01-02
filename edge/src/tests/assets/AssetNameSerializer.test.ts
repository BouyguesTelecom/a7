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

import { describe, expect, it } from 'vitest'
import AssetNameSerializer from '@/assets/AssetNameSerializer'

const assetNameSerializer = new AssetNameSerializer()

describe('AssetNameSerializer', () => {
  describe('#serializeAssetName()', () => {
    it('should serialize a x.y.z version', () => {
      const serializeAssetName = assetNameSerializer.serializeAssetName({
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 2,
      })

      expect(serializeAssetName).to.equal('trilogy@0.9.2')
    })

    it('should serialize a x.y.z-prerelease version', () => {
      const serializeAssetName = assetNameSerializer.serializeAssetName({
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 2,
        prerelease: 'alpha',
      })

      expect(serializeAssetName).to.equal('trilogy@0.9.2-alpha')
    })

    it('should serialize a x.y.z+build version', () => {
      const serializeAssetName = assetNameSerializer.serializeAssetName({
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 2,
        build: 'turtle',
      })

      expect(serializeAssetName).to.equal('trilogy@0.9.2+turtle')
    })

    it('should serialize a x.y.z-prerelease+build version', () => {
      const serializeAssetName = assetNameSerializer.serializeAssetName({
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 2,
        prerelease: 'alpha',
        build: 'turtle',
      })

      expect(serializeAssetName).to.equal('trilogy@0.9.2-alpha+turtle')
    })
  })
})

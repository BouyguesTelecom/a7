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
import AssetPredicate from '@/assets/AssetPredicate'
import { VersionLevel } from '@/assets/VersionLevel'

describe('AssetPredicate', () => {
  describe('#matches()', () => {
    it('matches latest no matter what version is used', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.LATEST,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 1,
        version: '0.9.1',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })

    it('should not match invalid', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.LATEST,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 1,
        version: '0.9.1',
        valid: false,
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(false)
    })

    it('does not match different libraries', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.LATEST,
      })

      const existingAsset = {
        name: 'picto',
        major: 0,
        minor: 9,
        patch: 1,
        version: '0.9.1',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(false)
    })

    it('matches corresponding major versions', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.MAJOR,
        major: 0,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 1,
        version: '0.9.1',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })

    it('does not match not corresponding major versions', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.MAJOR,
        major: 0,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 1,
        minor: 9,
        patch: 1,
        version: '1.9.1',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(false)
    })

    it('matches corresponding minor versions', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.MINOR,
        major: 0,
        minor: 9,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 2,
        version: '0.9.2',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })

    it('does not matches not corresponding minor versions but corresponding major ones', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.MINOR,
        major: 0,
        minor: 8,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 2,
        version: '0.9.2',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(false)
    })

    it('matches corresponding patch versions', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.PATCH,
        major: 0,
        minor: 9,
        patch: 3,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 3,
        version: '0.9.2',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })

    it('does not match not corresponding patch versions', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.PATCH,
        major: 0,
        minor: 9,
        patch: 2,
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 3,
        version: '0.9.2',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(false)
    })

    it('matches corresponding prerelease versions', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.PRERELEASE,
        major: 0,
        minor: 9,
        patch: 3,
        prerelease: 'alpha',
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 3,
        version: '0.9.2',
        prerelease: 'alpha',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })

    it('matches corresponding prerelease versions', () => {
      const assetPredicate = new AssetPredicate({
        name: 'trilogy',
        versionLevel: VersionLevel.PRERELEASE,
        major: 0,
        minor: 9,
        patch: 3,
        prerelease: 'alpha',
      })

      const existingAsset = {
        name: 'trilogy',
        major: 0,
        minor: 9,
        patch: 3,
        version: '0.9.2',
        prerelease: 'alpha4',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })

    it('should handle snapshot releases (1.2.3-snapshot -> 1.2.3-snapshot8)', () => {
      const assetPredicate = new AssetPredicate({
        name: 'package',
        versionLevel: VersionLevel.PRERELEASE,
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'snapshot',
      })

      const existingAsset = {
        name: 'package',
        major: 1,
        minor: 2,
        patch: 3,
        version: '1.2.3',
        prerelease: 'snapshot8',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })

    it('should handle snapshot releases (1.2-snapshot -> 1.2.3-snapshot8)', () => {
      const assetPredicate = new AssetPredicate({
        name: 'package',
        versionLevel: VersionLevel.PRERELEASE,
        major: 1,
        minor: 2,
        prerelease: 'snapshot',
      })

      const existingAsset = {
        name: 'package',
        major: 1,
        minor: 2,
        patch: 3,
        version: '1.2.3',
        prerelease: 'snapshot8',
      }

      expect(assetPredicate.matches(existingAsset)).to.equal(true)
    })
  })

  it('should handle snapshot releases (1-snapshot -> 1.2.3-snapshot8)', () => {
    const assetPredicate = new AssetPredicate({
      name: 'package',
      versionLevel: VersionLevel.PRERELEASE,
      major: 1,
      prerelease: 'snapshot',
    })

    const existingAsset = {
      name: 'package',
      major: 1,
      minor: 2,
      patch: 3,
      version: '1.2.3',
      prerelease: 'snapshot8',
    }

    expect(assetPredicate.matches(existingAsset)).to.equal(true)
  })

  it('should handle snapshot releases (1.2-snapshot2 -/> 1.2.3-snapshot8)', () => {
    const assetPredicate = new AssetPredicate({
      name: 'package',
      versionLevel: VersionLevel.PRERELEASE,
      major: 1,
      minor: 2,
      prerelease: 'snapshot2',
    })

    const existingAsset = {
      name: 'package',
      major: 1,
      minor: 2,
      patch: 3,
      version: '1.2.3',
      prerelease: 'snapshot8',
    }

    expect(assetPredicate.matches(existingAsset)).to.equal(false)
  })

  it('should handle snapshot releases (1.2-snapshot -> 1.2.3-snapshot8+123456)', () => {
    const assetPredicate = new AssetPredicate({
      name: 'package',
      versionLevel: VersionLevel.PRERELEASE,
      major: 1,
      minor: 2,
      prerelease: 'snapshot',
    })

    const existingAsset = {
      name: 'package',
      major: 1,
      minor: 2,
      patch: 3,
      version: '1.2.3',
      prerelease: 'snapshot8',
      build: '123456',
    }

    expect(assetPredicate.matches(existingAsset)).to.equal(true)
  })

  it('should handle builds (1.2 -> 1.2.3+build)', () => {
    const assetPredicate = new AssetPredicate({
      name: 'package',
      versionLevel: VersionLevel.MINOR,
      major: 1,
      minor: 2,
    })

    const existingAsset = {
      name: 'package',
      major: 1,
      minor: 2,
      patch: 3,
      version: '1.2.3',
      build: 'build',
    }

    expect(assetPredicate.matches(existingAsset)).to.equal(true)
  })

  it('should handle builds (1.2+build -> 1.2.3+build)', () => {
    const assetPredicate = new AssetPredicate({
      name: 'package',
      versionLevel: VersionLevel.BUILD,
      major: 1,
      minor: 2,
      build: 'build',
    })

    const existingAsset = {
      name: 'package',
      major: 1,
      minor: 2,
      patch: 3,
      version: '1.2.3',
      build: 'build',
    }

    expect(assetPredicate.matches(existingAsset)).to.equal(true)
  })
})

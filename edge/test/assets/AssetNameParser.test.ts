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
import AssetNameParser from '../../src/assets/AssetNameParser'
import { VersionLevel } from '../../src/assets/VersionLevel'

const assetNameParser = new AssetNameParser()

describe('AssetNameParser', () => {
  describe('#parseFromStorageName()', () => {
    it('should not parse invalid input', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('invalid')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should not parse empty input', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should parse input with complete version (0.8.1)', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy@0.8.1')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.version).to.equal('0.8.1')
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(8)
      expect(parsedVersion.patch).to.equal(1)
    })

    it('should parse input with complete version (0.10.1)', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy@0.10.1')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.version).to.equal('0.10.1')
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(10)
      expect(parsedVersion.patch).to.equal(1)
    })

    it('should parse input with complete version (1.0.0-snapshot)', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy@1.0.0-snapshot')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.version).to.equal('1.0.0-snapshot')
      expect(parsedVersion.major).to.equal(1)
      expect(parsedVersion.minor).to.equal(0)
      expect(parsedVersion.patch).to.equal(0)
      expect(parsedVersion.prerelease).to.equal('snapshot')
    })

    it('should parse input with complete version (1.0.0-snapshot+5)', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy@1.0.0-snapshot+5')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.version).to.equal('1.0.0-snapshot+5')
      expect(parsedVersion.major).to.equal(1)
      expect(parsedVersion.minor).to.equal(0)
      expect(parsedVersion.patch).to.equal(0)
      expect(parsedVersion.prerelease).to.equal('snapshot')
      expect(parsedVersion.build).to.equal('5')
    })

    it('should parse input with complete version (1.0.0+5)', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy@1.0.0+5')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.version).to.equal('1.0.0+5')
      expect(parsedVersion.major).to.equal(1)
      expect(parsedVersion.minor).to.equal(0)
      expect(parsedVersion.patch).to.equal(0)
      expect(parsedVersion.build).to.equal('5')
    })

    it('should parse input with complete version and a dash inside the name', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy-slider@0.8.1')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('trilogy-slider')
      expect(parsedVersion.version).to.equal('0.8.1')
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(8)
      expect(parsedVersion.patch).to.equal(1)
    })

    it('should not accept input starting with a dash', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('-trilogy@0.8.1')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should not accept input starting with a number', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('0trilogy@0.8.1')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should not accept input ending with a dash', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy-@0.8.1')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should accept input ending with a number', () => {
      const parsedVersion = assetNameParser.parseFromStorageName('trilogy2@0.8.1')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('trilogy2')
      expect(parsedVersion.version).to.equal('0.8.1')
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(8)
      expect(parsedVersion.patch).to.equal(1)
    })
  })

  describe('#parseFromUrl()', () => {
    it('should not accept empty value', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should not accept filesystem type value', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy-0.8.1')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should accept correct value', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy@0.8.1')

      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(8)
      expect(parsedVersion.patch).to.equal(1)
      expect(parsedVersion.versionLevel).to.equal(VersionLevel.PATCH)
    })

    it('shorter version accept correct value', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy@0')

      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.be.NaN
      expect(parsedVersion.patch).to.be.NaN
      expect(parsedVersion.versionLevel).to.equal(VersionLevel.MAJOR)
    })

    it('shorter version accept correct value', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy@0.9')

      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(9)
      expect(parsedVersion.patch).to.be.NaN
      expect(parsedVersion.versionLevel).to.equal(VersionLevel.MINOR)
    })

    it('shorter version accept correct value (minor version)', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy@0.6')

      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(6)
      expect(parsedVersion.patch).to.be.NaN
      expect(parsedVersion.versionLevel).to.equal(VersionLevel.MINOR)
    })

    it('shorter version accept correct value (minor version, 0.10)', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy@0.10')

      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.major).to.equal(0)
      expect(parsedVersion.minor).to.equal(10)
      expect(parsedVersion.patch).to.be.NaN
      expect(parsedVersion.versionLevel).to.equal(VersionLevel.MINOR)
    })

    it('should accept latest value', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy@latest')

      expect(parsedVersion.name).to.equal('trilogy')
      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.versionLevel).to.equal(VersionLevel.LATEST)
    })

    it('should not accept capital letters', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/trilogy@LATEST')

      expect(parsedVersion.valid).to.equal(false)
    })

    it('should accept /foo/bar@1.4.0/baz.js', () => {
      const parsedVersion = assetNameParser.parseFromUrl('/foo/bar@1.4.0/baz.js')

      expect(parsedVersion.valid).to.equal(true)
      expect(parsedVersion.name).to.equal('foo/bar')
      expect(parsedVersion.namespace).to.equal('foo')
      expect(parsedVersion.subname).to.equal('bar')
      expect(parsedVersion.version).to.equal('1.4.0')
      expect(parsedVersion.path).to.equal('/baz.js')
    })
  })
})

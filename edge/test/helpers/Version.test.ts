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
import { isVersionSemverComplete, isVersionPreciseEnough } from '../../src/helpers/Version'
import Version from '../../src/assets/Version'

describe('Version', () => {
  describe('#isVersionSemverComplete', () => {
    it('should not detect semver complete when a version is major', () => {
      const version: Version = {
        major: 1,
      }

      expect(isVersionSemverComplete(version)).to.equal(false)
    })

    it('should not detect semver complete when a version is minor', () => {
      const version: Version = {
        major: 1,
        minor: 1,
      }

      expect(isVersionSemverComplete(version)).to.equal(false)
    })

    it('should not detect semver complete when one property is null', () => {
      const version: Version = {
        major: 1,
        minor: 1,
        patch: null,
      }

      expect(isVersionSemverComplete(version)).to.equal(false)
    })

    it('should detect semver complete when a version is patch', () => {
      const version: Version = {
        major: 1,
        minor: 1,
        patch: 1,
      }

      expect(isVersionSemverComplete(version)).to.equal(true)
    })

    it('should detect semver complete when patch is zero', () => {
      const version: Version = {
        major: 1,
        minor: 1,
        patch: 0,
      }

      expect(isVersionSemverComplete(version)).to.equal(true)
    })

    it('should not detect semver complete when version is not provided', () => {
      expect(isVersionSemverComplete(null)).to.equal(false)
    })
  })



  describe('#isVersionPreciseEnough', () => {
    it('should not detect latest as precise enough', () => {
      const version: Version = {
        latest: false,
      }

      expect(isVersionPreciseEnough(version)).to.equal(false)
    })
  })
})

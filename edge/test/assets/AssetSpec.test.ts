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
import * as spec from '../../src/assets/AssetSpec'

/**
 * Apply a regular expression against a string and extract its named captures
 * @param input Input string
 * @param expression
 */
function extractStrict (expression: string, input: string): object {
  return input.match(new RegExp(`^(?<captured>${expression})$`))?.groups
}

describe('AssetSpec', () => {
  describe('#NAME_PART', () => {
    it('should handle valid names (one letter)', () => {
      expect(extractStrict(spec.NAME_PART, 'x'))
        .to.deep.include({
          captured: 'x',
        })
    })

    it('should handle valid names (simple name)', () => {
      expect(extractStrict(spec.NAME_PART, 'name'))
        .to.deep.include({
          captured: 'name',
        })
    })

    it('should handle valid names (simple name with an hyphen)', () => {
      expect(extractStrict(spec.NAME_PART, 'with-hyphen'))
        .to.deep.include({
          captured: 'with-hyphen',
        })
    })

    it('should handle valid names (simple name with an underscore)', () => {
      expect(extractStrict(spec.NAME_PART, 'with_underscore'))
        .to.deep.include({
          captured: 'with_underscore',
        })
    })

    it('should handle valid names (with scope)', () => {
      expect(extractStrict(spec.FULLY_QUALIFIED_NAME, '@scope/name'))
        .to.deep.include({
          captured: '@scope/name',
        })
      expect(extractStrict(spec.NAME_PART, 'name'))
        .to.deep.include({
          captured: 'name',
        })
    })

    it('should handle valid names (with namespace)', () => {
      expect(extractStrict(spec.FULLY_QUALIFIED_NAME, 'namespace/name'))
        .to.deep.include({
          captured: 'namespace/name',
        })
    })

    it('should handle valid names (with deep namespace)', () => {
      expect(extractStrict(spec.FULLY_QUALIFIED_NAME, 'very/deep/and/nested/namespace/name'))
        .to.deep.include({
          captured: 'very/deep/and/nested/namespace/name',
        })
    })

    it('should handle invalid names (empty)', () => {
      expect(extractStrict(spec.NAME_PART, ''))
        .to.be.undefined
    })

    it('should handle invalid names (starts with a digit)', () => {
      expect(extractStrict(spec.NAME_PART, '1starts-with-digit'))
        .to.be.undefined
    })

    it('should handle invalid names (has a leading hyphen)', () => {
      expect(extractStrict(spec.NAME_PART, '-has-leading-hyphen'))
        .to.be.undefined
    })

    it('should handle invalid names (has a leading underscore)', () => {
      expect(extractStrict(spec.NAME_PART, '_leading-underscore'))
        .to.be.undefined
    })

    it('should handle tralala', () => {
      expect(extractStrict(spec.STORAGE_VERSION, '_leading-underscore'))
        .to.be.undefined
    })
  })
})

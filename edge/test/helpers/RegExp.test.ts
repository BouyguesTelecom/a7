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
import { parseRegexpTemplateString as regex } from '../../src/helpers/RegExp'

const tests = [{
  it: 'should handle a simple string',
  input: regex `simple string`,
  expected: 'simple string',
}, {
  it: 'should handle multiline template strings',
  input: regex `
    multi
    line
    template string
  `,
  expected: 'multilinetemplate string',
}, {
  it: 'should handle a template string with variables',
  input: regex `
    template string
    ${`variable ${true}`}
  `,
  expected: 'template stringvariable true',
}, {
  it: 'should handle inline comments',
  input: regex `
    something   # this is an auto-removed inline comment
  `,
  expected: 'something',
}, {
  it: 'should block comments',
  input: regex `
    # this is a
    # block comment
    something
  `,
  expected: 'something',
}, {
  it: 'should handle (and preserve) regular expressions syntax',
  input: regex `
    (?:
      this is the rythm of the\\s
      [night|day|dance]
      ([^/]\\)$\\w\\d)
    )
  `,
  expected: '(?:this is the rythm of the\\s[night|day|dance]([^/]\\)$\\w\\d))',
}]

describe('RegExp', () => {
  describe('#parseRegexpTemplateString', () => {
    tests.forEach(test => {
      it(test.it, () => {
        expect(test.input).to.equal(test.expected)
      })
    })
  })
})

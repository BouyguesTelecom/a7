/*
 * Copyright 2023 - Bouygues Telecom
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
import { isCssURI, isJsURI, minifyCSS, minifyJS, resolveNonMinifiedURI } from '@/helpers/Minify'

describe('Minify', () => {
  describe('URI', () => {
    it('should resolve non-minified URIs', () => {
      const mappings = {
        'https://example.com/foo.min.css': 'https://example.com/foo.css',
        'https://example.com/foo.min.js': 'https://example.com/foo.js',
        'https://example.com/foo.min.mjs': 'https://example.com/foo.mjs',
        'https://example.com/foo.css': 'https://example.com/foo.css',
        'https://example.com/foo.js': 'https://example.com/foo.js',
        'https://example.com/foo.mjs': 'https://example.com/foo.mjs',
      }

      Object.entries(mappings).forEach(([minified, nonMinified]) => {
        expect(resolveNonMinifiedURI(minified)).toStrictEqual(nonMinified)
      })
    })
  })

  describe('CSS', () => {
    it('should detect CSS URIs', () => {
      const valid = ['https://example.com/foo.css', 'https://example.com/foo.min.css']
      const invalid = ['https://example.com/foo.js', 'https://example.com/foo.min.js', 'https://example.com/foo']

      valid.forEach((uri) => {
        expect(isCssURI(uri)).toStrictEqual(true)
      })
      invalid.forEach((uri) => {
        expect(isCssURI(uri)).toStrictEqual(false)
      })
    })

    it('should minify CSS', () => {
      const input = `
        /*
          multiline
          comment
        */

        body {
          color:      #000000;
          background: white;
          margin:     0.5em;
        }
      `
      const expected = 'body{color:#000;background:#fff;margin:.5em}'

      expect(minifyCSS(input)).toStrictEqual(expected)
    })
  })

  describe('JS', () => {
    it('should detect JS URIs', () => {
      const valid = ['https://example.com/foo.js', 'https://example.com/foo.min.js', 'https://example.com/foo.mjs']
      const invalid = ['https://example.com/foo.css', 'https://example.com/foo.min.css', 'https://example.com/foo']

      valid.forEach((uri) => {
        expect(isJsURI(uri)).toStrictEqual(true)
      })
      invalid.forEach((uri) => {
        expect(isJsURI(uri)).toStrictEqual(false)
      })
    })

    it('should minify JS', () => {
      const input = `
        /*
          multiline
          comment
        */

        const foo = {
          bar: 'baz',
        };

        console.log(foo);

        function test() {
          return 'test';
        }
      `

      // eslint-disable-next-line
      const expected = "const foo = { bar: 'baz'}; console.log(foo); function test() { return 'test'}"

      expect(minifyJS(input)).toStrictEqual(expected)
    })
  })
})

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

import { expect } from 'chai'
import minify from '../../src/actions/minify'

const tests = [
  {
    it: 'should serve as-is pre-existing JS files',
    request: '/namespace/package@1.23.4/library-with-min.min.js',
    expectedHeaders: {
      status: 200,
    },
    expectedLength: 439,
  },
]

describe('actions', () => {
  describe('#minify', () => {
    tests.forEach((test) => {
      it(test.it, () => {
        const { request } = test

        const r = <NginxHTTPRequest>{
          uri: {
            toString: () => request,
          },
          log: (...args: any[]): void => {
            console.log(...args)
          },
          error: (...args: any[]): void => {
            console.error(...args)
          },
          warn: (...args: any[]): void => {
            console.warn(...args)
          },
          variables: <NginxVariables>(<any>{
            serveFiles: true,
          }),
          internalRedirect(_uri: NjsStringLike) {},
          return: (status: number, body?: NjsStringLike): void => {
            const result = [status, body]
            expect(result).to.equal(test.expectedHeaders)
            expect(body.length).to.equal(test.expectedLength)
          },
        }

        minify(r)
      })
    })
  })
})

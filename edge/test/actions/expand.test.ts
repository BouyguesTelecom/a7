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
import expand from '../../src/actions/expand'

const tests = [{
  it: 'should handle fully qualified URI: /foo@1.3.0/path/to/file.js',
  request: '/foo@1.3.0/path/to/file.js',
  expectedHeaders: {
    status: 302,
    location: '/foo@1.3.0/path/to/file.js',
  },
}, {
  it: 'should handle URI with missing path: /foo@1.3.0',
  request: '/foo@1.3.0',
  expectedHeaders: {
    status: 302,
    location: '/foo@1.3.0/path/to/file.js',
  },
}]

describe('actions', () => {
  describe('#expand', () => {
    tests.forEach(test => {
      it(test.it, () => {
        const { request } = test

        const r = <NginxHTTPRequest>{
          uri: {
            toString: () => request,
          },
          log: (...args: any[]): void => {
            console.log(...args)
          },
          variables: <NginxVariables><any>{
            serveFiles: true,
          },
          return: (status: number, body?: NjsStringLike): void => {
            const result = [status, body]
            expect(result).to.equal(test.expectedHeaders)
          },
        }

        expand(r)
      })
    })
  })
})

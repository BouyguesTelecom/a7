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

import { it, expect } from 'vitest'

import { MockNjsByteString } from '../__mocks__/MockNginxHTTPRequest'
import { debugAction } from '../utils'
import { assetCatalogWithLatestMarked } from '../../actions/respondWithCatalog'

debugAction({
  name: 'respondWithCatalog',
  input: {
    args: {},
    headersIn: {},
    httpVersion: new MockNjsByteString('1.1'),
    method: new MockNjsByteString('GET'),
    remoteAddress: new MockNjsByteString(''),
    requestBody: new MockNjsByteString(''),
    uri: new MockNjsByteString('/?catalog'),
    variables: {},
  },
  output: {
    responseBody: new MockNjsByteString('string'),
    status: 200,
    headersOut: {},
  },
})

it('assetCatalogWithLatestMarked', () => {
  const input = [
    {
      path: '/namespace/package@1.23.4',
      data: {
        name: 'namespace/package',
        namespace: 'namespace',
        subname: 'package',
        version: '1.23.4',
        major: 1,
        minor: 23,
        patch: 4,
        valid: true,
      },
    },
    {
      path: '/package@1.2.1',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.2.1',
        major: 1,
        minor: 2,
        patch: 1,
        valid: true,
      },
    },
    {
      path: '/package@1.2.3',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.2.3',
        major: 1,
        minor: 2,
        patch: 3,
        valid: true,
      },
    },
    {
      path: '/package@1.3.0',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.3.0',
        major: 1,
        minor: 3,
        patch: 0,
        valid: true,
      },
    },
    {
      path: '/package@1.3.0-snapshot.20201203171530',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.3.0-snapshot.20201203171530',
        major: 1,
        minor: 3,
        patch: 0,
        prerelease: 'snapshot.20201203171530',
        valid: true,
      },
    },
  ]
  const expected = [
    {
      path: '/package@1.3.0-snapshot.20201203171530',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.3.0-snapshot.20201203171530',
        major: 1,
        minor: 3,
        patch: 0,
        prerelease: 'snapshot.20201203171530',
        valid: true,
        latest: true,
      },
    },
    {
      path: '/package@1.3.0',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.3.0',
        major: 1,
        minor: 3,
        patch: 0,
        valid: true,
      },
    },
    {
      path: '/package@1.2.3',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.2.3',
        major: 1,
        minor: 2,
        patch: 3,
        valid: true,
      },
    },
    {
      path: '/package@1.2.1',
      data: {
        name: 'package',
        subname: 'package',
        version: '1.2.1',
        major: 1,
        minor: 2,
        patch: 1,
        valid: true,
      },
    },
    {
      path: '/namespace/package@1.23.4',
      data: {
        name: 'namespace/package',
        namespace: 'namespace',
        subname: 'package',
        version: '1.23.4',
        major: 1,
        minor: 23,
        patch: 4,
        valid: true,
        latest: true,
      },
    },
  ]

  expect(assetCatalogWithLatestMarked(input)).toStrictEqual(expected)
})

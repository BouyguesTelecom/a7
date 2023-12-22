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

import { afterEach, describe, it, expect, vi } from 'vitest'
import expand from '../../src/actions/expand'
import MockNginxHTTPRequest, { MockNjsByteString } from '../__mocks__/MockNginxHTTPRequest'
import * as File from '../../src/helpers/File'

describe('DEBUG_MODE: action=expand', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  const isDebug = Boolean(process.env.DEBUG_MODE)
  it.runIf(isDebug)('Should return something', () => {
    vi.spyOn(File, 'readFile').mockReturnValueOnce('test')

    const result = expand(
      new MockNginxHTTPRequest({
        args: {},
        headersIn: {},
        headersOut: {},
        httpVersion: new MockNjsByteString('1.1'),
        method: new MockNjsByteString('GET'),
        remoteAddress: new MockNjsByteString(''),
        requestBody: new MockNjsByteString(''),
        responseBody: new MockNjsByteString(''),
        uri: new MockNjsByteString(''),
        variables: {},
      })
    )
    expect(result).toBeDefined()
  })
})

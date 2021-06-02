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
import {hash} from '../../src/helpers/String'

describe('String', () => {
  describe('#hash', () => {
    it('same strings should have the same hash', () => {
      const string1 = 'content1'
      const string2 = 'content1'

      expect(hash(string1)).to.equal(hash(string2))
    })

    it('empty string should have a hash', () => {
      const emptyString = ''

      expect(hash(emptyString)).to.be.a('string')
    })
  })
})

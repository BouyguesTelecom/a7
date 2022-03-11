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

import {VersionLevel} from './VersionLevel'

export default interface Asset {

  /**
   * Name of the asset. Can contain the scope or namespace.
   */
  name?: string

  /**
   * Scope of the asset.
   */
  scope?: string

  /**
   * Namespace of the asset.
   */
  namespace?: string

  /**
   * Name of the asset project, without its scope and namespace.
   */
  subname?: string

  /**
   * Version of the asset. Contains it all.
   */
  version?: string

  major?: number

  minor?: number

  patch?: number

  prerelease?: string

  build?: string

  path?: string

  latest?: boolean
  valid?: boolean
  versionLevel?: VersionLevel
}

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

import {
  rmdir as actuallyRemoveDirectory,
  unlink as actuallyRemoveFile,
  writeFile as actuallyWriteFile,
} from '../helpers/File'

/**
 * Get the full path of a file.
 */
function getFullPath(r: NginxHTTPRequest): string {
  const path = r.uri.replace(/^\/__api\/files/, '')
  const fullPath = `/assets${path}`

  return fullPath
}

/**
 * Write a file to disk.
 */
function writeFile(r: NginxHTTPRequest): void {
  r.log(`----- write: ${r.uri} ${r.requestBody} -----`)

  const fullPath = getFullPath(r)
  const body = String(r.requestBody)

  actuallyWriteFile(r, fullPath, body)

  r.return(200, JSON.stringify({ status: 'ok' }))
}

/**
 * Delete a directory from disk.
 */
function deleteDirectory(r: NginxHTTPRequest): void {
  r.log(`----- delete: ${r.uri} -----`)

  const fullPath = getFullPath(r)

  actuallyRemoveDirectory(r, fullPath)

  r.return(200, JSON.stringify({ status: 'ok' }))
}

/**
 * Delete a file from disk.
 */
function deleteFile(r: NginxHTTPRequest): void {
  r.log(`----- delete: ${r.uri} -----`)

  const fullPath = getFullPath(r)

  actuallyRemoveFile(r, fullPath)

  r.return(200, JSON.stringify({ status: 'ok' }))
}

export default function manageFile(r: NginxHTTPRequest): void {
  const method = r.variables.request_method.toString()

  switch (method) {
    case 'POST':
      writeFile(r)
      break
    case 'DELETE':
      try {
        deleteFile(r)
      } catch (e) {
        deleteDirectory(r)
      }
      break
    default:
      r.log(`Method not allowed: ${method}`)
      r.return(405)
  }
}

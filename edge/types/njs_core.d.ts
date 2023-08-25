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

// Source: https://hg.nginx.org/njs/file/tip/src/ts/njs_core.d.ts

interface StringConstructor {
  /**
   * Creates a byte string from an encoded string.
   */
  bytesFrom(bytes: string, encoding: 'hex' | 'base64' | 'base64url'): NjsByteString
  /**
   * Creates a byte string from an array that contains octets.
   */
  bytesFrom(bytes: Array<number>): NjsByteString
}

interface String {
  /**
   * Serializes a Unicode string with code points up to 255
   * into a byte string, otherwise, null is returned.
   */
  toBytes(start?: number, end?: number): NjsByteString
  /**
   * Serializes a Unicode string to a byte string using UTF8 encoding.
   */
  toUTF8(start?: number, end?: number): NjsByteString
}

// eslint-disable-next-line @typescript-eslint/ban-types
interface NjsByteString extends String {
  /**
   * Returns a new Unicode string from a byte string where each byte is replaced
   * with a corresponding Unicode code point.
   */
  fromBytes(start?: number, end?: number): string
  /**
   * Converts a byte string containing a valid UTF8 string into a Unicode string,
   * otherwise null is returned.
   */
  fromUTF8(start?: number, end?: number): string
  /**
   * Encodes a byte string to hex, base64, or base64url.
   */
  toString(encoding?: 'hex' | 'base64' | 'base64url'): string
}

type NjsStringLike = string | NjsByteString

// Global objects

interface NjsGlobal {
  readonly version: string
  dump(value: unknown, indent?: number): string
}

declare const njs: NjsGlobal

interface NjsEnv {
  readonly [prop: string]: NjsByteString
}

interface NjsProcess {
  readonly pid: number
  readonly ppid: number
  readonly argv: string[]
  readonly env: NjsEnv
}

// declare const process: NjsProcess;

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

/**
 * Strip down superfluous spaces and comments from a regular-expression-ready multi-line string.
 */
function cleanRegexPart(str: string): string {
  return (
    str
      // for each line
      .split(/(\n\s)+/)
      // remove all (inline and block) comments, and trim the result
      .map((line) => line.replace(/\s+#\s+.+$/m, '').trim())
      // merge all the parts
      .join('')
  )
}

/**
 * Strip down a template string to a single-line comment-less regular regex syntax
 * @param literals      Literals of the template string
 * @param placeholders  Placeholders of the template string
 */
export function parseRegexpTemplateString(literals: TemplateStringsArray, ...placeholders: unknown[]): string {
  return (
    placeholders
      .map(
        (placeholder, i) =>
          // interleave the literals with the placeholders
          `${cleanRegexPart(literals[i])}${placeholder}`
      )
      .join('') + cleanRegexPart(literals[literals.length - 1])
  )
}

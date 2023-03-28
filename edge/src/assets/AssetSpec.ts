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

import { parseRegexpTemplateString as regex } from '../helpers/RegExp'

/**
 * Numeric identifiers are non-negative integers, and CANNOT have leading zeroes.
 * @see https://semver.org/#spec-item-2
 */
export const NUMERIC_IDENTIFIER = regex `
  0             # either a 0
  |             # or
  [1-9]\\d*     # any number starting with a non-0 digit
`

/**
 * A pre-release version MAY be denoted by appending a hyphen and a series of dot separated
 * identifiers immediately following the patch version.
 * @see https://semver.org/#spec-item-9
 */
export const PRERELEASE = regex `
  \\-                           # hyphen

  (?<prerelease>
    [a-zA-Z\\d-]+                 # alphanumerical chars

    (?:                           # optional:
      \\.                         # <dot>
      [a-zA-Z\\d-]+               # alphanumerical chars
    )*

  )
`

/**
 * Build metadata MAY be denoted by appending a plus sign and a series of dot separated
 * identifiers immediately following the patch or pre-release version.
 * @see https://semver.org/#spec-item-10
 */
export const BUILD = regex `
  \\+                           # plus sign

  (?<build>
    [a-zA-Z\\d]+                  # alphanumerical chars

    (?:                           # optional:
      \\.                         # <dot>
      [a-zA-Z\\d]+                # alphanumerical chars
    )*

  )
`

/**
 * Version core (X.Y.Z) with X being required, Y and Z being optional
 * @see https://semver.org/#spec-item-2
 */
export const VERSION_CORE_OPTIONAL = regex `
  (?<major>${NUMERIC_IDENTIFIER})   # X

  (?:                                 # optional:
    \\.                               # <dot>
    (?<minor>${NUMERIC_IDENTIFIER})   # Y

    (?:                                 # optional:
      \\.                               # <dot>
      (?<patch>${NUMERIC_IDENTIFIER})   # Z
    )?

  )?
`

/**
 * Version core (X.Y.Z) with all parts required
 * @see https://semver.org/#spec-item-2
 */
export const VERSION_CORE_REQUIRED = regex `
  (?<major>${NUMERIC_IDENTIFIER})   # X

  \\.                               # <dot>
  (?<minor>${NUMERIC_IDENTIFIER})   # Y

  \\.                               # <dot>
  (?<patch>${NUMERIC_IDENTIFIER})   # Z
`

/**
 * Part of a name
 */
export const NAME_PART = regex `
  # leads with a letter
  [a-zA-Z]

  # continues with letters, digits, hyphens, underscores
  [-_a-zA-Z\\d]*
`

/**
 * Fully qualified name, in its entire form.
 * A name can have either a namespace, a scope, or none of them.
 *
 * NOTE: This is what the namespace capture should have been. But with this implementation,
 * backtracking is a big issue with catastrophic results:
 *  (?:
 *    (?:
 *      (?<namespace>${NAME_PART})  # capture a namespace ("mynamespace")
 *    /
 *    )+
 *  )?                              # < make it optional
 */
export const FULLY_QUALIFIED_NAME = regex `
  (?<name>                          # capture the whole name ("@myscope/project" or "mynamespace/project" or "project")

    # optional: namespace
    # NOTE: This is a simplified implementation, with a lot less steps for the regexp engine to work with.
    (?:
      (?<namespace>[^@]+)           # capture a namespace ("mynamespace") of even sub-folders ("my/sub/folder")
      /
    )?                              # < make it optional

    # optional: scope
    (?:
      (?<scope>@${NAME_PART})       # capture a scope ("@myscope")
      /
    )?                              # < make it optional

    # required:
    (?<subname>${NAME_PART})        # capture the subname ("project")
  )
`

export const VERSION = (coreRequired = true): string => regex `
  ${coreRequired ? VERSION_CORE_REQUIRED : VERSION_CORE_OPTIONAL}
  (?:
    ${PRERELEASE}           # optional: pre-release
  )?
  (?:
    ${BUILD}                # optional: build
  )?
`

/**
 * An URI version can either be in the X.Y.Z semver format, or "latest".
 */
export const URI_VERSIONS = regex `
  (?<version>
    ${VERSION(false)}
    |                         # or
    latest                    # latest
  )
`

/**
 * A path must start with a "/"
 */
export const PATH = regex `
  (?<path>
    /.+                       # a path must start with a "/"
  )
`

export const URI_VERSION = new RegExp(URI_VERSIONS)

export const URI = new RegExp(`^/${FULLY_QUALIFIED_NAME}(?:@${URI_VERSIONS})?${PATH}?$`)

// a folder name is standardized: "my-asset@3.19.2"
export const NAME_AND_VERSION = new RegExp(`^${FULLY_QUALIFIED_NAME}@${URI_VERSIONS}$`)

export const STORAGE_VERSION = `^${FULLY_QUALIFIED_NAME}@(?<version>${VERSION(true)})$`

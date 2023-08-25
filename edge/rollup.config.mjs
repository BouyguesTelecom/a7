// @ts-check
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

// List of njs built-in modules.
//
// - xml has added in njs 0.7.11
// - zlib was added in njs 0.7.12
const njsExternals = ['crypto', 'fs', 'querystring', 'xml', 'zlib']

/**
 * Plugin to fix syntax of the default export to be compatible with njs.
 * (https://github.com/rollup/rollup/pull/4182#issuecomment-1002241017)
 *
 * If you use njs >=0.7.12, you can remove this.
 *
 * @return {import('rollup').OutputPlugin}
 */
const fixExportDefault = () => ({
  name: 'fix-export-default',
  renderChunk: (code) => ({
    code: code.replace(/\bexport { (\S+) as default };/, 'export default $1;'),
    map: null,
  }),
})

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: 'src/main.ts',
  external: njsExternals,
  plugins: [
    // Transpile TypeScript sources to JS.
    babel({
      babelHelpers: 'bundled',
      envName: 'njs',
      extensions: ['.ts', '.mjs', '.js'],
    }),
    // Resolve node modules.
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    // Convert CommonJS modules to ES6 modules.
    // workaround for https://github.com/rollup/plugins/issues/1329
    commonjs(),
    json(),
    // Fix syntax of the default export.
    fixExportDefault(),
    typescript(),
  ],
  output: {
    file: '../etc/nginx/edge/a7.js',
    format: 'es',
  },
}
export default options

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

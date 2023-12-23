// vite.config.js
import { defineConfig } from 'vite'
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

export default defineConfig({
  build: {
    /** @type {import('rollup').RollupOptions} */
    rollupOptions: {
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
        dir: '../etc/nginx/edge',
        entryFileNames: 'a7.js',
        format: 'es',
      },
    },
  },
})

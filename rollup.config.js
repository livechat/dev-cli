import fs from 'fs'
import { defineConfig } from 'rollup'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

function executable() {
  return {
    name: 'executable',
    writeBundle: ({ file }) => {
      fs.chmodSync(file, '755')
    },
  }
}

export default defineConfig({
  input: pkg.main,
  external: Object.keys(pkg.dependencies),
  output: {
    format: 'esm',
    file: pkg.bin.dps,
    banner: '#!/usr/bin/env node',
  },
  plugins: [resolve(), babel({ babelHelpers: 'bundled' }), executable()],
})

import 'dotenv/config'
import fs from 'fs'
import { defineConfig } from 'rollup'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
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
    file: pkg.bin.lcdev,
    banner: '#!/usr/bin/env node',
  },
  plugins: [
    resolve(),
    replace({
      preventAssignment: true,
      'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
      'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
    }),
    babel({ babelHelpers: 'bundled' }),
    executable(),
  ],
})

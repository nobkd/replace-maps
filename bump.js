import { readFileSync, writeFileSync } from 'node:fs'
import { version } from './package.json'

const fpath = 'public/manifest.json'
let manifest = JSON.parse(readFileSync(fpath, 'utf-8'))
manifest.version = version
writeFileSync(fpath, JSON.stringify(manifest, null, 2))

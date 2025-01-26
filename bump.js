import { writeFileSync } from 'node:fs'
import { version } from './package.json' with { type: 'json' }
import manifest from './public/manifest.json' with { type: 'json' }

manifest.version = version
writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 2))

import { writeFileSync } from 'node:fs'
import { version } from './package.json' with { type: 'json' }
import manifest from './src/manifest.json' with { type: 'json' }

manifest.version = version
writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2))

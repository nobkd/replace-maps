import Svg2 from "oslllo-svg2"
import { join } from 'path'
import { mkdirSync } from "fs"

const indir = 'icons'
const outdir = 'public/icons'
const svgs = ['icon-grey.svg', 'icon.svg']
const sizes = [48, 96]

mkdirSync(outdir, { recursive: true })

for (let svgfile of svgs) {
    const instance = Svg2(join(indir, svgfile))
    const svg = instance.svg

    const pngfile = svgfile.replace(/\.svg$/,'.png')
    for (const size of sizes) {
        svg.resize({ width: size, height: size })
        await instance.png().background('#0000').toFile(join(outdir, `${size}-${pngfile}`))
    }
}

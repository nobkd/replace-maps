#!/bin/sh

# clean & create dir
rm -rf '.dist'
mkdir -p '.dist'

# copy static resources
cp -r 'public/.' '.dist'
cp 'node_modules/leaflet/dist/images/marker-icon-2x.png' 'node_modules/leaflet/dist/images/marker-shadow.png' '.dist'

# check if dev / prod, then build
if [[ $1 == 'dev' ]]; then
  echo '--watch'
else
  echo '--minify'
fi | xargs bun build --experimental-css --experimental-html --outdir '.dist' 'src/bg.html' 'src/map.html' 'src/options.html'

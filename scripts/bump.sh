sed -i -e "s/\"versio
n\": *\"[^\"]*\"/\"version\": $(npm pk
g get version)/gi" ../public/manifest.json

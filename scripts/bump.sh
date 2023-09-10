sed -i -e "s/\"version\": *\"[^\"]*\"/\"version\": $(npm pkg get version)/gi" public/manifest.json

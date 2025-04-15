# README for AMO

## Prequisites

- [Bun](https://bun.sh/)

## Installation

```shell
bun install --frozen-lockfile
```

This uses the `package-lock.json` file for installation to avoid package changes and have reproducible builds.

## Building

```shell
bun run build && bun run bundle
```

This minifies the JavaScript, copies static resources and bundles the output to `.dist/replace_maps.zip`.

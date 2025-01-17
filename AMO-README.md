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

This transpiles and minifies the TypeScript, copies static resources and bundles the output to `.out/replace_maps.zip`.

# README for AMO

## Prequisites

- Bun

## Installation

```shell
bun install --frozen-lockfile
```

This uses the `bun.lockb` file for installation to avoid package changes and have reproducible builds.

## Building

```shell
bun run build && bun run bundle
```

This minifies JavaScript, copies static resources and bundles the output to `out/replace_maps.zip`.

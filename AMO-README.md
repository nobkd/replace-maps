# README for AMO

## Prequisites

- Node (18)
- npm

## Installation

```shell
npm ci
```

This uses the `package-lock.json` file for installation to avoid package changes and have reproducible builds.

## Building

```shell
npm run build && npm run bundle
```

This transpiles and minifies the TypeScript, copies static resources and bundles the output to the `out` directory of the project.

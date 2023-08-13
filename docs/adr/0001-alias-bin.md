# 1. alias-bin

Date: 2023-08-13

## Status

2023-08-13 approved

## Context

When using the `bin` field of a package.json inn Node.js, it seems impossible to determine the command that was run. We always obtain the path of the scripts in `process.argv`.

https://github.com/oclif/oclif/issues/1168

## Decision

The workaround will be to duplicate `bin/run` and `bin/run.cmd` and create `bin/run-alias` and `bin/run-alias.cmd`.

## Consequences

There will be a duplication in bin folder which imply a double update could be needed.

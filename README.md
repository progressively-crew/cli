# @progressively/cli

Progressively is a simple, lightweight and OpenSource feature flag software.

This repository contains the CLI

- [x] Administrator account creation
- [x] Authentication
- [x] Project creation/deletion
- [x] Flag manipulation
- [ ] Types generation

## Summary

<!-- toc -->
* [@progressively/cli](#progressivelycli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @progressively/cli
$ progressively COMMAND
running command...
$ progressively (--version)
@progressively/cli/0.0.0 darwin-x64 node-v18.15.0
$ progressively --help [COMMAND]
USAGE
  $ progressively COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`progressively config`](#progressively-config)
* [`progressively flag`](#progressively-flag)
* [`progressively help [COMMANDS]`](#progressively-help-commands)
* [`progressively login`](#progressively-login)
* [`progressively me`](#progressively-me)
* [`progressively project`](#progressively-project)
* [`progressively register`](#progressively-register)
* [`progressively types`](#progressively-types)

## `progressively config`

Configure the Progressively CLI

```
USAGE
  $ progressively config

DESCRIPTION
  Configure the Progressively CLI

EXAMPLES
  $ progressively config
```

_See code: [dist/commands/config.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/config.ts)_

## `progressively flag`

Manipulate flags

```
USAGE
  $ progressively flag [-C] [--create-only]

FLAGS
  -C, --create   Create a flag and update existing
  --create-only  Only create a flag

DESCRIPTION
  Manipulate flags

EXAMPLES
  $ progressively flag
```

_See code: [dist/commands/flag.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/flag.ts)_

## `progressively help [COMMANDS]`

Display help for progressively.

```
USAGE
  $ progressively help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for progressively.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.11/src/commands/help.ts)_

## `progressively login`

Authenticate to store tokens in config

```
USAGE
  $ progressively login

DESCRIPTION
  Authenticate to store tokens in config

EXAMPLES
  $ progressively login
```

_See code: [dist/commands/login.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/login.ts)_

## `progressively me`

describe the command here

```
USAGE
  $ progressively me

DESCRIPTION
  describe the command here

EXAMPLES
  $ progressively me
```

_See code: [dist/commands/me.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/me.ts)_

## `progressively project`

describe the command here

```
USAGE
  $ progressively project [-D] [-C]

FLAGS
  -C, --create  Create a project before selection
  -D, --delete  Delete a project

DESCRIPTION
  describe the command here

EXAMPLES
  $ progressively project
```

_See code: [dist/commands/project.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/project.ts)_

## `progressively register`

Register an admin user

```
USAGE
  $ progressively register

DESCRIPTION
  Register an admin user

EXAMPLES
  $ progressively register
```

_See code: [dist/commands/register.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/register.ts)_

## `progressively types`

describe the command here

```
USAGE
  $ progressively types

DESCRIPTION
  describe the command here

EXAMPLES
  $ progressively types
```

_See code: [dist/commands/types.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/types.ts)_
<!-- commandsstop -->

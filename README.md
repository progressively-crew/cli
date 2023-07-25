# @progressively/cli

Progressively is a simple, lightweight and OpenSource feature flag software.

This repository contains the CLI

- [x] Administrator account creation
- [x] Authentication
- [x] Project creation/deletion
- [ ] Flag manipulation
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
* [`progressively flag [FILE]`](#progressively-flag-file)
* [`progressively hello`](#progressively-hello)
* [`progressively hello world`](#progressively-hello-world)
* [`progressively help [COMMANDS]`](#progressively-help-commands)
* [`progressively login [FILE]`](#progressively-login-file)
* [`progressively project`](#progressively-project)
* [`progressively register [FILE]`](#progressively-register-file)

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

## `progressively flag [FILE]`

describe the command here

```
USAGE
  $ progressively flag [FILE] [-n <value>] [-f]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ progressively flag
```

_See code: [dist/commands/flag.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/flag.ts)_

## `progressively hello`

Say hello

```
USAGE
  $ progressively hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `progressively hello world`

Say hello world

```
USAGE
  $ progressively hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ progressively hello world
  hello world! (./src/commands/hello/world.ts)
```

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

## `progressively login [FILE]`

describe the command here

```
USAGE
  $ progressively login [FILE] [-n <value>] [-f]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ progressively login
```

_See code: [dist/commands/login.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/login.ts)_

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

## `progressively register [FILE]`

describe the command here

```
USAGE
  $ progressively register [FILE] [-n <value>] [-f]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ progressively register
```

_See code: [dist/commands/register.ts](https://github.com/jean-smaug/cli/blob/v0.0.0/dist/commands/register.ts)_
<!-- commandsstop -->

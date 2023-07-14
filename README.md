oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
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
* [`progressively hello PERSON`](#progressively-hello-person)
* [`progressively hello world`](#progressively-hello-world)
* [`progressively help [COMMANDS]`](#progressively-help-commands)
* [`progressively plugins`](#progressively-plugins)
* [`progressively plugins:install PLUGIN...`](#progressively-pluginsinstall-plugin)
* [`progressively plugins:inspect PLUGIN...`](#progressively-pluginsinspect-plugin)
* [`progressively plugins:install PLUGIN...`](#progressively-pluginsinstall-plugin-1)
* [`progressively plugins:link PLUGIN`](#progressively-pluginslink-plugin)
* [`progressively plugins:uninstall PLUGIN...`](#progressively-pluginsuninstall-plugin)
* [`progressively plugins:uninstall PLUGIN...`](#progressively-pluginsuninstall-plugin-1)
* [`progressively plugins:uninstall PLUGIN...`](#progressively-pluginsuninstall-plugin-2)
* [`progressively plugins update`](#progressively-plugins-update)

## `progressively hello PERSON`

Say hello

```
USAGE
  $ progressively hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

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

## `progressively plugins`

List installed plugins.

```
USAGE
  $ progressively plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ progressively plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `progressively plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ progressively plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ progressively plugins add

EXAMPLES
  $ progressively plugins:install myplugin 

  $ progressively plugins:install https://github.com/someuser/someplugin

  $ progressively plugins:install someuser/someplugin
```

## `progressively plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ progressively plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ progressively plugins:inspect myplugin
```

## `progressively plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ progressively plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ progressively plugins add

EXAMPLES
  $ progressively plugins:install myplugin 

  $ progressively plugins:install https://github.com/someuser/someplugin

  $ progressively plugins:install someuser/someplugin
```

## `progressively plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ progressively plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ progressively plugins:link myplugin
```

## `progressively plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ progressively plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ progressively plugins unlink
  $ progressively plugins remove
```

## `progressively plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ progressively plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ progressively plugins unlink
  $ progressively plugins remove
```

## `progressively plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ progressively plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ progressively plugins unlink
  $ progressively plugins remove
```

## `progressively plugins update`

Update installed plugins.

```
USAGE
  $ progressively plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->

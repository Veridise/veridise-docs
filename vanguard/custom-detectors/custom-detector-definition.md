---
title: Custom Detector Definition
sidebar_position: 1
---

## Overview

A _custom detector definition_ is a configuration file that defines what a
custom detector is.
An example of a custom detector definition is shown below.

Each custom detector definition is a script written in the
[Lua](https://lua.org) programming language, but you do not need to know
anything about Lua to write one.
In this script, you can use the `Detector.register` function to define a custom
detector.
Most custom detector definitions will look like the example, broken
up into a _metadata_ section and a _patterns_ section.
The former describes the detector, and the latter defines what the _search
patterns_ that the custom detector uses to detect findings.

```lua
Detector.register {
  -- metadata section
  name = "Unsafe ERC20 transfer/approve",
  id = "erc20-unsafe-transfer-approve",
  language = "solidity",
  description = [[
    This custom detector finds all ERC20 transfer/approves that do not use
    SafeERC20.
  ]],

  -- pattern section
  pattern = [[

FIND
  ExternalCall call IN Contract c,
  Function target IN call.callees
WHERE
  c.name != "SafeErc20",
  target.name == "transfer" || target.name == "approve"

  ]],
  title = "Unsafe raw ERC20 transfer/approve found in $c",
  message = [[
    Contract $c has a potentially unsafe ERC20 token call to $target at $call.
  ]],
}
```

## Lua API Reference

The Lua API for custom detector definitions is organized into the following functionality:
* Detector registration with `Detector.register`
* Lower-level custom detector customization using `QueryDef` and `Pattern`

### `Detector.register`

This function is called to register a new Vanguard custom detector, returning a
`QueryDef` object representing the custom detector.
Most custom detectors definitions will consist of a single call to
`Detector.register`.

It takes a single table as an argument, where the table has the following keys:

* `name` (string): the name of the custom detector, displayed in the Findings
  table on AuditHub and in AuditHub library listings.
* `id` (string): a human-friendly name that uniquely identifies your custom
  detector.
  You can set this to whatever you want.
  AuditHub uses the custom detector ID to deduplicate similar findings.
* `description` (string): describes what your custom detector does, such as what
  bugs it can find, and situations that it should be used for.
* `language` (string): indicates what programming language the custom detector
  is meant to operate on.
  Currently, the only language supported by Vanguard is `solidity`.
* `pattern` (string): a string containing the source code of the
  [PAQL][paql] query for this custom detector.
  This will be used as the search pattern for this query.
* `message` (string, optional): a template for the description of the finding
  reported for each result found by the `pattern`.
  Variables that are declared in the `FIND` (or `AS` section, if it exists) of
  the `pattern` will be substituted into the `message` by replacing all strings
  matching the format `$variableName`.
* `title` (string, optional): a template for the title of the finding reported
  for each result found by the `pattern`.
  Variables are also substituted into the `title`.

Multiple detectors can be defined in the same custom detector definition file,
but it is typically not recommended to do so, as they cannot be run separately
when the custom detector definition is chosen for a Vanguard task.

### `QueryDef`

A `QueryDef` represents a custom detector that has been registered.

Every `QueryDef` is required to have at least one search pattern. The search
pattern can be added either by specifying a `pattern` field in
`Detector.register`, or by explicitly calling the `QueryDef:add_pattern` method.

#### `QueryDef:add_pattern`

Attaches a new search pattern to the custom detector.

It takes a single string argument containing the [PAQL][paql] source code
for the pattern, and returns a `Pattern` object.

Example:

```lua
local d = Detector.register {
  -- ... parameters go here ...
}
local p = d:add_pattern([[

FIND Contract c

]])
```

### `Pattern`

A `Pattern` represents a parsed search pattern attached to a custom detector.

#### `Pattern:report`

Sets metadata for a search pattern, such as finding title, message, etc.

It takes a single table argument with the following keys:

* `title` (string, optional): a template for the title of the finding reported
  for each result found by the pattern.
* `message` (string): a template for the description of the finding reported
  for each result found by the pattern. This can be a multiline string.

Example:

```lua
local p = d:add_pattern([[

FIND Contract c

]])
p:report {
  title = "Found contract $c",
  message = [[
    The custom detector found the contract $c in the project.
  ]],
}
```

:::tip
You can chain together method calls to avoid defining local variables for
patterns.

```lua
d:add_pattern([[

FIND Contract c

]]):report {
  title = "Found contract $c",
  message = [[
    The custom detector found the contract $c in the project.
  ]],
}
```
:::

[paql]: ./paql.md

---
title: Custom Detectors
sidebar_position: 4
---

import { CustomDetectorGenerator } from '@site/src/components/vanguard/CustomDetectorGenerator.jsx';

Vanguard supports _custom detectors_ that can be used to identify project- or
library-specific vulnerability patterns using a concise query language.
Custom detectors utilize Vanguard's advanced static analysis engine and are
treated similarly to the built-in Vanguard detectors by AuditHub.

AuditHub includes a "standard library" of custom detectors which can be used to
catch simple vulnerabilities involving popular smart contract types, such as
ERC20 tokens and ERC4626 vaults.
You can also create your own custom detector if you have specific security
concerns about your project.

## Using the Custom Detectors Library

To use custom detectors, select them from the Task Wizard when launching a
Vanguard task.
You can select custom detectors from a combination of three different sources:

1. **Standard Library**: these are the custom detectors available by default on
   AuditHub for all projects, covering different categories of common
   vulnerabilities and library-specific vulnerabilities.
2. **Organization Level**: if you have created your own custom detector
   definitions within your AuditHub organization, you can select them using this
   option.
3. **Project Files**: if you have created your own custom detector definitions in
   your own project files, you can select them using this option.

After the Vanguard task completes, the custom detector results will
automatically appear in the Tool Findings table, if any are found.

## Creating Your Own Custom Detector

You can create your own custom detector on AuditHub as an Organization Level
custom detector, or directly as a file in the project files.
For both of these types, you will need to define the custom detector
configuration that describes what your custom detector does and what patterns to
search for.

### Custom Detector Definition

A _custom detector definition_ is a configuration file that defines what a
custom detector is.
An example of a custom detector definition is shown below:

```lua
Detector.register {
  name = "Unsafe ERC20 transfer/approve",
  id = "erc20-unsafe-transfer-approve",
  language = "solidity",
  description = [[
    This custom detector finds all ERC20 transfer/approves that do not use
    SafeERC20.
  ]],

  pattern = [[

FIND
  ExternalCall call IN Contract c,
  Function target IN call.callees
WHERE
  c.name != "SafeErc20",
  target.name == "transfer" || target.name == "approve"

  ]],
  title = "Unsafe raw ERC20 transfer/approve found in $c",
  message = "Contract $c has a potentially unsafe ERC20 token call to $target at $call.",
}
```

Each custom detector definition is a script written in the
[Lua](https://lua.org) programming language, but you do not need to know
anything about Lua to write one.
Most custom detector definitions will look like the example shown above, broken
up into a _metadata_ section and a _patterns_ section.

For the metadata section, you must specify the following information:

* The `name` of the detector is how it will appear when shown in the Tool
  Findings table in your project.
* The `id` of the detector is a human-friendly name that uniquely identifies
  your custom detector.
  You can set this to whatever you want.
  AuditHub uses the custom detector ID to deduplicate similar findings.
* The `description` is used to describe what your custom detector does, such as
  what bugs it can find, and situations that it should be used for.
* The `language` corresponding to what programming language the custom detector
  is meant to operate on.
  Currently, the only supported language is `solidity`.

For the patterns section, you must fill out the `pattern` field, which should
contain a _search pattern_ written in the [Program Analysis Query
Language](./paql.md) that specifies what your custom detector should search for.
Optionally, you can also specify a `message` and a `title`. The `message` is a
template for how each result of the custom detector should be reported within a
finding, and `title` is a template for how that finding should be titled.
Both `message` and `title` allow substituting variables declared in the `FIND`
(or `AS` section, if it exists) using the format `$variableName`.

### Online Form for Custom Detector Definitions

For most custom detectors, it's easier to fill out a visual form instead of
writing a custom detector definition manually. You can use the below form to do
so.

<hr />
<CustomDetectorGenerator />
<hr />

:::note
   This form does not check the syntax of queries or validate the custom
   detector definition.

   In the future, we plan on integrating a more user-friendly version of this
   form directly into AuditHub.
:::

### Creating an Organization Level Custom Detector

1. In your project's code viewer, open the `Organization Settings` window by
   clicking the gear icon at the bottom left toolbar.
2. Navigate to the `Tool Configuration` tab and select `Custom Detectors`.
3. Click the `Add Detector` button.
4. Fill in the `Content`s with a [custom detector definition][querydef]
   as described above.
5. If you need to edit your custom detector, you can edit it from the list by
   clicking its pencil icon.

### Creating a Project Files Custom Detector

You can save any [custom detector definition][querydef] as files with a
`.luau` extension in your project's source code.
After you upload your source code as a Version on AuditHub, these `.luau` files
can be selected when running a task on that Version.

[querydef]: #custom-detector-definition

---
title: Custom Detectors
sidebar_position: 4
---

Vanguard supports _custom detectors_ that can be used to identify project- or
library-specific vulnerability patterns using a concise query language.
Custom detectors utilize Vanguard's advanced static analysis engine and are
treated similarly to the built-in Vanguard detectors by AuditHub.

AuditHub includes a ["standard library"](../standard-library/index.md) of custom detectors which can be used to
catch simple vulnerabilities involving popular smart contract types, such as
ERC20 tokens and ERC4626 vaults.
You can also create your own custom detector if you have specific security
concerns about your project.

* **Want to use the detectors in the standard library?** See below.
* **Want to learn how to write your own?**
  Learn [the PAQL language](./paql.md).
* **Not sure how to do something in PAQL?**
  Check out our [how-to guides](./howto.md).
* **Need to look up something?**
  Consult the [Solidity dialect reference](./solidity-dialect.md).

## Using Custom Detectors with Vanguard

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
For both of these types, you will need to define the _custom detector
definition_ that describes what your custom detector does and what patterns to
search for.

:::note
We are currently working on a feature to allow custom detector definitions to be
defined through the AuditHub web application.
In the meantime, you must manually create a
[custom detector definition file][querydef].
:::

### Creating an Organization Level Custom Detector

1. In your project's code viewer, open the `Organization Settings` window by
   clicking the gear icon at the bottom left toolbar.
2. Navigate to the `Tool Configuration` tab and select `Custom Detectors`.
3. Click the `Add Detector` button.
4. Fill in the `Content`s with a [custom detector definition][querydef].
5. If you need to edit your custom detector, you can edit it from the list by
   clicking its pencil icon.

### Creating a Project Files Custom Detector

You can save any [custom detector definition][querydef] as a file with a
`.luau` extension in your project's source code.
After you upload your source code as a Version on AuditHub, these `.luau` files
can be selected when running a task on that Version.

[querydef]: ./custom-detector-definition.md

---
title: Running Vanguard
sidebar_position: 2
---

Vanguard must be run through AuditHub.
If you are not familiar with our platform, you may want to read the [AuditHub guide
first][audithub-guide].

## Step 1: Project Setup

If you have not set up your project before, you will need to do so by following
the steps in the [AuditHub guide][audithub-guide].
You'll only need to do this one time.

You should ensure the following parameters are set:

| Step             | Parameter           | Instructions                                                                                                                                          |
|------------------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Project Root     | Project root        | Set to the folder containing the "root" of your project. Typically, this is the folder with `package.json`, `foundry.toml`, `hardhat.config.ts`, etc. |
| Source Location  | Submodules          | Check the box "Repository includes submodules" if the project uses Foundry (if you forgot to check this, you need to upload a new version archive).   |
| Project Contents | Solidity contracts  | Enable it.                                                                                                                                            |
| Dependencies     | Uses NPM-style deps | If a `package.json` is present, enable this setting and choose the appropriate package manager.                                                       |
| Build            | Uses build system   | Enable if you are using Hardhat (either one) or Foundry. See below section.                                                                           |

The other parameters are not used by Vanguard and can be set to anything.

### Build System Setup

If your project uses Hardhat or Foundry, you should enable the `Uses build
system` setting on the `Build` page.
This will ensure that your project is compiled using its configured build
system.
In some cases, your project will not compile with the build system; you can
either adjust your build system configuration or switch to manual Solidity
compiler settings, as described below.

:::note
   Projects that use multiple versions of the Solidity compiler in the same
   project are supported, but only experimentally.
   Vanguard may report duplicate results or exhibit other strange behavior on
   such projects.
:::


### Manual Solidity Compiler Build

If your project does not use Foundry or Hardhat, or you choose to enable the
`Ignore build system` setting in the Task Creation workflow, then your project
will be compiled using a direct invocation to the Solidity compiler.
This is only supported if you set the corresponding Solidity compiler settings
in the Project Settings:

| Step          | Parameter    | Instructions                                                                                                                                                                                       |
|---------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Project Paths | Source path  | Set to the base directory containing the smart contracts. For Hardhat projects, this will typically be the `contracts` folder of your code; for Foundry, it will be the project root.              |
| Project Paths | Include path | Leave blank unless the project uses dependencies not managed by Hardhat/Foundry. Hardhat dependencies are configured on the "Dependencies" step. Foundry dependencies are based on git submodules. |


## Step 2: Task Creation

Once your project is set up, you can use the "New Task" page in your project to
launch Vanguard.

1. Select your version archive, and then choose "DeFi Vanguard".
2. On the configuration page, you'll need to select the
   [detector(s)](./detectors/index.md) you want to run.
   You can optionally set the `Input Limits` setting if you only want to run
   Vanguard on a subset of the files in your project.
3. Review the settings.
   Note that the include path will automatically include `node_modules` if you
   have enabled `Uses NPM-style deps` in the project setup.
   If you are using a Foundry project, the remappings will be applied automatically.

## Step 3: View and Manage Findings

When the task is complete, the number of findings (categorized by severity
levels) will be reported under the "Findings" panel.
Click on one of the severities to go to the code view, where you can see the
details of each finding.

In the code viewer:

* A table of all findings reported by Vanguard will be shown at the bottom left.
* Clicking on a finding will show the detailed description of the finding.
* You can apply an "action" to remove irrelevant parts of findings or mark them
  as true or false positives.

For more information, see the page on the [issue triage interface][triage].

## Frequently Asked Questions

#### What should I do if the task fails at the "Compile" step with an "OOMKilled" error?

AuditHub limits the amount of RAM used for compilation; however, it is set
sufficiently high enough to allow large projects to compile.
If you are using Solidity 0.8.27 or older, you are highly recommended to upgrade
your project to use only 0.8.28 or newer, as [recent versions of
Solidity use RAM much more efficiently][solc-0828-announcement].

[audithub-guide]: ../saas
[triage]: ./triage.md

[solc-0828-announcement]: https://soliditylang.org/blog/2024/10/09/solidity-0.8.28-release-announcement

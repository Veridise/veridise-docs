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

| Step             | Parameter           | Instructions                                                                                                                                                                                                                          |
|------------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Project Root     | Project root        | Set to the folder containing the "root" of your project. Typically, this is the folder with `package.json`, `foundry.toml`, `hardhat.config.ts`, etc.                                                                                 |
| Project Paths    | Source path         | Set to the base directory containing the smart contracts. For Hardhat projects, this will typically be the `contracts` folder of your code; for Foundry, it will be the project root.                                                 |
| Project Paths    | Include path        | Leave blank unless the project uses dependencies not managed by Hardhat/Foundry. Hardhat dependencies are configured on the "Dependencies" step (see below). For Foundry, the git submodules will be fetched before running Vanguard. |
| Project Contents | Solidity contracts  | Enable it.                                                                                                                                                                                                                            |
| Dependencies     | Uses NPM-style deps | If a `package.json` is present, enable this setting and choose the appropriate package manager.                                                                                                                                       |

The other parameters are not used by Vanguard and can be set to anything.

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

[audithub-guide]: ../saas
[triage]: ./triage.md

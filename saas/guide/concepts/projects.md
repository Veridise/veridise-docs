---
title: Projects
sidebar_position: 2
---

In AuditHub, a `project` is the unit of work. It typically represents a real-world DeFi or ZK codebase you want to analyze (for example, a protocol implementation, a set of smart contracts, or circuits). A project combines a codebase (tracked as one or more immutable [versions](/saas/guide/concepts/versions)) with the configuration AuditHub needs to run [tools](/saas/guide/concepts/tools) and create [tasks](/saas/guide/concepts/tasks) against that code.

Projects live inside [organizations](/saas/guide/concepts/organizations). A single project can have many versions over time, but its project-level configuration remains stable across versions unless you explicitly edit it.

## Why projects matter

A project:
- Defines what code AuditHub should analyze and how to retrieve it.
- Establishes the "working directory" and paths needed to build and analyze the code reliably.
- Determines which tools are applicable (based on the project’s contents).
- Provides consistent configuration across all versions, which helps keep task results comparable.
- Acts as the container for the work performed on a codebase (i.e., versions, tasks, findings, issues, and threads).

## What a project represents

Conceptually, a project represents:
- A repository or archive that contains your source code.
- A set of paths inside that codebase (e.g., root, source paths, include paths, etc.).
- Dependency and build settings that tasks and tools may use to prepare the code for analysis.
- An "audit workspace" boundary: a project hosts its versions, tasks, findings, issues, and threads.

AuditHub is designed around common ecosystems and build tooling (for example, `npm`-based workflows and `Foundry`/`Hardhat`-style projects). Project configuration captures the information tools need to operate reliably within those structures.

AuditHub requires an `initial` version when you create a project. This allows the UI to validate and assist with path selection (e.g., ensuring `src_path` is under `project_root`).

## Project model

The project model is defined by what AuditHub currently uses. Key attributes include:

### Identity

- `name`: The project name (unique within your organization).

### Source input

- `input_info`: How AuditHub loads the initial source code for the project. Choose one of:
  - **Git input**
    - `input_type`: `git`
    - `url`: GitHub repository URL
    - `includes_submodules` (default: off): If enabled, include git submodules
    - `revision` (optional): GitHub revision to check out (e.g., a commit hash, branch, or tag)
  - **Archive input**
    - `input_type`: `archive`
    - `url` (optional): URL to download a `.zip` archive from (if omitted, the archive is uploaded manually)

### Directory layout (inside a version)

All paths are *relative paths inside the uploaded/fetched version*:

- `project_root`: Working directory where project scripts run (e.g., `npm ci`, `npx hardhat compile`).
- `src_path`: Where AuditHub finds source files to process (must be under `project_root`).
- `include_path` (optional): Where AuditHub finds include files / dependencies to resolve (if set, must be under `project_root`).
- `specs_path` (optional): Where AuditHub finds embedded [[V] specs](/orca/user_guide/v/language_description), if present.
- `hints_path` (optional): Where AuditHub finds embedded [OrCa hints](/orca/user_guide/hints/hint_language_description), if present.

### Contents

- `contents` (default: empty): Declares what the project contains, to determine what tools can run.
  - Current values include: `solidity`, `circom`, `picus`, `llzk`.
  - You can select multiple content types for a single project, depending on what source files are present (e.g., a project that contains both Solidity contracts and Circom circuits).

### Dependencies and build

Some tasks may need dependencies installed and/or builds performed before analysis. Project configuration captures what AuditHub should do during task preparation and what the selected tools should do during their initial execution steps (e.g., which environment variables to set and which build system to use):

- `env_vars` (optional): Environment variables set while executing project scripts.
  - Each entry includes a variable `name` and `value`.

- `dependencies` (optional): Dependency setup options.
  - `npm` (optional):
    - `tool`: Which package manager to use (`npm`, `yarn`, or `pnpm`)
    - `lockfile`: Whether the project has a lockfile, so installs can be deterministic
    - `node_version` (default: `lts`): `Node.js` version used when installing `npm` dependencies
  - `foundry` (default: off): Whether `Foundry` dependencies should be installed

- `build_system` (optional): Which build system the selected tools should use during task preparation (`hardhat`, `hardhat-ignition`, or `foundry`).
- `deployment_script_path` (optional): Deployment script path used by tools that need a deployment entrypoint, and it must be under `project_root`.

At a high level:
- For `npm`-based dependencies, AuditHub uses the selected package manager and prefers lockfile-based, deterministic installs when a lockfile is present.
- For Foundry-based dependencies, AuditHub can run `forge install` during task preparation when enabled.

:::warning Tool-specific configuration
Make sure that the project configuration matches the tools you plan to run. Some tools require specific options to be set (e.g., [OrCa](/orca) requires dependency settings, a build system, and a deployment script path). If a task cannot be executed because required configuration is missing, AuditHub will raise a warning and prevent the task from running until the configuration is fixed.
:::

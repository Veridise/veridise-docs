---
title: Projects
sidebar_position: 2
---

In AuditHub, a `project` is the unit of work. It typically represents a real-world DeFi or ZK codebase you want to analyze (e.g., a protocol implementation, a set of smart contracts, or circuits). A project combines a codebase (tracked as one or more immutable [versions](/saas/guide/concepts/versions)) with the configuration AuditHub needs to run [tools](/saas/guide/concepts/tools) and create [tasks](/saas/guide/concepts/tasks) against that code.

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

AuditHub is designed around common ecosystems and build tooling (e.g., Node.js package manager workflows like `npm`, `yarn`, and `pnpm`, and `Foundry`/`Hardhat`-style projects). Project configuration captures the information tools need to operate reliably within those structures.

AuditHub requires an `initial` version when you create a project. This allows the UI to validate and assist with path selection (e.g., ensuring the **Source path** is under the **Project Root**).

:::warning Deleting a project is destructive
Deleting a project permanently removes the project and everything stored within it, including its versions, tasks, findings, issues, and threads.
:::

## Project model

The project model is defined by what AuditHub currently uses. Key attributes include:

### Identity

- **Project name**: The project name (unique within your organization).

### Source Location

This section tells AuditHub how to access the `initial` project sources.

- **Access method**: Choose one of **File**, **Git repository**, or **URL**.
- If you choose **Git repository**:
  - **Git repository URL**: The repository to fetch.
  - **Revision** (optional): Branch, tag, or commit hash to fetch.
  - **Repository includes submodules or Foundry deps**: Enable if your repository uses submodules and/or has `Foundry` dependencies that should be fetched.
- If you choose **URL**:
  - **Archive URL**: Public URL to a `.zip` archive that AuditHub can download.
  - **Commit hash** (optional): An identifier you can use to label the archive version you uploaded.
- If you choose **File**:
  - **Archive**: Upload a local `.zip` archive.
  - **Commit hash** (optional): An identifier you can use to label the archive version you uploaded.

### Project Root

The **Project Root** is the folder AuditHub uses as the working directory when running build system commands (e.g., `Foundry`/`Hardhat` commands).

### Project Paths

These paths tell AuditHub where to find relevant code and related files. All paths are relative to the uploaded/fetched version, and are typically under the **Project Root**.

- **Source path**: The folder containing the project’s source files.
- **Include path** (optional): The folder containing dependencies/includes, if any.
- **[V] Specs path** (optional): Where AuditHub finds embedded [[V] specs](/orca/user_guide/v/language_description), if present.
- **Hints path** (optional): Where AuditHub finds embedded [OrCa hints](/orca/user_guide/hints/hint_language_description), if present.

### Contents

Your selection here determines which tools AuditHub will offer for this project. You can select multiple options if your project contains more than one type of code (e.g., a project that includes both Solidity contracts and Circom circuits).

- **Solidity contracts**
- **Circom circuits**
- **Picus files**
- **LLZK files**

### Dependencies

If your project uses a JavaScript package manager, the project model captures:

- **Uses NPM-style deps**: Enable if the project uses Node.js package manager dependencies (`npm`/`yarn`/`pnpm`).
- Choose a package manager: `npm`, `yarn`, or `pnpm`.
- **Lockfile is committed**: Enable if a lockfile (e.g., `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) is present in the repository/archive.
- **Node version**: Choose the Node.js version AuditHub should use when installing dependencies.

### Build

Some tools need a build step before they can run. The project model captures build system settings such as:

- **Uses build system**: Enable if your project requires a build step.
- Choose a build system: `Foundry`, `Hardhat - Legacy`, or `Hardhat - Ignition`.
- **Deployment script path** (optional): Script path used by tools that need a deployment entrypoint.
- **Environment variables** (optional): Name/value pairs to set while running the build and tool commands.

:::warning Tool-specific configuration
Make sure that the project configuration matches the tools you plan to run. Some tools require specific options to be set (e.g., [OrCa](/orca) requires dependency settings, a build system, and a deployment script path). If a task cannot be executed because required configuration is missing, AuditHub will raise a warning and prevent the task from running until the configuration is fixed.
:::

---
title: Versions
sidebar_position: 3
---

In AuditHub, a `version` is an immutable snapshot of a project’s source code at a specific point in time. Tools run against a specific version, and any results (tasks, findings, issues, and threads) are tied back to that exact snapshot.

Versions are created when you set up a [project](/saas/guide/concepts/projects) (the `initial` version) and whenever you upload or fetch new source code later.

:::warning Deleting a version is destructive
Deleting a version permanently removes that snapshot and all information tied to it, including its tasks, findings, issues, and threads.
:::

## Why versions matter

A version:
- Makes results reproducible: running a tool against the same version should produce comparable output.
- Preserves traceability: you can always see what code was analyzed for a given task.
- Enables iteration: you can analyze multiple versions of the same project over time and compare outcomes.
- Powers the UI: the source browser, line links, and navigation rely on a stable snapshot.

## What a version represents

Conceptually, a version represents:
- The source code snapshot itself (as uploaded or fetched).
- Provenance information about how AuditHub obtained it (for example, from git or from an archive).
- Derived metadata created during ingestion to support browsing and analysis (e.g., a directory catalog and other extracted data used by tools).

## Version model

The version model is defined by what AuditHub currently uses. Key attributes include:

### Identity

- `name`: A human-friendly label for the version (for example, the initial version is often named `initial`).

### Source provenance

- `input_info`: How AuditHub loaded this version’s sources. This is one of:
  - **Git input**
    - `input_type`: `git`
    - `url`: Repository URL
    - `includes_submodules` (default: off): If enabled, include git submodules
    - `revision` (optional): Revision to check out (for example, a commit hash, branch, or tag)
  - **Archive input**
    - `input_type`: `archive`
    - `url` (optional): URL to download a `.zip` archive from (if omitted, the archive is uploaded manually)

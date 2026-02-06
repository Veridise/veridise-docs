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
- Provenance information about how AuditHub obtained it (e.g., from a GitHub repository, a URL, or an uploaded file).
- Derived metadata created during ingestion to support browsing and analysis (e.g., a directory catalog and other extracted data used by tools).

## Version model

The version model is defined by what AuditHub currently uses. Key attributes include:

### Identity

- **Name**: A human-friendly label for the version (e.g., the first version created during project setup is named `initial`). Renaming a version changes only its label, not its underlying snapshot.

### Source

Versions capture where the snapshot came from. In the UI, this is the **Access method** you choose when creating a new version:

- **Git repository**
  - **URL**: The URL of your Git repository.
  - **Revision** (optional): A branch, tag, or commit hash.
  - **Repository includes submodules**: Enable if the repository uses git submodules that should be fetched.
- **URL**
  - **URL**: A public URL to a `.zip` archive that AuditHub can download.
  - **Commit hash** (optional): An identifier you can use to label the uploaded snapshot.
- **File**
  - Upload a local `.zip` archive.
  - **Commit hash** (optional): An identifier you can use to label the uploaded snapshot.

## Where to manage versions

Versions are selected and managed from the version dropdown in the **Project Viewer** page. From there you can:
- Create a new version.
- Switch the active version.
- Rename, download, or delete an existing version (at least one version must always exist).

For the full UI walkthrough, see [Project Configuration and Version Management](/saas/guide/pages/projects/project_viewer/project_configuration_and_version_management).

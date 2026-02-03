---
title: Issues
sidebar_position: 8
---

<!-- AUDITING-FEATURES: start -->
In AuditHub, an `issue` is a tracked security concern identified during an audit or review. Issues are created and managed inside a [project](/saas/guide/concepts/projects) so auditors and developers can collaborate on remediation with a shared source of truth.

Issues can be created from manual review (e.g., from a code selection) or by promoting a [finding](/saas/guide/concepts/findings). In many workflows, the final set of issues becomes the basis for the audit report.

## Why issues matter

An issue:
- Tracks work that requires follow-up (investigation, fixes, retesting, and verification).
- Captures the rationale behind decisions (severity, impact, likelihood) and keeps them consistent across the team.
- Anchors collaboration between auditors and developers through structured discussions.
- Connects evidence (affected files, line ranges, promoted findings) to the remediation work.

## What an issue represents

Conceptually, an issue represents:
- A security problem statement with context and evidence.
- One or more affected locations in the codebase (paths and line ranges).
- An evolving record of discussion and resolution progress.

## Issue model

The issue model is defined by what AuditHub currently uses. Key attributes include:

### Core fields

- **Title**: A concise summary of the issue.
- **Description**: Detailed write-up of the problem, impact, and recommendations (the UI supports both WYSIWYG and raw Markdown editing).
- **Issue Properties**: Key metadata shown in the issue details view, including **Severity**, **Status**, **Created**, **Updated**, **Reporter**, and **Last Updated By**.

### Markers

Issues include markers to help prioritize and categorize work, such as:
- **Likelihood**
- **Impact**
- **Severity**
- **Type** (supports both predefined and custom values)
- **Raised By** (the auditor who identified the issue)

### Affected files

An issue can reference one or more affected file paths. For each file, AuditHub can capture:
- A specific line range, or
- The entire file (when the issue applies broadly)

Affected file links include the version context (e.g., `[initial] path/to/file:1-11`) so reviewers can open the referenced location in the correct snapshot.

### Promoted findings

If a tool produced findings that were confirmed as relevant, they can be promoted and attached to an issue to preserve the tool evidence and reduce duplication in write-ups.

### Collaboration

Issues support collaboration between auditors and developers:
- Issues can be shared with developers when ready.
- Issues can be updated with resolution information, such as pull request and commit references, to document where and how the issue was addressed.

### Visibility

Issues can have different visibility:
- **Not visible to developers** (not shared yet)
- **Visible to developers**

In the UI, this is reflected in the **Visibility** column (eye icon) in the issues table.

### Actions

Common issue actions include:
- **Create**, **Edit**, and **Delete**
- **Copy issue link** for sharing
- **Copy description markdown** for exporting the write-up
- Workflow actions that may appear depending on role and status (e.g., **Abandon**, **Notify auditors**)

### Issue discussions

Issues include a discussion area where participants can post messages, share context, and record decisions. Issue discussions are typically split into **Public** and **Private** threads so internal auditor notes can be separated from shared discussion.

#### Discussion message model

Each discussion message captures:
- **Author**
- **Timestamp**
- **Text**

Messages can be copied (as Markdown), edited, or deleted.

### Issue states

Issues move through a lifecycle as they are verified, shared, discussed, and resolved. The main states include:
- **Draft**: The issue is being written up and reviewed internally (not yet shared with developers).
- **Ready to share**: The issue is verified and ready to be shared with developers.
- **Open**: The issue is shared and actively being worked on.
- **Disputed**: The issue is under dispute and needs discussion or clarification.
- **Confirming fix**: A fix was submitted and is being reviewed.
- **Fixed** / **Partially fixed**: The fix (or partial fix) was accepted.
- **Invalid** / **Intended behavior** / **Acknowledged** / **Abandoned**: Terminal outcomes used when the issue is not being fixed (for different reasons).

## Where to view and manage issues

Issues are managed in the **Audit Issue Management** view of the project viewer. See:
- [Audit Issue Management](/saas/guide/pages/projects/project_viewer/audit_issue_management)
<!-- AUDITING-FEATURES: end -->

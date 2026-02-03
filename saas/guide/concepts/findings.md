---
title: Findings
sidebar_position: 7
---

<!-- AUDITING-FEATURES: start -->
In AuditHub, a `finding` is a result produced by an automated security tool run. Findings are created by [tasks](/saas/guide/concepts/tasks) and are always tied back to the exact [version](/saas/guide/concepts/versions) and tool run that produced them.

Findings represent potential security issues. They are meant to be reviewed, discussed, and triaged so teams can decide what needs follow-up.

## Why findings matter

A finding:
- Highlights a potential issue detected by a tool, with enough context to investigate.
- Helps prioritize review work using severity and filtering.
- Captures review decisions through triage (e.g., true positive vs false positive).
- Provides an audit trail: you can see what tool reported it, on what version, and in which task.
- Can be promoted into an [issue](/saas/guide/concepts/issues) when it needs tracking and remediation work.

## What a finding represents

Conceptually, a finding represents:
- A tool’s observation about a specific piece of code (often a precise file location).
- A severity level that helps communicate impact/priority.
- A human-readable explanation that supports manual review.
- A triage outcome and (optionally) discussion between auditors and developers.

## Finding model

The finding model is defined by what AuditHub currently uses. Key attributes include:

### Source and context

- The tool that produced the finding (tool name and tool version).
- The task run that produced the finding.
- The project version that was analyzed.

### Location

- A reference to where the tool detected the issue (e.g., file path and line). In the UI, findings support "jump to line" to open the relevant source location.

### Severity

- Findings are categorized by severity to support prioritization and reporting. AuditHub uses the following severity buckets:
  - `info`, `warning`, `low`, `medium`, `high`, `critical`

### Explanation and review

- A descriptive explanation of the issue and why it matters, provided by the tool.
- A triage status reflecting the review outcome (e.g., true positive or false positive).
- Optional discussion messages attached to the finding to support collaboration.

### Action history

AuditHub records an action history for each finding. Actions capture key review events (e.g., triage decisions) along with who performed them, when they happened, and an optional comment. This provides an audit trail for how a finding was handled over time.

### Finding discussions

Findings can have dedicated discussion threads tied directly to the finding itself. This keeps conversations anchored to the exact tool result, rather than relying only on general project threads.

## Where to view findings

- Task-level findings and triage: [Task Summary](/saas/guide/pages/projects/project_viewer/task_summary)
- Aggregated findings across tool runs: [Audit Issue Management](/saas/guide/pages/projects/project_viewer/audit_issue_management)
<!-- AUDITING-FEATURES: end -->

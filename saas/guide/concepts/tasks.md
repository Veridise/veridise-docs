---
title: Tasks
sidebar_position: 6
---

In AuditHub, a `task` is a single execution of a security tool against a specific [version](/saas/guide/concepts/versions). It captures exactly what tool was run, what configuration was used, and what happened during execution.

Tasks can produce [findings](/saas/guide/concepts/findings) and additional artifacts (e.g., logs or tool outputs), and they provide a step-by-step view of preparation and tool execution.

For how to review a task run in the UI, see [Task Summary](/saas/guide/pages/projects/project_viewer/task_summary).

## Why tasks matter

A task:
- Is the "unit of execution" in AuditHub: it is how tools are actually run.
- Preserves the run context (tool, version, and configuration) so results are traceable and reviewable.
- Provides transparency through steps and statuses, making it easier to understand what happened when something fails.
- Produces structured outputs (findings counters and artifacts) used in reviews and reporting.

## What a task represents

Conceptually, a task represents:
- A request to run a specific tool on a specific version of a project.
- A sequence of steps, including preparation steps (e.g., fetching sources or installing dependencies) and one or more tool-specific steps.
- The outcome of the run, including status, timing, any errors, and any produced findings/artifacts.

## Task model

The task model is defined by what AuditHub currently uses. Key attributes include:

### Target and tool identity

- `tool_name`: Which tool was run (e.g., OrCa, Vanguard, Picus).
- `tool_version`: The tool version used for this run.
- `version_id`: Which project version the task ran against.
- `name` (optional): A user-friendly label for the task.
- `id`: AuditHub’s internal identifier for the task.

### Tool configuration

- `tool_parameters` (optional): The tool configuration captured for this run (as entered in the UI wizard).
- `tool_extra` (optional): Additional tool-specific information stored alongside the task.

### Status and timing

- `status`: The task’s current state. Common states include:
  - `Queued` / `Pending`: Scheduled but not yet running
  - `Running`: Currently executing
  - `Succeeded` / `Finished`: Completed successfully
  - `Failed` / `Error`: Completed unsuccessfully
  - `Canceled`: Stopped by the user/system
  - `Skipped` / `Omitted`: Not executed (e.g., because it was not applicable)
- `created_at`: When the task was created.
- `started_at` (optional): When execution started.
- `finished_at` (optional): When execution finished.

### Steps

Tasks are broken into steps so you can see progress and diagnose failures.

- `steps` (optional): The list of steps in the task. Each step includes:
  - `code`: A stable identifier for the step (used to associate artifacts with it).
  - `definition`:
    - `caption`: Human-readable step title shown in the UI.
    - `short_name`: A short label used in compact views.
    - `is_tool`: Whether this step is actually running the tool (`true`) or is a preparation step (`false`).
  - `status`: Step status (same style of lifecycle states as the task).
  - `started_at` (optional) / `finished_at` (optional): When the step started/finished.
  - `exit_code` (optional): The step’s process exit code, when available.
  - `error_message` (optional): Human-readable error details, when the step fails.
  - `completed_without_timeout` (optional): Indicates whether the step finished before hitting a timeout.
  - `info_text` (optional): Additional context shown in the UI (e.g., what the step is currently doing).
  - `findings_counters` (optional): A summary of findings produced during that step, grouped by severity (`info`, `warning`, `low`, `medium`, `high`, `critical`).

### Findings summary

- `findings_counters` (optional): Task-level findings summary, grouped by severity (`info`, `warning`, `low`, `medium`, `high`, `critical`).

### Artifacts

Tasks can produce artifacts that can be downloaded and inspected during review.

- `artifacts` (optional): A list of artifacts produced by the task. Each artifact includes:
  - `name`: Artifact name displayed in the UI.
  - `step_code`: Which step produced the artifact.
  - `mime_type`: Content type for correct handling on download.
  - `is_fio`: Whether the artifact is stored as a file artifact in AuditHub storage.
  - `id`: AuditHub’s internal identifier for the artifact.
  - `presigned_url` (optional): A temporary download link, when available.

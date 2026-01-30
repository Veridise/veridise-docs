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
- Produces structured outputs (findings summaries and artifacts) used in reviews and reporting.

## What a task represents

Conceptually, a task represents:
- A request to run a specific tool on a specific version of a project.
- A sequence of steps, including preparation steps (e.g., fetching sources or installing dependencies) and one or more tool-specific steps.
- The outcome of the run, including status, timing, any errors, and any produced findings/artifacts.

## Task model

The task model is defined by what AuditHub currently uses. Key attributes include:

### Target and identity

- **Tool**: Which tool was run (e.g., OrCa, DeFi Vanguard, ZK Vanguard, Picus).
- **Tool version**: The tool version used for this run.
- **Version**: Which project version the task ran against.
- **Task name** (optional): A user-friendly label for the task.

### Tool configuration

- **Task wizard settings**: The configuration selected when the task was submitted.
- **Tool configuration**: The saved configuration shown alongside the task in the UI, so reviewers can see exactly what options were used.

### Status and timing

- **Status**: The task’s current state. Common states include:
  - `Queued` / `Pending`: Scheduled but not yet running
  - `Running`: Currently executing
  - `Completed`: Completed successfully
  - `Error`: Completed unsuccessfully
  - `Canceled`: Stopped by the user/system
  - `Skipped`: Not executed (e.g., because it was not applicable)
- **Created at**: When the task was created.
- **Started at**: When execution started.
- **Finished at**: When execution finished.

### Actions

Tasks support a few common actions:
- **Cancel**: Stop a running task.
- **Run Again**: Re-run the task with the previous wizard settings pre-filled.
- **Delete Task**: Remove a finished task from the project history.

### Steps

Tasks are broken into steps so you can see progress and diagnose failures.

- **Step list**: A task consists of one or more steps that may run sequentially or in parallel.
- Each step captures:
  - **Title**: The step name shown in the UI.
  - **Status**: The step lifecycle state (same style as the task status).
  - **Timing**: When the step started and finished.
  - **Logs**: Output for that step. Logs can be searched, navigated by line number, copied, or downloaded from the step menu.
  - **Error details**: A human-readable error message when the step fails.
  - **Findings summary**: A per-step summary grouped by severity (`info`, `warning`, `low`, `medium`, `high`, `critical`).

### Findings summary

- **Findings summary**: Task-level findings grouped by severity (`info`, `warning`, `low`, `medium`, `high`, `critical`).

### Artifacts

Tasks can produce artifacts that can be downloaded and inspected during review.

- **Artifact list**: A list of downloadable outputs produced during task execution (e.g., logs, reports, or other tool outputs).
- Each artifact is associated with the step that produced it.

### Version download

After a task runs, you can download:
- The **original** version snapshot, or
- The **augmented** version snapshot, which includes task-generated artifacts.

## Where to view and manage tasks

Tasks are launched and reviewed from the **Veridise Audit Tools** panel in the **Project Viewer**:
- Run a tool to create a new task.
- Use **History** to view all tasks for a tool.
- Open a task to see its **Task Summary** (status, steps, logs, findings, and artifacts).

See:
- [Task Summary](/saas/guide/pages/projects/project_viewer/task_summary)

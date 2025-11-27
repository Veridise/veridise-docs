---
title: Task Summary
sidebar_position: 2
---

## Veridise Audit Tools

On the right sidebar, the **Veridise Audit Tools** section provides access to all tools available in AuditHub and allows them to be executed against the selected source code.

Tools can be selected in two ways:
* By clicking the tool icons directly, or
* By expanding the **Veridise Audit Tools** section using the **tools** icon in the upper-right corner. This opens a detailed menu where each tool can be started using the `Run` button.

![image](../../../screenshots/project_viewer_run_tools_panel_1.png)

![image](../../../screenshots/project_viewer_run_tools_panel_2.png)

## Tasks

Both methods presented above open a task wizard. A task represents a single tool execution and runs using the configuration specified during the wizard steps.

![image](../../../screenshots/project_viewer_tool_task_wizard.png)

:::note
This documentation does not cover the detailed configuration options of each tool’s task wizard, as these are explained on the individual tool pages.
:::

### Recent Tasks

Scrolling down in the **Veridise Audit Tools** section reveals the **Recent Tasks** area, which displays the three most recently executed tasks.

![image](../../../screenshots/project_viewer_recent_tasks.png)

To view all tasks for a specific tool, select the tool of interest and click the **History** button. This opens a list containing all tasks associated with that tool.

![image](../../../screenshots/project_viewer_run_tools_panel_3.png)
![image](../../../screenshots/project_viewer_tasks_list.png)

### Task Summary

Clicking a task opens the **Task Summary** view, which provides an overview of that task’s execution. Each element of this page is described in the following sections.

#### Task Selection

To switch between tasks belonging to the same tool, you can expand the `Tasks` dropdown and select the desired entry. However, to view tasks from a different tool, you need to return to the **Veridise Audit Tools** section by clicking the back arrow.

![image](../../../screenshots/project_viewer_task_summary_tasks_list.png)

#### Task Actions

Three actions are available for tasks:
* `Cancel`
* `Run Again`
* `Delete Task`

A running task can be canceled at any time. When canceled, its status changes to `Canceled`, and its progress stops immediately.

![image](../../../screenshots/project_viewer_task_summary_cancel_task.png)
![image](../../../screenshots/project_viewer_task_summary_task_result_canceled.png)

After a task finishes its execution (whether `Canceled`, `Completed`, or `Error`ed), it can be run again. Selecting `Run again` opens the task wizard with all configuration options preloaded from the previous run.
A task can also be deleted at any time after it has finished by clicking `Delete Task`. Deletion is permanent, so caution is advised.

![image](../../../screenshots/project_viewer_task_summary_run_again_and_delete_task.png)
![image](../../../screenshots/project_viewer_task_summary_task_result_completed.png)
![image](../../../screenshots/project_viewer_task_summary_task_result_error.png)

#### Task Steps

Depending on the tool being executed, a task may consist of multiple steps that run either sequentially or in parallel. As shown below, each step provides a set of logs that can be inspected, including the executed command and its results. Logs can be searched, navigated by line number, copied, or downloaded. These options are available from the three-dot menu in the step box.

![image](../../../screenshots/project_viewer_task_summary_task_steps.png)

#### Task Findings

After finishing the execution, a task may produce findings, which represent the results of the automated analysis performed on the source code.

Each finding references the specific location where a potential issue was detected. Clicking the line indicator (i.e., jump to line) will open the file in the **Code editor** with the corresponding line highlighted.

![image](../../../screenshots/project_viewer_task_summary_findings.png)

Findings can be reviewed manually. Each one includes a detailed explanation that breaks down the issue step by step to help identify the root cause.

![image](../../../screenshots/project_viewer_task_summary_finding_description.png)

The involved parties can also start a discussion directly on a finding to collaboratively assess it. Shared messages within the discussion can be edited or deleted as needed.

![image](../../../screenshots/project_viewer_task_summary_finding_discussion.png)

Once a conclusion is reached, the finding can be moved to the triaging stage, where it may be marked as a true positive, false positive, or assigned another appropriate status.

![image](../../../screenshots/project_viewer_task_summary_triage_1.png)
![image](../../../screenshots/project_viewer_task_summary_triage_2.png)

To review all triaging actions, users can inspect the action history. Each entry documents the performed action, the author, and any arguments provided when categorizing a finding.

![image](../../../screenshots/project_viewer_task_summary_finding_action_history.png)

Findings can also be filtered to help narrow down specific categories or areas of interest.

![image](../../../screenshots/project_viewer_task_summary_filter_findings.png)

#### Task Artifacts

Depending on the tool, task steps may produce artifacts that can be downloaded and inspected afterward. These artifacts represent additional outputs generated during execution and may be useful for debugging or support purposes.

![image](../../../screenshots/project_viewer_task_summary_task_artifacts.png)

#### Download Version

Users can download either the original source code version or the augmented version, which includes the artifacts generated during execution. This can be done by clicking the **download** button located next to the task actions, as shown below.

![image](../../../screenshots/project_viewer_task_summary_download_archives.png)


### Full Analysis

The **Full Analysis** page includes all previously described sections, with the added ability to expand or collapse them for easier large-scale review. This page also provides a **Tool Configuration** section, which lists all the options used when the task was submitted, allowing users to reference the selected configuration settings during their analysis.

![image](../../../screenshots/full_analysis_page.png)
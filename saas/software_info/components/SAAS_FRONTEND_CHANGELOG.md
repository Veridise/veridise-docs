---
sidebar_position: 2
sidebar_label: AuditHub Frontend
title: Software Changes
slug: frontend-changelog
---
# Software Changes
## v2.0.7 - 2024-10-17
### Changed
- Confidence column in Findings Table is now hidden by default
- Removed pagination of findings table
- Tooltip and label of "Pure function fuzzing" checkbox

### Fixed
- Data from [V] Specs in the Project Viewer may have been stale
- Deletion of versions was not working
- Options in version selector were not always sorted by latest version
- UI allowed findings to open while a task wasnt finished
- Cursor positions not being "remembered" across tabs in editor
- Line jump related bugs

## v2.0.6 - 2024-10-10
### Added
- Digests in version details and the versions dropdown in the project viewer

### Changed
- Caption of editor tabs
- Display of dates in task details page
- Findings Table "Description" column label
- Format timestamp to local time
- Full timestamp in comments
- Task Details page now displays info text of a task

### Fixed
- Findings panel crashed when processing actions applied to a deleted finding
- Findings table was not paginated
- solc version not rendering properly in task details
- Fixing dialog where it keeps expanding
- Filtering the task of the active finding would crash the findings panel
- "Unknown" dates were being shown

## v2.0.5 - 2024-10-03
### Added
- Findings details discussion
- Label in dropdown of all comments dialog
- Syntax highlight support for Circom circuits

### Changed
- Return to message from preview after posting comment
- Scroll to bottom after posting comment
- Task names are no longer copied when resubmitting tasks
- Vanguard UI always uses the caption of detectors instead of the code

### Fixed
- Latest versions not being displayed in "Provide Source" step of task wizard
- Newly added organizations did not appear in organizations list immediately
- Version download wouldn't proceed if download notification fails to send
- Wrong ordering of messages in all comments dialog

## v2.0.4 - 2024-09-26
### Added
- Syntax highlighting for Leo / Aleo programs

### Fixed
- Editor used dark mode instead of user's preferred theme
- Finding preview in "Apply bulk action" dialog used the wrong theme
- Timeout limit in OrCa was not applied

## v2.0.3 - 2024-09-24
### Added
- Syntax highlighters for the following languages:
  - C++
  - C#
  - Go
  - Java
  - Kotlin
  - Lisp
  - Protobuf
  - Python
  - Scheme
  - Shell
  - XML
  - YAML
- Allow to re-open a resolved thread
- Previews of messages when composing a message in a thread
- Single minimize button for findings table and finding details

### Changed
- Auto-generated task names now use the current time instead of a hash
- Connectivity indicator in discussion panel
- Discussion panel title bar link now jumps to the specified line
- File name in discussion panel when thread does not exist yet
- Renamed "Remark" column in the Task Findings table to "Status"
- Row colors in findings table

### Fixed
- Shift + Enter was not reliably inserting lines in comment boxes
- Commenting did not work when disconnected due to timeouts (abruptly)
- OrCa is no longer available for projects without both a build system and a deployment script defined
- solc input in vanguard tasks was neither displaying drop-down options nor limited to them
## v2.0.2 - 2024-09-11
### Changed
- Introduce links in the collaborative commenting UI

### Fixed
- Bug fixes for collaborative commenting

## v2.0.1 - 2024-09-10
### Added
- Chronological view of all comments related to a project's version
- Dropdown menu to view all threads related to a project's version

### Changed
- Resolved threads are now pushed to the bottom of the thread list

### Fixed
- Findings management issues

## v2.0.0 - 2024-08-30
### Added
- New Project Definition wizardcapturing all details of a project, simplifying tool launching
- Viewer for workflow-style execution of tasks
- New way to present number of findings across tools, aggregated per task
- Allow managing findings across tools, marking them as true or false positives one at a time or in bulk
- Collaborative commenting to allow users to collaborate on auditing a project
- New Project Viewer aggregating file browsing, findings management, and collaborative commenting

## v1.1.2 - 2023-10-31
### Changed
- Updated [V] Specification grammar

### Fixed
- Fixed bug where users on Windows were unable to upload version archives

## v1.1.1 - 2023-10-28
### Changed
- Improved error reporting

### Fixed
- Fix issue with log presentation when websocket connection is terminated in the middle of an in-progress task

## v1.1.0 - 2023-10-26
### Added
- Ability to preview and download artifacts produced by tasks
- Incorporate Picus tool
- Incorporate zk-Vanguard tool 

### Fixed
- Bug involving `Task Results` button

## v1.0.0 - 2023-10-19
### Initial release
- User interface for allowing execution and monitoring of the following Veridise tools:
    - OrCa fuzzing tool, supporting Foundry and Hardhat deployment systems
    - Vanguard vulnerability detection tool
- User interface for creating ad-hoc VSpecs

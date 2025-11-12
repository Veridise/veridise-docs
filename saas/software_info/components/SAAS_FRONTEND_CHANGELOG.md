---
sidebar_position: 2
sidebar_label: AuditHub Frontend
title: Software Changes
slug: frontend-changelog
---
# Software Changes

## v2.5.6 - 2025-11-12
### Added
- Custom detector syntax validation
- Restriction for project, tools, and versions.
- Tooltip for task id
- View option for detectors, vspecs and hints

### Changed
- Update maximum timeout to 720 minutes

### Fixed
- Fix file location overflow

## v2.5.5 - 2025-11-11
### Changed
- ZK Vanguard v2 is now available on production

## v2.5.4 - 2025-11-11
### Changed
- Remove navigation to tasks dashboard from project details page
- Remove tasks dashboard from project menu
- Remove tool side bar from project details page
- Update layout and constraints for the Code View page

### Fixed
- Resubmit OrCa v1 tasks

## v2.5.3 - 2025-11-07
### Added
- Added user control functionality to the settings modal
- Input limit now supports directories

### Changed
- Fix timeout input validation by rounding up instead of rounding down
- Rename vanguard detectors to DeFi Vanguard and DeFi Vanguard (Legacy)

### Fixed
- Fix Vanguard v2 detector name display

## v2.5.2 - 2025-11-06
### Added
- Ability to create new issue types
- Maintaining position when going through threads

### Changed
- Drafts are now stored per session

### Deprecated
- Auto selection of hints is deprecated

### Fixed
- Color of findings text is changed to be more readable

### Removed
- Some text for removed functionality

## v2.5.1 - 2025-11-03
### Fixed
- Fix issue with thread creation

## v2.5.0 - 2025-10-30
### Added
- Add copy markdown functionality
- Add markdown editor mini functionality
- Add settings modal that allows to manage organization's V-specifications and hints library
- Max width for tabs

### Changed
- Show a notification when there's an update that is dismissable

## v2.4.9 - 2025-10-23
### Added
- Add multiple fixes to the redesign.
- Add zk-vanguard v2
- Custom detectors
- Vanguard v2

### Changed
- Updated ANTLR to the latest version

## v2.4.8 - 2025-10-16
### Added
- Add markdown link conversion to HTML in MarkdownEditorMini
- General fixes for redesign

### Fixed
- Fix timeout issue in Picus v1 and v2

## v2.4.7 - 2025-10-09
### Added
- Improvements to the redesign and several fixes

## v2.4.6 - 2025-10-03
### Added
- Email notifications for new issues and findings threads

## v2.4.5 - 2025-10-02
### Changed
- Disable dialog while submitting
- Respect backend limits for API keys

### Fixed
- Incorrect logic used when checking API key limits
- Redirect to /not-found when project is not found

## v2.3.7 - 2025-07-17
### Added
- API key management in the "Accounts" page

### Changed
- Remove gap between file path and line no. in issue details
- The "API Key Created" dialog now includes instructions on how to use API keys

### Fixed
- Fix Orca fork block number not being reset when fork network is unset
- Mention inserted in between of other text does not delete the text after it

## v2.3.6 - 2025-07-09
### Added
- Management interface for custom language syntax highlighting

### Fixed
- Fix SourceLocation step not clearing postResult when the source URL changes
- Fix paste markdown inside of code editor not being shown as markdown
- When submitting a comment from preview tab, the tab is not reset to the message tab and the field is not cleared

## v2.3.5 - 2025-07-03
### Added
- Add ability to save issues as drafts
- Deployment script path override in OrCa common settings
- Inline code button
- Notifications when app updates are available
- OrCa Hints
- Right-click finding to create issues

### Changed
- Adjusted density and spacing of markdown content

### Fixed
- File browser was not normalizing file paths
- Fuzzing Blacklist did not correctly validate form data when contract ABI was missing
- Input validation for start and end line numbers was changed to only validate on blur instead of on every change.
- Issue link regression
- Links not working in markdown viewer
- OrCa task submitted when pushing enter
- Wrong endpoints called in a part of the admin interface

## v2.3.4 - 2025-06-26
### Added
- Added Project Overview page.
- Persistence of filters in both Issues and Findings tables

### Changed
- Internal AuditHub links to issues are rendered with caption set to the issue title
- Projects in the project list are sorted in lexicographical order.
- The "Copy URL" button on issues now only includes an issue and version in links.

### Fixed
- Excessive spacing between list items in comments
- In Edit Project, users couldn't reuse a project name after deleting it
- Table filters not working
- socket issue

## v2.3.3 - 2025-06-11
### Added
- Ability to edit links by clicking on the link icon in the editor
- Add a right-click option for users to create links for lines to share
- Audit issue export button
- Button to copy issue link directly

### Changed
- Pressing `Tab` while editing code blocks now indents. Similarly, `Shift + Tab` de-indents.
- Split the "Open Discussion" button of issues into two buttons when the user is an auditor.

### Fixed
- Issue links appear as text when issue is being edited
- Issue links not working
- Mentions did not work when they looked like "[@John Appleseed]".
- OrCa tasks were able to be submitted without a deployment script by creating a project with a deployment script, starting an OrCa task, removing the deployment script, then resubmitting the OrCa task.

## v2.3.2 - 2025-05-29
### Added
- A warning while changing threads if there's an unsent message
- Commit_hash to project creation

## v2.3.1 - 2025-05-22
### Changed
- Changed button name and errors in the Upload modal to match the type of upload we choose.

### Fixed
- Duplicated logs in task steps when repeatedly opening and closing the step.
- Thread resolution did not immediately reflect in drop down when resolving the thread
- Wrong highlight when clicking links in findings and multiple files were opened

## v2.3.0 - 2025-05-15
### Added
- Audit issue management
- '`commit_hash` option to version creation and edit forms.'

### Changed
- Improved presentation of "Fork Network" parameter when reviewing OrCa tasks

## v2.2.6 - 2025-05-09
### Changed
- Creating a task in the Project Viewer now requires selecting a tool first.

## v2.2.5 - 2025-05-08
### Fixed
- V Spec validation would never finish given certain erroneous inputs

## v2.2.4 - 2025-04-23
### Fixed
- Links in the "All Comments" dialog would not open the corresponding thread

## v2.2.3 - 2025-04-17
### Changed
- Block user on duplicate project names
- Confirm when user inputs an include_path that doesn't exist in version archive
- Line highlights persist until the user scrolls or moves within the editor
- Prevent users from creating [V] Spec with a duplicate name
- You can add include paths that dont exist beforehand in a version archive.

### Fixed
- An empty call metrics chart displayed when OrCa did not produce call metrics
- Clicking "X" in the last tab in the editor would deselect all tabs
- Deleting tasks wouldnt immediately update task list
- Line highlights disappearing from links
- Next button became permanently disabled when no specs were selected and the back button was clicked
- Opening files would create a new tab but not switch to the new tab
- OrCa call metrics chart not displaying
- Picus v1 UI not showing file list
- Support for new call metrics format of OrCa
- When resubmitting OrCa tasks, specs were not being pre-filled

## v2.2.2 - 2025-04-01
### Added
- Debug mode option in Picus V2 configuration form
- New "multi-solver" option in Picus V2 advanced settings

### Changed
- Added back version edit and deletion in the Project Viewer.
- Improved error messages when versions fail to upload
- Improved logic of the "non-auditor" UI
- New URL scheme for various parts of the UI
- Now project root defaults to the root

### Fixed
- Admin UI not working when organization of task differed from ambient organization
- Creating task in project viewer page would direct to legacy dashboard
- Non-admin users were unable to delete projects in the project list
- Picus V2 failed to run when "Assume deterministic" field was empty
- Projects page used the wrong endpoint for accessing organization data
- The Upload Version form in the Project Viewer would clear itself when uploads failed
- The source browser in Project Viewer was not sorting deeply embedded files
- Zip files sometimes were not selectable when uploading a version

## v2.2.1 - 2025-02-13
### Added
- Ability to edit and delete versions in the Project Viewer.

### Changed
- Improved contrast of text between version name and version hash in dropdown.
- Upload form warns you when providing a Git link as a URL source

### Fixed
- Code editor would not disambiguate files with same name but different path
- Edit and delete buttons appeared for system-generated comments.
- Edit project wizard did not properly handle loading of version data
- Findings table sorted severity in alphabetical order.
- OrCa configuration displayed "Fork Block Number" option after setting "Fork Network" to "None".
- The Project Wizard allowed selecting folders as deployment scripts.

## v2.2.0 - 2025-02-06
### Changed
- Updated V grammar

### Fixed
- Error messages not relayed from backend in the project wizard
- Frontend would not remove leading spaces when sending URLs to backend, causing errors
- Stale temporary version used when creating projects with identical source location
- node_modules was incorrectly set as an include path when the user checked then unchecked the NPM checkbox while configuring a project without an include path

## v2.1.3 - 2025-01-21
### Added
- Ability to invite users from the admin panel
- Add "Ignore build system" option to DeFi Vanguard
- Added the ability to edit and delete comments

### Fixed
- Frontend showing OrCa graph when task fails
- OrCa was allowed in projects that configured build systems without deployment scripts.

## v2.1.2 - 2024-12-12
### Added
- Added Orca data visualization chart

### Fixed
- Clicking link in finding details only worked once
- Threads and comments disappearing when changing versions

## v2.1.1 - 2024-12-05
### Added
- Temporary line highlight after jumping to line

### Changed
- Onboard UI
- Project Viewer closes discussions when the user changes versions
- Project Viewer prompts user to discard message if they have an unsent message

### Fixed
- File browser falsely claimed it was loading data in projects without a version
- File link clicking bug
- Git SSH URLs were allowed when they shouldn't have been allowed
- Issue with input element
- Issue with opening and reopening file
- Task did not disappear from task selector after deletion
- Tasks table tasks filter may have reset after some inactivity
- Thread indicators in code editor did not respond immediately to tab changes

## v2.1.0 - 2024-11-12
### Added
- Extra visual indicator showing the currently selected finding in Findings Table

### Changed
- Labels in task filter, task selector, and finding thread discussions

### Fixed
- Switching versions would break commenting

## v2.0.9 - 2024-11-08
### Added
- Picus v2

### Changed
- Digest methods are now shown in the Project Viewer
- Digest methods are now shown in the version details page
- New contract type "Picus". Projects containing these files may use Picus v2
- Ordered folders and files by name, and folders set to always be above files
- Picus v2 UI and form submission behavior
- Version automatically selected when creating task from Project Viewer

### Fixed
- Crash when uploading versions from the project viewer
- Edit project functionality not working after Project Contents changed
- Ensure we are always running at the latest version of the frontend
- Findings under FP set may not appear under the "Apply bulk action" dialog
- Findings would always close after application of a bulk action
- Line jump did not function when clicking link to file A, file B, then file A
- Line jump issue when clicking the title of a discussion thread
- Line jump issue when data takes a while to load
- Review UI incorrectly summarizing project information
- Task resubmission not working for Picus V2 tasks
- Updates to organization specs were not immediately reflected in task wizard
- Viewing a Picus v2 task would crash the task details page
- Websocket did not reconnect when network errors occurred in Safari or Chrome

### Removed
- Green indicator

## v2.0.8 - 2024-10-24
### Added
- Error messages to steps in "Task Details" page.

### Changed
- Audithub branding
- Colors generated from user IDs
- Fetch threads in background when socket closed
- Pending steps are now marked as "not executed" in cancelled tasks

### Fixed
- '"Timeout" field of OrCa configuration allowed invalid input'
- Bug involving switching versions due to reusing a backend connection
- Discussion indicator was not filtering by version
- Findings panel expansion required a double-click
- Incorrect data sent when creating tasks with old versions after editing project
- Line jump was sometimes unreliable depending on time taken to set up tabs
- Threads across all versions were shown instead of those of the current version

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

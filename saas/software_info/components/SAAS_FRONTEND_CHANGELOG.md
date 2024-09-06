---
sidebar_position: 2
sidebar_label: SaaS Frontend
title: Software Changes
slug: frontend-changelog
---
# Software Changes

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

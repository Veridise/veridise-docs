---
sidebar_position: 1
sidebar_label: AuditHub Backend
title: Software Changes
slug: backend-changelog
---
# Software Changes
## v2.1.3 - 2024-10-03
### Added
- Maintain a digest for each uploaded version. SHA256 for archives, git commit hash (SHA-1) for git repos.

### Changed
- Improve error reporting for task steps

### Fixed
- Set findings.json to default values, when not properly formatted by the workflow system or the tools

## v2.1.2 - 2024-09-27
### Fixed
- Fix working directory on vanguard execution

## v2.1.1 - 2024-09-26
### Fixed
- Bug fixes on task output retrieval from the logging service

## v2.1.0 - 2024-09-24
### Changed
- Task execution workflow optimizations

### Fixed
- Fix order of messages in Collaborative Commenting Threads

## v2.0.1 - 2024-09-10
### Added
- New collaborative commenting endpoints

### Fixed
- Bug fixes

## v2.0.0 - 2024-08-30
### Added
- New Project Definition endpoints
- New workflow-style task execution, with visibility into each step
- Capture and aggregate findings and totals for all tools of a task
- Endpoints to all managing findings across tools, marking them as true or false positives one at a time or in bulk
- Collaborative commenting supporting endpoints
- Fork networks support when running the OrCa fuzzer

## v1.1.3 - 2023-11-01
### Changed
- Allow better management of database pool

## v1.1.2 - 2023-11-01
### Added
- Add health check endpoint

## v1.1.1 - 2023-10-28
### Changed
- Improved error reporting

### Fixed
- Fix issue with out of order task logs

## v1.1.0 - 2023-10-26
### Added
- Allow execution of ZK Vanguard
- Allow execution of Picus
- Store task artifacts, which are then available to the user

### Changed
- Improve user onboarding process
- Improve access control by introducing more restrictions

## v1.0.0 - 2023-10-19
### Initial release
- Allow execution and monitoring of the following Veridise tools:
    - OrCa fuzzing tool, supporting Foundry and Hardhat deployment systems
    - Vanguard vulnerability detection tool
- Data preservation subsystem
- Log preservation subsystem
- Identity provider to manage user accounts
- Authorization system to control access to SaaS components
- Email notifications for user onboarding
---
sidebar_position: 1
sidebar_label: AuditHub Backend
title: Software Changes
slug: backend-changelog
---
# Software Changes

## v2.5.44 - 2026-04-20
### Fixed
- Bug fixes

## v2.5.43 - 2026-04-16
### Fixed
- Bug fixes

## v2.5.42 - 2026-04-15
### Added
- Add auxiliary deployment script support to OrCa on-chain fuzzing
- Add version resource metrics endpoints

## v2.5.41 - 2026-04-08
### Fixed
- Allow empty string for resolution_pr and resolution_commit, and treat them as None

## v2.5.40 - 2026-04-01
### Added
- Add optional message count to thread messages, on get comment threads endpoints

### Changed
- Improve response data on errors

## v2.5.39 - 2026-03-26
### Added
- Add user favorite organizations
- User facing resource consumption information

## v2.5.38 - 2026-03-18
### Added
- Add new issue status "Under review"
- Allow user to define notification settings per organization
- Endpoint for public service announcements

## v2.5.37 - 2026-03-12
### Added
- Include is_deployed field on versions and projects.
- Support vanguard cross version finding triage

### Removed
- Legacy DeFi Vanguard

## v2.5.36 - 2026-03-02
### Changed
- Update picus solvers

## v2.5.35 - 2026-02-27
### Changed
- Improve task output

## v2.5.34 - 2026-02-25
### Fixed
- Bug fixes

## v2.5.33 - 2026-02-16
### Added
- Allow pushing issues and security advisories to GitHub
- OrCa on chain fuzzing support

## v2.5.32 - 2026-02-12
### Added
- "Argument `\u2014apply-rewrites` for picus"

## v2.5.31 - 2026-01-28
### Added
- Free AuditHub demo feature
- Organization subscriptions
- Quota enforcement based on subscriptions
## v2.5.30 - 2026-01-13
### Changed
- Improved cache management
- Source management now supports fault tolerant service

### Removed
- Callback endpoints for status updates

## v2.5.29 - 2026-01-05
### Added
- Resource cleanup

### Changed
- Digest notifications now point to the new UI

## v2.5.28 - 2025-12-23
### Fixed
- Bug fixes

## v2.5.27 - 2025-12-17
### Fixed
- Bug fixes

## v2.5.26 - 2025-12-16
### Changed
- Allow checkout from private GitHub repos via the HTTPS protocol

## v2.5.25 - 2025-12-10
### Fixed
- Bug fixes

## v2.5.24 - 2025-12-04
### Added
- DeFi Vanguard timeout

## v2.5.23 - 2025-11-26
### Fixed
- Bug fixes

## v2.5.22 - 2025-11-21
### Changed
- Infrastructure improvements

## v2.5.21 - 2025-11-20
### Changed
- Improved access restrictions enforcement

## v2.5.20 - 2025-11-18
### Changed
- Update solver options for tool Picus

## v2.5.19 - 2025-11-13
### Changed
- Improve authorization

## v2.5.18 - 2025-11-12
### Fixed
- Bug fixes

## v2.5.17 - 2025-11-11
### Changed
- Infrastructure improvements

## v2.5.16 - 2025-11-06
### Changed
- Improve error reporting

## v2.5.15 - 2025-11-03
### Added
- User management on organization by organization users

### Fixed
- Bug fixes

## v2.5.14 - 2025-10-23
### Fixed
- Bug fixes

## v2.5.13 - 2025-10-20
### Fixed
- Bug fixes

## v2.5.12 - 2025-10-16
### Added
- ZK Vanguard v2

### Changed
- Infrastructure improvements

### Fixed
- Bug fixes

## v2.5.11 - 2025-10-09
### Changed
- Infrastructure improvements

### Fixed
- Bug fixes

## v2.5.10 - 2025-10-02
### Added
- Vanguard custom detectors support

## v2.5.9 - 2025-09-12
### Fixed
- Bug fixes

## v2.5.8 - 2025-09-11
### Fixed
- Bug fixes

## v2.5.7 - 2025-09-03
### Changed
- Update OrCa commands to support Foundry version v1.3.1
- Update yarn and pnpm commands to make them non-interactive

## v2.5.6 - 2025-08-25
### Added
- Cleanup cache functionality

## v2.5.5 - 2025-08-22
### Changed
- Improvements on file I/O

### Fixed
- Bug fixes

## v2.5.4 - 2025-08-21
### Fixed
- Bug fixes

## v2.5.3 - 2025-08-05
### Changed
- Improve content of online notifications

## v2.5.2 - 2025-07-31
### Fixed
- Bug fixes

## v2.5.1 - 2025-07-28
### Added
- Support for favorite projects

### Fixed
- Fix pyul invocation issue (project root path) for DeFi Vanguard

## v2.5.0 - 2025-07-17
### Added
- Allow users to self-manage their AuditHub API keys

### Changed
- At issue management, make dispute transition function available after reopen from a dispute state

### Fixed
- Bug fixes

## v2.4.7 - 2025-07-09
### Added
- Add digest notifications for recent activity on threads
  
### Fixed
- Bug fixes

## v2.4.6 - 2025-07-03
### Added
- Allow overriding deployment script at OrCa task launch time
- OrCa Hints support

### Fixed
- Bug fixes

## v2.4.5 - 2025-06-26
### Changed
- Disable gas limit checks for Anvil during OrCa task execution
- Limit thread comment data size to 7500 bytes.

## v2.4.4 - 2025-06-23
### Changed
- OrCa foundry `forge script` invocation now uses the `--code-size-limit` flag

## v2.4.3 - 2025-06-11
### Changed
- Support multiple logging services
- Format of issues export data

### Fixed
- Bug fixes
## v2.4.2 - 2025-05-29
### Fixed
- Bug fixes

## v2.4.1 - 2025-05-22
### Added
- Endpoint to post a new thread comment

## v2.4.0 - 2025-05-15
### Added
- Audit Issue Management feature
- GET endpoint to retrieve all findings of all tasks of a project

### Changed
- Allow `commit_hash` input for versions.

## v2.3.7 - 2025-05-09
### Fixed
- Bug fixes

## v2.3.6 - 2025-05-08
### Fixed
- Bug fixes

## v2.3.5 - 2025-04-17
### Changed
- Improvements on how OrCa is invoked for all build systems

## v2.3.4 - 2025-04-01
### Fixed
- Bug fixes

## v2.2.3 - 2025-02-19
### Fixed
- Bug fixes

## v2.2.2 - 2025-02-13
### Fixed
- Bug fixes

## v2.2.1 - 2025-01-23
### Changed
- Internal configuration settings

## v2.2.0 - 2025-01-20
### Added
- Allow updating and deleting comments in collaboration threads
- Support for email invitations
- Support foundry and hardhat build system for Defi Vanguard

## v2.1.9 - 2024-12-12
### Security
- Update dependencies

## v2.1.8 - 2024-12-05
### Fixed
- Bug fixes on node dependency installation

### Changed
- Add step_code in Artifact model
- Add short_name in StepDefinition model
- Improved onboarding requests handling

## v2.1.7 - 2024-11-08
### Added
- Integrate Picus-v2

### Changed
- Generate task name with current timestamp in UTC if one is not provided

## v2.1.6 - 2024-10-24
### Added
- Added endpoint to retrieve all threads of a version

## v2.1.5 - 2024-10-17
### Fixed
- Fix bug related to querying logging subsystem
- Notify websocket client of authorization errors via websocket protocol

## v2.1.4 - 2024-10-10
### Fixed
- Bug fixes on task step notifications

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

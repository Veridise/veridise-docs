---
sidebar_position: 6
sidebar_label: AuditHub Agent
title: Software Changes
slug: audithub-agent-changelog
---
# Software Changes

## v1.0.2 - 2026-08-26
### Added
- Added additional tools to the agent's runtime image.
- The agent now produces a markdown report that summarizes its runs.

### Changed
- Emitted findings no longer include recommendations.

### Fixed
- Fixed bug were the agent was executing a step twice
- Fixed an issue where findings titles were not displaying correctly in the UI.

## v1.0.1 - 2026-08-05
### Changed
- Increased the default budget given to the agent.

### Fixed
- Fixes an issue that would cause the agent to not finish all of the planned tasks.
- Fixes an issue where an unexpected file in a sub-agent's findings directory would discard valid findings.
- Fixes an issue where re-triaging a finding could duplicate it instead of updating it, leaving the duplicate unreviewed and stalling the run.

## v1.0.0 - 2026-07-30
### Initial release


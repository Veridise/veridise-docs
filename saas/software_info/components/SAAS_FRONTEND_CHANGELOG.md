---
sidebar_position: 2
sidebar_label: SaaS Frontend
title: Software Changes
slug: frontend-changelog
---
# Software Changes

## v1.1.0-rc1 - 2023-10-26
### Added
- Ability to preview and download artifacts produced by tasks
- Admins can now filter tasks by organization and creator
- New `strong` option to Picus configuration
- New vanguard detector for unused subcomponents
- 'Picus: a tool for auditing ZKP circuits'

### Changed
- Picus configuration is now split between "common" and "advanced" settings.
- Vanguard is now split into DeFi and ZK versions

### Fixed
- Bug involving "Task Results" button

## v1.0.0 - 2023-10-19
### Initial release
- User interface for allowing execution and monitoring of the following Veridise tools:
    - OrCa fuzzing tool, supporting Foundry and Hardhat deployment systems
    - Vanguard vulnerability detection tool
- User interface for creating ad-hoc VSpecs

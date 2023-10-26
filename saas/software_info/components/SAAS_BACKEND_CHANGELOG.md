---
sidebar_position: 1
sidebar_label: SaaS Backend
title: Software Changes
slug: backend-changelog
---
# Software Changes

## v1.1.0-rc2 - 2023-10-26
### Added
- Allow upload task artifact via callback from task execution: Update db and upload to s3
- Access control on language and blockchain
- Access control on picus
- Access control on vanguard detectors
- Add access to Veridise organization during Veridise onboarding
- Add artifacts endpoint for getting artifact contents
- Add new endpoint for execution of ZK Vanguard
- Add new restriction (/tools/vanguard ) to Secereum on boarding
- Add organization restrictions during Secereum onboarding
- Endpoint with onboarding options
- Picus strong parameter
- Run picus via saas
- The about page of admin includes picus version

### Changed
- Make the onboarding link to access the frontend instead of the backend api
- Rename restrictions of ZK Vanguard

### Removed
- Picus noclean parameter, it was not intended for SaaS
- Populate OrCa data for Secereum
- Tool execution scripts are moved to saas_tool_helpers

### Security
- Add security context configuration on generated k8s job configuration

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
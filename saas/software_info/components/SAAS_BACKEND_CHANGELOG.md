---
sidebar_position: 1
sidebar_label: SaaS Backend
title: Software Changes
slug: backend-changelog
---
# Software Changes

## v1.0.0-rc3 - 2023-10-02
### Added
- About endpoint for admin users
- Add `deployment_folder_path` configuration option on Project and OrCa task
- Add order_by option to get tasks endpoint
- Add pagination to get admin tasks endpoint
- Add pagination to get tasks endpoint
- Add tool job template label to prevent auto scaler from evicting pod
- Added support for forking for OrCa tasks
- Make `deployment_script_path` and `deployment_folder_path` required, when `deployment_system` is provided.
- Setup pre-release workflows
- Support for OrCa deployment system

### Changed
- About endpoint provides version information and links to changelogs and documentation
- Allow support role list organizations and organization restrictions
- Change exit code of cancelled task from 143 to 130. This is compatible with the latest saas-release-hlper version.
- Release workflow setup
- Rename `admin-view` role to `support` role
- Set onboarding populate default option to None
- Use ssh instead of https to add release_helpers submodule

### Fixed
- Create k8s namespace for user specific organization during onboarding.
- Fix OrCa Foundry issue
- Fix issue where the backend only provided the last of multiple version archive specs to OrCa
- Performance improvement for admin/tasks endpoint
- Send notification email after user onboarding.


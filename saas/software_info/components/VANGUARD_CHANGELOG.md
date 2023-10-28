---
sidebar_position: 4
sidebar_label: Vanguard
title: Software Changes
slug: vanguard-changelog
---
# Software Changes

## v0.2.1-rc1 - 2023-10-27
### Changed
- Added size limit for dump-cdg

### Fixed
- unchecked-return:
  - Fixes bug where a call to a non-void function could be considered a void function
  - When there are multiple possible targets for a function call report all non-void possible targets rather than just the first
- Remove circom compiler error color codes for better rendering in SaaS

## v0.2.0 - 2023-10-26
### Added
- dump-cdg: Detector to print the graph representation of the circuit
- unused-subcmps: Detector to find unused (i.e., dead) subcomponents in subcomponent arrays

### Changed
- flashloan:
  - Include source code information in report
  - Combine alerts with the same source into a single alert
- non-det-wit:
  - Improved detector performance
- reentrancy: added source location information to output
- uc-inputs:
  - Improved detector performance
  - Fixed bug causing false positives
  - Lower severity from CRITICAL to MEDIUM
- uc-ouputs:
  - Improved detector performance
- uc-subcmp-inputs: Only operate on used subcomponents
- uc-subcmp-outputs:
  - Only operate on used subcomponents
  - Improved detector performance
- unchecked-return: Add source code location info of callsites
- zk-divide-by-zero:
  - Improved detector performance
  - Skip computation if no division operations are present
- Add LOW, MEDIUM, and HIGH to severity options

### Fixed
- Solidity frontend:
  - Fix bug where storage array push/pop would not be detected as storage writes.
  - Fix several cases causing crashes
- reentrancy: correctly flag writes to storage pointers
- unchecked-return:
  - Fixes bug where a call to a non-void function could be considered a void function
  - When there are multiple possible targets for a function call report all non-void possible targets rather than just the first
- unchecked-return:
  - Consider writing to a memory variable as a valid check
- use-before-def:
  - Consider writing to a memory variable as a use
- uc-outputs:
  - Fix false negatives
- uc-subcmp-outputs:
  - Fix false positives
- Add sorting and filtering to issue reporting to eliminate redundant outputs
- Fix a bug causing fallback/receive functions to be ignored.
- Fix a memory leak in taint analysis-based detectors, which includes most detectors currently available
- Fix handling of string storage reads/writes
- Fix memory leaks that could occur when running multiple detectors.


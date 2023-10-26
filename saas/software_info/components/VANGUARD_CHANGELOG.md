---
sidebar_position: 4
sidebar_label: Vanguard
title: Software Changes
slug: vanguard-changelog
---
# Software Changes

## v0.2.0 - 2023-10-26
### Added
- dump-cdg: Detector to print the graph representation of the circuit
- unused-subcmps: Detector to find unused (i.e., dead) subcomponents

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
- uc-ouputs:
  - Quit if there are no outputs
- uc-subcmp-inputs: Only operate on used subcomponents
- uc-subcmp-outputs: Only operate on used subcomponents
- uc-subcmp-outputs:
  - Improved detector performance
- unchecked-return: Add source code location info of callsites
- zk-divide-by-zero:
  - Improved detector performance
  - Skip computation if no division operations are present
- Add LOW, MEDIUM, and HIGH to severity options
- Lowered uc-inputs issue severity from CRITICAL to MEDIUM

### Fixed
- Solidity:
  - Fix bug where storage array push/pop would not be detected as storage writes.
- reentrancy: correctly flag writes to storage pointers
- unchecked-return:
  - Fixes bug where a call to a non-void function could be considered a void function
  - When there are multiple possible targets for a function call report all non-void possible targets rather than just the first
- unchecked-return:
  - Consider writing to a memory variable as a valid check
- use-before-def:
  - Consider writing to a memory variable as a use
- Add sorting and filtering to issue reporting to eliminate redundant outputs
- Fix a bug causing fallback/receive functions to be ignored.
- Fix a memory leak in taint analysis-based detectors, which includes most detectors currently available
- Fix handling of string storage reads/writes
- Fix false negative in uc-output detector.
- Fix memory leaks that could occur when running multiple detectors.
- Fixed false positive issue in uc subcomponent output detector.
- Fixed several crashes in the Solidity frontend
- Fixes false-positive issue in under-constrained components output detector.


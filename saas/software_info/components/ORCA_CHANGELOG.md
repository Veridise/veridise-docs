---
sidebar_position: 3
sidebar_label: Orca
title: Software Changes
slug: orca-changelog
---
# Software Changes

## v2.12.4 - 2026-04-30
### Fixed
- Fix issue with RPC downtime by adding retries to EVM construction and transaction issuing.
- Fixed an issue with gathering call metrics over fuzzing corpus.

## v2.12.3 - 2026-04-16
### Changed
- Updated code to improve memory usage.

## v2.12.2 - 2026-04-15
### Added
- Updated PyREVM to latest version.

## v2.12.1 - 2026-04-08
### Added
- Added a helper `bytes` function in Hints.
- Added an absolute value function for [V] and Hints.

### Changed
- Updated OrCa's printed logs to include number of spec violations found.

### Fixed
- Fixed parsing issue from strict decoding of EVM revert data.

## v2.12.0 - 2026-04-01
### Added
- Added input sanitization to user addresses provided by the user.
- Added instruction coverage information to call metrics.

### Changed
- Updated dependencies to latest compatible versions.
## v2.11.0 - 2026-01-23

### Added
- Added support for multiple struct definitions with the same name and different field names
## v2.10.0 - 2025-12-19
### Fixed
- Made enum information optional in AST to avoid issues when only ABIs provided for on-chain fuzzing
- Changed integer fuzzing for more efficient coverage
## v2.9.0 - 2025-11-18
### Changed
- Added logging functionality for [V] and Hints — static and runtime errors are now logged for [V] and Hints but do not crash OrCa.
- Updated [V] semantic checking to check contract free variables.
- Improved counterexample finding through comprehensive specification checking.

### Fixed
- Fixed a bug with Pydantic errors breaking OrCa's file generation reporting errors.
- Fixed a bug with default users when choosing to fork networks.
- Replaced deprecated OpenJDK Docker image.

## v2.8.0 - 2025-10-23
### Changed
- Updated OrCa dependencies to improve performance.
- Updated OrCa Findings reports for AuditHub.

## v2.7.0 - 2025-10-09
### Added
- Added more helper functions to Hints and [V] languages.
- Updated struct and function descriptions on counterexamples to include field names.

### Fixed
- Fixed an issue with OrCa not recognizing global enums and structs.
- Fixed a bug with type casting bytes and array types.
- Fixed a bug with bytes values not matching expected length in cryptographic hints.
## v2.6.0 - 2025-09-03
### Changed
- Updated PyREVM to support latest stable Foundry version v1.3.1.

### Fixed
- Fixed an issue with Foundry test generation where Orca runs and generated tests had mismatching timestamps.
- Fixed an issue with reentrancy contract address collision.
- Fixed an issue with hint vars section, now functions can be called from any contract in vars section and variables in vars section can be referenced in hints.
- Improved error reporting on hints referencing non-existent functions or contracts.
- Updated [V] and hint Antlr grammars to handle issues with minus token.
- Updated [V] Antlr grammar to handle expressions with a lot of function calls without taking a long time.

## v2.5.0 - 2025-07-31
### Added
- Added Hint and VSpec metrics generation for visualization in AuditHub and VSCode Plugin.

### Fixed
- Fixed a bug with fuzzing Enum values.
- Fixed a bug with matching Hints with fuzzed transactions.
- Fixed a bug with reentrancy detection.
## v2.4.0 - 2025-07-03
### Added
- OrCa can now fuzz the amount of time between transactions to handle projects dependent on timestamps.

### Changed
- OrCa hints now need to be provided separately by users instead of bundled in [V] spec files

### Fixed
- Fixed a bug with reentrancy detection on Hardhat projects.

## v2.3.0 - 2025-04-17
### Added
- Added the support to add constraints over variables in [V] hints.

### Changed
- FuzzingInformation object, containing information for SaaS to present to users, now uses Pydantic

## v2.2.0 - 2025-02-06
### Changed
- Changed Python version to Pypy3.10 to improve fuzzing performance
- Updated [V] Hint functionality to support only for-all blocks or assignment to transaction arguments.

## v2.1.1 - 2025-01-20
### Fixed
- Fixed a bug with state_fold/fsum V expressions where OrCa would crash.

## v2.1.0 - 2024-12-12
### Added
- Added support for generating a metrics file to be displayed in AuditHub

### Removed
- Tracking for counterexamples found in [V] init section (since [V] init section is no longer supported)

## v2.0.1 - 2024-10-03
### Changed
- Updated FIO compatibility to return multiple counterexamples.

### Fixed
- Added proper handling of sender and value in hints.
- Fixed a typo in pretty print in V function call statements.
- OrCa now crashes explicitly if no file with .spec extension is provided.
- Updated reeentrancy detection to avoid false positive during specification checking.

## v2.0.0 - 2024-08-30
### Added
- Add release workflows.
- Add support for blockchain statements in hints
- Add support for inferred.hints file in specs/directory
- Added ability to interpret tuples in V
- Added back in blacklist, whitelist, and pure filtering functionality
- Added Cryptographic Hint support
- Functionality to interpret ecdsa256_sign
- Functionality to update transaction from generative hints
- Hex numbers to V parsing
- Invariant section to V language
- OrCa now supports Python3.12
- Precommit hook config file.
- Support for indexing into tuples and structs
- foreach statement as a conditional in V
- foreach supports multiple assignments

### Changed
- Antlr version from 4.9 to 4.13
- Change sampling to be uniform across all function/contract pairs
- Enable unbounded integer types
- Make deployment script path relative to the project's path
- Now showing error stack trace without requiring debug option
- Refactored [V] style output printing for counterexamples
- Slightly modified the counterexample(s) printout
- Update ABIExtraction submodule
- Updated Dockerfile to install Foundry. This includes Forge, Anvil, etc.
- Updated dockerfile to use python 3.12 instead of 3.11
- Use absolute instead of relative paths for hardhat/foundry deployment scripts.

### Deprecated
- Most config fields are now deprecated as we move to SaaSV2, only relevant fields are now available in SaaS

### Fixed
- Bring in new version of PyREVM that fixed dump state issue when forking.
- Counterexample formatting error from merge with Eth types
- Fix issue on counterexample minimization where bug not found due to newly fuzzed free variable values.
- Fix tuple parsing in VSpecs
- Fixed the time value that is displayed when the fuzzing ends
- Fixed unit tests issues caused by hint manager merge.
- Fixed usage of EthType and both type and value factory methods
- Issue where Orca crashed when type constructor inputs were invalid
- Fixed issue where multiple Enums with the same name was leading to non-deterministic interpretation
- Make debug logging for hint manager print to debug log instead of progress log.
- More type annotations for [V] related code
- Support for mappings that return structs
- Updated blockchain manager to log all transactions from deployment as setup transactions, even those that are not constructor calls.

### Removed
- Antlr-generated files
- Assigned free variable input to the oracle. This was meant to track free variables assigned in the init section but has become deprecated since the addition of support for other deployment methods.
- Killed unused tmp directory. You will not be missed.
- Remove "compiler" config field
- Removed "async_run" config field
- Removed num_processors argument from OrCa CLI.
- Removed old [V] interpreter oracle and associated config options
- Removed out-of-date test on free variables used in init section.
- Removed unused buchis argument of oracle which is now defunct.
- Remove spec_lang config field.
- Removed "add_constructor_for_nested_initializers" field from config and deleted code from codebase that uses it.
- Removed 'contract_invariant' field from the configuration.
- Several config fields were entirely unused in code and have been removed

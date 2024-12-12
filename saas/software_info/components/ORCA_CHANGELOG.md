---
sidebar_position: 3
sidebar_label: Orca
title: Software Changes
slug: orca-changelog
---
# Software Changes
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

## v1.0.0 - 2023-09-29
### Initial release
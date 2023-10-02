---
sidebar_position: 3
sidebar_label: Orca
title: Software Changes
slug: orca-changelog
---
# Software Changes

## v1.0.0-rc2 - 2023-09-29
### Added
- Add a class to gather all type assignments in the condition of a hint
- Add release workflows.
- Added ability to interpret tuples in V
- Added capability to parse tuples in V
- Added isort pre-commit hook.
- Added tests for hardhat configuration to CI test suite
- Added unit tests for the above mentioned cryptographic signatures
- Byte values to V parsing
- Cryptographic helpers for EIP712 and raw ECDSA256 signatures
- Functionality to interpret ecdsa256_sign
- Functionality to update transaction from generative hints
- Hex numbers to V parsing
- New generative hints for specify user addresses (rather than arbitrary addresses)
- Precommit hook config file.
- This is a significant change where a large amount of logic has been added to handle contracts deployed via a proxy
- ability to use foreach statement with generative hints
- added error code 16 (TOOL_ERROR_IN_HARDHAT_FOUNDRY_DEPLOYMENT)
- foreach statement as a conditional in V
- foreach supports multiple assignments

### Changed
- Added a return type to rand_int().
- Added more detailed types in src/utils/deployment_transaction_handler.py.
- Changed EthTransaction where cid and caddr are changed to Optional types </br> because there are instances where both fields are instantiated as None.
- Changed files to conform to isort specifications.
- Changed spacing in the all of the .py files in src/utils.
- Fixed a type mismatch in _get_eth_values() in deployment_transaction_handler.py </br> where the types_list was initialized as a list but its value was updated to a dict in a loop.
- Fixed the type mismatch in rand_char() in random.py where choose_rand() was taking </br> a string as an input instead of a list.
- Make deployment script path relative to the project's path
- OrCa is now more flexible regarding paths
- Renamed variable names in choose_rand() and shuffle() in random.py </br> from "l" to "list" because of ambiguous naming.
- Slightly modified the counterexample(s) printout
- Style updates on src/blockchains/*.py.
- Style updates on src/corpus/*.py.
- Style updates on src/logging/*.py.
- Style updates on src/oracles/*.py.
- Style updates on src/specs/*.py, src/analyses/*.py, src/*.py and *.py.
- Update version of release_helpers submodule
- Updated Dockerfile to install Foundry. This includes Forge, Anvil, etc.
- Updated code to satisfy style requirements.
- Updated the ABIExtraction submodule according to the latest changes
- Updated the style of some files to pass the precommit check.

### Fixed
- Add basic logic for foundry execution.
- Add logic for parsing contracts compiled from foundry projects
- Add logic to make sure input data is correctly formatted for the function call
- Add missing necessary import for eip712
- Added backoff retry logic to the web connection for deployment script logic
- Fix bug where static bytes were not stored at the appropriate length.
- Fixed issue causing orca to crash when fsum gatherer visits foreach expression
- Fixed issue where we were improperly parsing the return types of functions when they were arrays of structs.
- Fixed issue with hardhat deployment and reentrancy detection by adding compilation of OrCaTxnExecutor proxy when compiling hardhat projects.
- Fixed library_ID parsing logic for Foundry deployments
- Fixed the time value that is displayed when the fuzzing ends
- Fixed typo in test
- Minor bug involving VAST construction
- Move logic for associating transactions with named functions and contracts from deployment_script_handler to deployment_transaction_handler
- Removes dead code
- Replaced https URL for release submodule with git@
- fixed error reporting in deployment script handler
- improved error message on unspecified variable in spec
- removed code as dead as my heart.

### Removed
- Removed unused imports in antlr_error_listener.py, utils.py.


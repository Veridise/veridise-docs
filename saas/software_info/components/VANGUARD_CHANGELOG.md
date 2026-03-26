---
sidebar_position: 5
sidebar_label: Vanguard 
title: Software Changes
slug: vanguard-changelog
---
# Software Changes

## v1.0.13 - 2026-03-26
### Added
- DeFi Vanguard:
  - Custom detectors:
    - Added AddressThis PAQL class for Solidity dialect (`address(this)`)
    - Added MsgSender PAQL class
- ZK Vanguard:
  - Include new circom-to-llzk frontend
  - Update driver script to accept circom files

### Changed
- DeFi Vanguard:
  - Custom detectors
    - StorageRead and StorageWrite have improved debug string and are handled in solidity symbolizer
- ZK Vanguard:
  - Automatically detect prime field from LLZK, if possible
  - Update LLZK dependency to update detector analyses

### Fixed
- DeFi Vanguard:
  - Solidity:
    - Fixed crash when handling a storage pointer assigned conditionally
    - Fixed crash when handling a mapping index with a string literal
    - Fixed a crash involving code that copies bytes calldata slices to memory or storage.
  - Custom detectors:
    - UnrealizedConversionCastOp is now decoded as Expression, preventing a crash on some benchmarks
## v1.0.12 - 2026-03-09
### Added
- DeFi Vanguard:
  - Custom detectors:
    - Added "calldata" property to SolidityExternalCallClassImpl
    - Addded "call-hijacking" detector to find low-level calls where the call data is potentially controlled by the attacker
  - Locked-funds detector:
    - Proxy patterns are now detected and appropriate warnings are displayed to users

### Fixed
- Solidity:
  - Fixed crash when handling a storage pointer assigned conditionally
  - Fixed crash when handling a mapping index with a string literal
  - Fixed a crash involving code that copies bytes calldata slices to memory or storage

### Changed
- ZK Vanguard:
  - Update LLZK-lib version and update lit tests and class naming accordingly
## v1.0.11 - 2026-02-12
### Added
- Locked Funds: new detector for finding contracts that may lock ERC20 tokens or native currency

### Changed
- Custom Detectors
  - Improved the presentation of the `Path` objects that are output
  - The `.location` property on `StorageRead` and `StorageWrite` classes can now return a string indicating multiple memory accesses
  - Updated PAQL grammar to support use of named operations in arbitrary expressions

### Fixed
- Custom Detectors
  - Fixed a bug that caused missed elements in forward slicing
  - Fixed a bug where `ExternalCall.signature` incorrectly contained spaces
  - Fixed crash when WHERE clause is a boolean literal
- Unchecked Return: fixed false alarms related to assert statements
## v1.0.10 - 2026-01-28
### Added
- Custom Detectors:
  - Added SliceValueIterator, allowing queries such as `Argument a IN call.backwardSlices`
  - Added `value` property to the `CallArgument` class, which returns the underlying value

### Changed
- ZK Vanguard:
  - Updated llzk-lib version
## v1.0.9 - 2026-01-26
### Added
- Custom Detectors
    - Added a new `CallArgument` PAQL class representing arguments of function calls, which can be obtained by iterating calls (e.g. FIND ExternalCall c, CallArgument a IN c)
    - Added `.isConcrete`, `isAbstract` properties to `Contract` PAQL class which can be used to filter concrete contract implementations

### Fixed
- Unchecked Return
    - Fixed false alarms involving call return values used as array indices or are written to memory
- Cross Contract Reentrancy
    - Fixed a bug that caused the detector to miss some vulnerability instances
## v1.0.8 - 2026-01-08
### Added
- Cross-Contract Reentrancy
  - Fixed a bug causing the AuditHub UI to crash on cross-contract reentrancy findings reported by Vanguard versions 1.0.6 and 1.0.7
- Custom Detectors
  - Support for integer and boolean literals

## v1.0.7 - 2025-12-29
### Changed
- custom-detectors:
  - Backwards path exploration does not stop at revert ops any more

### Fixed
- custom-detectors:
  - Fixed an infinite loop bug in incomingPaths and outgoingPaths iterator

## v1.0.6 - 2025-12-23
### Added
- custom-detectors:
  - Added "source" property to the SolidityValueClassImpl PAQL class
  - Added incomingPaths and outgoingPaths property that returns all paths coming into or going out from expressions and statements

### Changed
- custom-detectors:
  - The "address" property of ExternalCall PAQL class now returns a value instead of an expression
- cross-contract-reentrancy
  - Updated findings formatting and collected calltraces that reach external calls

### Fixed
- cross-contract-reentrancy
  - Fixed crashes while handling send statements

## v1.0.5 - 2025-12-09
### Fixed
- Divide Before Multiply:
  - Fixed timeout / hanging when running on large projects
  - Fixed redundant multiplication operations being reported for each divide.

## v1.0.4 - 2025-12-04
### Added
- Custom Detectors:
  - Added a `Function.definingContract` property to get the original contract that defined the function
  - Added ability for `StorageVar` to be iterated from `StorageRead` and `StorageWrite`

### Changed
- Custom Detectors:
  - Changed the `StorageVar.location` property string to indicate any mapping, array, or struct indices/fields that are accessed. This also fixes a crash that occurs if the storage location's variable cannot be determined.
  - Improved performance of the `.interprocForwardSlices` and `.interprocBackwardSlices` properties
- Solidity:
  - Added back end line/column when reporting source locations (originally implemented in DeFi Vanguard (Legacy))
- Added a timeout on Vanguard detectors to guard against bugs and abuse

### Fixed
- Divide Before Multiply:
  - Fixed a bug resulting in out-of-memory issues on large projects
- Unchecked Return:
  - Fixed false alarms when call results are used in reverts, custom errors, events, and abi.encode.
  - Fixed a bug where the detector would take a long time to run on large projects with many function calls.

## v1.0.3 - 2025-11-14
### Fixed
- ZK Vanguard: fix instability when running llzk/out-of-signals in tandem with llzk/divide-by-zero

## v1.0.2 - 2025-11-13
### Changed
- Out-of-Range Signals:
  - Improved interval analysis for struct field dereferences

### Fixed
- Custom Detectors:
  - Fixed `Function` iterator of `Function.reachable` property not including itself
- Divide Before Multiply:
  - Fixed out-of-memory issue on large projects
- Solidity:
  - Fixed a bug affecting functions with modifiers, where expressions inside them would be reported with the line number set to the modifier instead of the expression itself

## v1.0.1 - 2025-11-12
### Added
- Custom Detectors:
  - Add a title field to query definitions to allow customization of finding titles

### Changed
- Custom Detectors:
  - Each result of a custom detector is now reported in a separate finding, rather than all results of that custom detector reported in one finding

## v1.0.0 - 2025-11-11
### Added
- Initial release of a production-ready version of Vanguard, supporting Solidity and LLZK.
- Solidity detectors:
  - Cross-Contract Reentrancy
  - Divide Before Multiply
  - Unchecked Return
  - Use-Before-Def
- ZK detectors:
  - Out-Of-Range Signals
  - Underconstrained Signals
  - Underconstrained Outputs
  - Unused Fields
- Custom detectors feature, which provides the ability to write user-defined Vanguard detectors using a language called the Program Analysis Query Language (PAQL). Initially only supports Solidity, with more languages in the future.
- Support for Solidity 0.8.29 when no build system is selected
### Changed
- Reimplemented all of Vanguard's systems to be compatible with LLZK and a new Solidity frontend.
- Improve error reporting when a detector fails or is not configured correctly

### Removed
- Solidity detectors:
  - Simple Reentrancy - this can be replaced with a custom detector
  - Flashloan - this can be replaced with a custom detector
  - Locked Funds - to be added back in a future release

### Fixed
- Unchecked Return:
  - Fixed false alarms when call return values are storage pointers or are used to compute storage array indices/mapping keys.
- Divide Before Multiply:
  - Fixed issues where the detector would hang on large projects.
  - Fixed some instances of missed vulnerabilities
- Solidity:
  - Fixed vulnerabilities in or involving top-level functions not being reported
  - Fixed build failures when building Foundry projects that override the `out` setting in `foundry.toml`.
  - Fixed build failures when building Foundry projects that use large integers in `foundry.toml`
  - Fixed build failures that could occur when build system support is used with Hardhat projects with complex dependencies

## v0.3.11 - 2025-09-11
### Fixed
- Solidity:
  - Fixed a crash that could occur when building some Foundry projects
- Solidity - Fixed a crash when handling staticcalls with only 1 argument
- cross-contract-reentrancy - Fixed a assertion failure triggered due to handling of control flow emitted by exponetiation operation

## v0.3.10 - 2025-07-17
### Fixed
- Solidity:
  - 'Fixed a Hardhat build failure when `"type": "module"` is set in `package.json`'
  - Fixed a crash that could occur when using the `or()` operator in inline assembly

## v0.3.9 - 2025-07-03
### Fixed
- DeFi Vanguard
  - Fixed Foundry projects failing to build when `out` is overridden in `foundry.toml`
- ZK Vanguard
  - Improved array index sensitivity in analyses
## v0.3.8 - 2025-05-08
### Fixed
- DeFi Vanguard
  - Fixed an error that could occur when building Hardhat projects that are configured with hardhat.config.ts
  - Fixed a crash that occurs when handling inline assembly involving external calls
  - Fixed several nondeterministic crashes that involve handling of control flow statements.
## v0.3.7 - 2025-03-07
### Fixed
- DeFi Vanguard
  - Fixed a crash that occurs when handling contracts that read/write structs in Solidity 0.8.24 or newer
  - Fixed a crash that occurs when handling true/false literals in inline assembly code
  - Fixed a crash that occurs when handling low level calls that manual decode return data of an external call in inline assembly
## v0.3.6 - 2025-01-20
### Added
  - DeFi Vanguard
      - Added support for blobhash and blobbasefee EVM opcodes
      - Added support for tload and tstore EVM opcodes
      - Added experimental support for handling multiple solc versions within a project
      - Added support for running Vanguard directly from the output of Hardhat or Foundry
      - Added support for Solidity versions 0.8.27 and 0.8.28

### Fixed
  - DeFi Vanguard
      - Fixed a crash occurring when a source file contains a top-level event definition
      - Fixed a bug where external library functions that take as arguments storage pointers to nested mappings would have the wrong selectors
      - Fixed several crashes that can occur when a source file has storage arrays that contain string literals
      - Fixed a crash that occurs when a source file has inline assembly modifying a memory array

### Changed
  - DeFi Vanguard
      - When the Vanguard frontend suffers from an internal crash, it now reports a more helpful message.
## v0.3.5 - 2024-12-05
### Fixed
- DeFi Vanguard:
  - Fixes a bug for a case when a dynamic array of struct is present as a field in another struct
  - Fixes a bug which caused Vanguard to crash in case of revert with error followed by external call
- ZK Vanguard:
  - Fix inaccuracy in loop analyses
  - Added warnings and graceful handling for unsupported cases (instead of crashing)
## v0.3.4 - 2024-10-17
### Fixed
- DeFi Vanguard
  - Fixed a bug which caused Vanguard to crash in case of revert with error followed by external call.
  - frontrunning:
    - Fixed a bug in frontrunning detector that missed some reading functions.
- ZK Vanguard:
  - Fixed detector inaccuracies involving signal array elements.
- Shared Infrastructure:
  - Fixed line number diagnostics of individual statements missing the base/include directory in the file path.



## v0.3.3 - 2024-10-10
### Changed
- DeFi Vanguard:
  - dump-callgraph: Added additional information about contracts, to be displayed in the visualization tool.
  - divide-before-multiply:
      - Fixed a bug where the detector would report the wrong line number for the relevant multiplication operations
  - locked-funds:
      - Improved Performance on complex protocols
      - Eliminated false positives caused by interface/abstract contracts
- ZK Vanguard:
  - wit-constr-diff: Added filtering to avoid analysis of circomlib components.

## v0.3.2 - 2024-10-03
### Added
- DeFi Vanguard:
  - Preliminary support for solc `0.8.25` and `0.8.26`. `tload` and `tstore` opcodes are not supported yet.

### Fixed
- DeFi Vanguard:
  - Fixed a bug where state updates in arrays were not identified
  - Fixed frontend crash that occurs when a fixed length storage array has `2^32` or more elements.
  - Fixed the variable of an array `.push` being recognized as unknown locations in common cases

- ZK Vanguard:
  - Fixed subcomponent-related bugs
  - Fix file path diagnostics of circom files contained in "." being reported incorrectly when root directory is also "."

## v0.3.1 - 2024-09-24
### Added
- ZK Vanguard
  - Added subcomponent type information to finding descriptions
- DeFi Vanguard
  - Added a new cross contract reentrancy detector that reports state modifications in multiple contracts (not just the one being reentered into)
  - Added a detector for dumping the intercontract callgraph, which involves external calls between different contracts

### Changed

- DeFi Vanguard
  - Minor runtime performance improvements in some detectors

### Fixed
- ZK Vanguard
  - Removed unnecessary directory paths from FIO output
  - Fixed subcomponent metadata initialization.
  - Fixed a bug that caused some reported files paths to be prefixed with "./"

## v0.3.0 - 2024-08-30

### Added

- DeFi Vanguard:
    - Added support for identifying static calls to precompiled contracts
    - Added source location information to contract and function declarations
    - Added support for immutable variables
- ZK Vanguard:
    - Added ZK private input leakage detector
    - Added support for analyzing circom-level functions
- Shared Infrastructure:
    - Added support for build caching to speed up runs in SaaS
- dump-intracontract-callgraph:
    - New detector that creates graphs of the internal function calls within each contract
- dump-currency-value-flow-graph:
    - New detector that generates visualizations of native currency & ERC20 token value flow within a contract
- frontrunning:
    - New detector that reports if there are potential frontrunning vulnerabilities
- manual-inspection detector:
    - New detector that will flag locations that should be manually reviewed for security vulnerabilities.
    - Added rule for centralization risks, as indicated by (msg.sender == X) for some storage variable X
    - Added rule for detecting low-level calls that do not check the target is a smart contract
    - Added new detector that reports critical patterns that need to be verified
    - Added rule that flags use of ECDSA.recover, abi.encodePacked, hash functions, and block.number
    - Added rule that flags use of unsafe ERC20 functions transfer and approve
- report-access-control:
    - New detector that infers and reports privileged roles (as storage variables) in a smart contract.
- use-before-def:
    - Added filtering of stack variable alerts for known safe patterns, such as for-loops and simple summations, in order to reduce false positives
    - Added support for storage structs
    - Added filtering to avoid reporting storage variables if they are initialized by an obvious initialization function, reducing false positives
- zk-proof-replay:
    - New detector that reports potential proof replay vulnerabilities when making calls to auto-generated on-chain ZK proof verifier contracts.
- zk-public-inputs-valid:
    - New detector that reports unvalidated public input that are passed to an on-chain ZK proof verifier.
- locked-funds:
    - New detector that reports contracts that may lock native currency and ERC20 tokens.

### Changed

- ZK Vanguard:
    - Improved overall ZK detector performance and accuracy by optimizing ZK-specific analyses
    - Circom output is now cached
    - Signal locations now show the path of the file where they are declared
- Shared Infrastructure:
    - Added an option to emit file paths in diagnostics as paths relative to a given root directory
    - Made the order of reported issues more deterministic
    - Minor formatting adjustments
    - The default text output format has been updated
    - Updated how issues are sorted
- flashloan:
    - Update reporting to use external call names to improve clarity for external calls with multiple potential targets
- reentrancy:
    - Changed the format of the alerts to be more concise and more informative.
    - Reentry points are now displayed using the ABI name of the called (external) function instead of listing all possible call targets.
    - The detector no longer reports reentry points that can only be reached through functions with modifiers named "nonReentrant".
    - The source code location information of each state modification is now displayed.
- unchecked-return:
    - Reduced false positives when handling the return values of some functions that include in line assembly
    - Improved reporting for unchecked external calls
    - Reduced false negatives by improving handling of external calls
    - Improved runtime performance
    - Improved the format of the vulnerability report
- use-before-def:
    - To avoid duplicating alerts, vulnerabilities across different contracts that involve the same variable are now grouped in the same alert
    - Deduplicated inherited initializer functions from report (only report each initializer implementation once)
    - Changed the detector to classify vulnerable stack variables separately from vulnerable memory variables
    - Removed support for memory variable vulnerabilities
    - Improved efficiency of storage variable analysis
    - Reduced potential false negatives
    - Refactored detector to significantly reduce memory consumption
    - Improved runtime performance
    - Improved the format of the vulnerability report
- wit-constr-diff:
    - Improved the clarify of the detector reporting

### Fixed

- DeFi Vanguard:
    - Fixed a bug causing code in library functions to not be correctly considered as reads, writes, calls, or reverts.
    - Fixed a crash that occurs with overridden receive/fallback functions in some edge cases
    - Fixed names of internal library functions not being displayed correctly
    - Fixed some issues where detectors may fail to flag vulnerable calls to internal library functions
    - Fixed inherited functions being loaded incorrectly when there are multiple superclasses/interfaces declaring the same function
    - Fixed a bug causing superclass constructor code to not be analyzed in some situations involving multiple inheritance
    - Fixed inherited constructors not being loaded or analyzed correctly
    - Fixed a bug where some constructor declarations are not recognized correctly
    - Fixed overridden virtual fallback and receive functions not being recognized correctly
    - Fixed some bugs involving recognition of checked arithmetic operations
    - Fixed a crash that occurs when a string literal is used as an argument to a low level call
    - Fixed a crash that occurs when using an array of structs in a function
    - Fixed some crashes involving inline assembly
    - Fixed a crash involving a tuple assignment that could occur in specific cases
    - Fixed a bug causing top-level functions to be loaded as contract methods
    - Fixed crashes that occur when mappings are indexed with calldata strings
    - Fixed crashes in divide-before-multiply, use-before-def, and flashloan on certain projects
    - Fixed function parameters not being recognized correctly
- ZK Vanguard:
    - Fixed crash when loading Circom sources
    - Fixed crash that can occur during circuit constraint analysis
    - Fixed assertion failure in caused by frontend optimizations
    - Fixed detection of constants loaded from an array parameter of a template
    - Resolved ZK detector crashes and inaccuracies caused by issues in ZK-specific analyses
- Shared Infrastructure:
    - Fixed crash that can occur when reporting issues
    - Fixed some subtle bugs causing detectors to fail for unknown reasons
    - Minor runtime performance improvements
- reentrancy:
    - Fixed external calls in constructors being considered as reentry points
    - Fixed false positive when storage write occurs in fallback/receive
    - Fixed .send/.transfer being considered as reentry points
- uc-outputs:
    - Fixed crash that occurred during analyses of a small number of projects
- unchecked-return:
    - Fixed bug where all call targets could be printed for external calls with unknown selector
    - Fixed a bug where passing gas, value, or call address of an external call didn't count as a use.
    - Fixed unchecked return values in internal library functions not being reported
- unused-subcmps:
    - Fixed inaccuracies caused by frontend changes
- use-before-def:
    - Fixed bug where calling a function that always reverts wasn't considered as a revert, leading to false positives
    - Fixed uninitialized stack and memory variables in internal library functions not being reported
    - Fixed a bug that caused some some alerts to be missed in large projects
- wit-constr-diff:
    - Fixed errors in analysis that incurred false positives and false negatives
- zk-divide-by-zero:
    - Improved analysis by addressing uncovered division operations

### Removed

- ZK Vanguard:
    - Removed dump-cdg detector
## v0.2.1 - 2023-10-27
### Changed
- dump-cdg:
  - Add size limit for generated graph to prevent graphviz rendering errors

### Fixed
- unchecked-return:
  - Fixes bug where a call to a non-void function could be considered a void function
  - When there are multiple possible targets for a function call report all non-void possible targets rather than just the first
- zkVanguard:
  - Remove circom compiler error color codes for better rendering in SaaS logs

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

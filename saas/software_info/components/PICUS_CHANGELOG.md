---
sidebar_position: 4
sidebar_label: Picus
title: Software Changes
slug: picus-changelog
---
# Software Changes

## v1.0.3 - 2024-08-30
### Added
- Support more inequality operators
- Support extra constraint clause in sr1cs.

### Changed
- Optimized the R1CS reader.
- Changed the test runner to only run tests that are not expecting a timeout. The full test run can still be invoked via the `--slow` flag.
- Changed the variable representation. Instead of creating variables like `x1` and `y1` and use them in the two "series" at the very beginning, thus necessitating that we keep constraints from both "series" in sync, this commit switches the variable representation to a pure integer. Then, we concretize `1` into `x1` or `y1` at the very final step before we submit it to the solver. This has a slight performance benefit, but the main advantage is easier maintenance.
- Updated README for a public release.
- Updated command line help and readme
- Updated installation guide for cvc5.
- Updated the benchmarks to use the latest format for picus_gnark


### Fixed
- Fixed `--help` descriptions that are out of sync.
- Fixed potential name crash when running the same benchmark with different solvers.
- Fixed the performance issue in linear lemma.
- Fixed the test runner so that it partitions work across threads correctly even when there's a test failure.
- Updated the sr1cs format to remove the `num-wires` clause.

### Removed
- Moved the documentation for gnark integration to github.com/Veridise/picus_gnark

## v1.0.2 - 2023-11-02
### Fixed
- Fixed ANSI codes not stripped away correctly

## v1.0.1 - 2023-11-01
### Fixed
- Fixed the format of accounting logging in the --json mode.

## v1.0.0 - 2023-10-26
### Changed
- Changed the supported Circom version from 2.0.7 to 2.1.6.

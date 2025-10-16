---
sidebar_position: 5
sidebar_label: Picus-v2
title: Software Changes
slug: picus-v2-changelog
---
# Software Changes

## v1.0.0 - 2025-04-17
### Added
- Add a multi-solver option which runs both cvc5-int and cvc5-ff on every SMT query.
- Add a new optional parameter --apply-rewrites which, when enabled, causes Picus to rewrite constraints into a form more friendly for its uniqueness propagators. Currently disabled by default as it is not robustly tested.
- Added a new construct `assume-deterministic` to the picus language which allows user to directly specify whether a signal is deterministic even if it isn't an input to the circuit. This is useful for AIR based circuits which reference signals in previous columns.
- More error checking on inputs. We now validate that the call graph is not recursive and that all calls to submodules point to actual subcircuits.

### Changed
- Made the range analysis fully context sensitive and interprocedural
- Making --apply-rewrites true by default
- Memoizing determinism proofs of submodules
- Reduced the default solver timeout amount to 1sec

### Fixed
- Added validation to check whether modules have at least one output signal
- Fixed incorrect encoding of constraints to Z3 and implemented a model parser to handle the complex models Z3 can produce
- Fixed issue parsing negative numbers.

### Removed
- Disable linear propagator for now

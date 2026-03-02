---
sidebar_position: 4
sidebar_label: Picus 
title: Software Changes
slug: picus-v2-changelog
---
# Software Changes

## v1.1.4 - 2026-03-02
### Added
- Configuration:
  - bitwuzla solver
  - z3bv solver
  - cvc5-bv solver
- bitvector solver encoding
- bitwuzla solver

## v1.1.3 - 2026-02-02
### Added
- Added SMT optimization for call encodings
- print statements to show Picus results when analyzing sub-modules

### Fixed
- Fix Picus stalling when using z3 on large files.

## v1.1.2 - 2026-01-21
### Changed
- Disabling rewrites by default
- Internal refactor.

### Fixed
- Fix mistake where we record modules as verified multiple times
- Fixed a particular class of spurious counterexamples which showed calls to submodules as nondeterministic when they were actually deterministic.
- Fixed a range analysis bug which was causing Picus to incorrectly report circuits as overconstrained.

## v1.1.1 - 2025-11-17
### Added
- Extended PCL to support a `det` predicate which asserts that an expression is deterministic

## v1.1.0 - 2025-10-16
### Added
- Added the ability to reason about conditionals without else branches.
- Allowing conditional guards to be expressed using = and != predicates.
- Picus findings are now visible on the findings table.
- Picus now emits informational findings when the analysis contains unknown results.
- Support for conditionals in the Picus Constraint Language and updated the verification logic and range analysis to handle conditionals in a limited fashion for now.
- Support for specifying and verifying postconditions for modules. Currently those postconditions are not used in the parent modules.
- Utilize postconditions during verification.

### Changed
- Conditionals of the form (if `poly` (A) (B)) have the semantics `poly` != 0 => A /\ `poly` = 0 => B. This is the more natural semantics in ZK circuits since these statements are lowered to constraints by multiplying the constraints by `poly` in the then branch.
- Update existing functionality

### Fixed
- Adding back two functional tests.
- Fix issue where Picus skips over intermediate signals during solver loop
- Fixed an unreported issue where module assumptions were not given to the solver.
- Picus terminates gracefully when the input encoding does not have any valid assignments.

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

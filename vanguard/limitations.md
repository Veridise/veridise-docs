---
title: Limitations
sidebar_position: 5
---

This page describes several limitations in the current version of Vanguard.

## Assumptions

* Vanguard operates on the Yul IR code of non-abstract Solidity smart contracts.
  It cannot analyze abstract contracts, since solc will not generate code for
  them.
* Because it is not possible in general to know what code may be invoked by an
  external call, Vanguard makes conservative assumptions about the side effects
  of each external call that it cannot resolve.
  For example, if a call target is not restricted to concrete contracts known to
  Vanguard, then Vanguard will assume the call target may reenter, modify other
  contract state, etc.

## Unsupported Features

* Not all inline assembly is supported. Some inline assembly patterns may cause
  Vanguard to crash, although the Vanguard team has tried to minimize these
  occasions.
* Reasoning about `delegatecall` (such as when making calls to external library
  functions) is limited.
  For example, detectors will not recognize state modifications made in external
  library functions.
* Vanguard does not fully support struct fields, and it currently treats
  reads/writes to a single field as reading/writing from the entire struct.
* Vanguard does not fully support reasoning about specific array indices.
  Reads/writes to a single index will be treated as a read/write to the entire
  array.
* Projects that use non-standard storage layouts are not fully supported by the
  detectors in Vanguard; such non-standard locations will be treated as
  "unknown" locations, resulting in additional false negatives and false
  positives.

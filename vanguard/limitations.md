---
title: Limitations
sidebar_position: 5
---

This page describes several limitations in the current version of Vanguard.

## Assumptions

* Vanguard operates on the Yul IR code of non-abstract Solidity smart contracts.
  It cannot analyze abstract contracts, since the Solidity compiler will not
  generate code for them.
* Vanguard cannot analyze internal functions or top-level functions that are
  never used, since the Solidity compiler will not generate code for them.
* Because it is not possible in general to know what code may be invoked by an
  external call, Vanguard makes conservative assumptions about the side effects
  of each external call that it cannot resolve.
  For example, if a call target is not restricted to concrete contracts known to
  Vanguard, then Vanguard will assume the call target may reenter, modify other
  contract state, etc.
* Accesses to `immutable` variables are not treated as storage accesses, because
  they do not perform any storage operations.

## Unsupported Features

* Vanguard makes "best effort" support for inline assembly, and it has been
  tested to run successfully on large projects that make heavy use of inline
  assembly.
  However, some patterns may cause may cause Vanguard to crash or to lose
  precision in its analysis, although the Vanguard team has tried to minimize
  these occasions.
* Vanguard does not fully support reasoning about specific array indices.
  Reads/writes to a single index will be treated as a read/write to the entire
  array.
* Projects that use non-standard storage layouts are not fully supported by the
  detectors in Vanguard; such non-standard locations will be treated as
  "unknown" locations, resulting in additional missed vulnerabilities and false
  alarms.

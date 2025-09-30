---
sidebar_position: 0
title: OrCa Overview
---

Welcome to the documentation for OrCa, a fuzzer for smart contracts which automatically discovers bugs in DeFi applications.

Like other smart contract fuzzers, OrCa discovers bugs in DeFi applications by generating and running thousands of (psuedo-)random inputs against a target application. However, OrCa enjoys a number of features that distinguish it from other fuzzers on the market, including:

- Integration with [the [V] specification language](user_guide/v/overview.md) which allows OrCa to find violations of complex temporal properties without changes to the source code.
- Automated detection of reentrancy vulnerabilities.
- Integration with [the OrCa Hint language](user_guide/hints/hint_language_description.md) which allows users to fine-tune OrCa's fuzzing for integration with more complex protocols, such as those that require specific cryptographic inputs.
- A built-in [Specification Library](user_guide/v/specification_library.md) that enables OrCa to automatically detect bugs across a wide variety of common protocols.

## Quickstart

Want to hit the ground running? Checkout [the guide here](getting_started/running_orca_through_saas.md) for an example-based introduction to OrCa.

## User Guide

Need more detailed information about OrCa and all of its bells and whistles? Check [the user guide](user_guide/) which documents how to configure OrCa, the [V] and hint lanaguages, common tips and tricks for effective fuzzing with OrCa, and much more!
